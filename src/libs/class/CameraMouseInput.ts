import { debug } from 'util';
export default class CameraMouseInput {
    camera;

    public buttons = [0, 1, 2];

    public angularSensibility = 2000.0;

    private _pointerInput: (p: BABYLON.PointerInfo, s: BABYLON.EventState) => void;
    private _onMouseMove;
    private _observer;
    private pointers: any = { size: 0 };
    private previousPosition = null;

    constructor(public touchEnabled = true) {
    }

    attachControl(element: HTMLElement, noPreventDefault?: boolean) {
        let camera = this.camera;
        let engine = camera.getEngine();
        let moved = false;
        if (!this._pointerInput) {
            this._pointerInput = (p, s) => {

                let evt = <PointerEvent>p.event;
                let pointerId = evt.pointerId;
                if(pointerId===undefined&&evt.type!=="mousewheel")return ;
                if (engine.isInVRExclusivePointerMode) {
                    return;
                }
                if (!this.touchEnabled && evt.pointerType === "touch") {
                    return;
                }
                if (p.type !== BABYLON.PointerEventTypes.POINTERMOVE && this.buttons.indexOf(evt.button) === -1) {
                    return;
                }

                if (p.type === 4) {
                    // debugger;
                }

                let srcElement = <HTMLElement>(evt.srcElement || evt.target);

                if (p.type === BABYLON.PointerEventTypes.POINTERDOWN && srcElement) {
                    moved = false;
                    try {
                        srcElement.setPointerCapture(pointerId);
                    } catch (e) {
                        //Nothing to do with the error. Execution will continue.
                    }
                    let posObj = {
                        x: evt.clientX,
                        y: evt.clientY,
                        deltaX: 0,
                        deltaY: 0
                    };
                    if (this.pointers.size < 2) {
                        if(!this.pointers[pointerId]){
                            this.pointers.size++;
                        }
                        this.pointers[pointerId] = posObj;
                        
                    }

                    if (!noPreventDefault) {
                        evt.preventDefault();
                        element.focus();
                    }
                }
                else if (p.type === BABYLON.PointerEventTypes.POINTERUP && srcElement) {
                    try {
                        srcElement.releasePointerCapture(pointerId);
                    } catch (e) {
                        //Nothing to do with the error.
                    }
                    if (moved) {
                        let mesh = camera.controlObj;
                        // this.camera._centerPos = mesh.getAbsolutePosition().negate();
                        // camera.controlObj.setPivotPoint(BABYLON.Vector3.Zero(), BABYLON.Space.WORLD);
                        // mesh.computeWorldMatrix();
                    }
                    if(this.pointers[pointerId]){
                        delete this.pointers[pointerId];
                        this.pointers.size--;
                    }
                    if (!noPreventDefault) {
                        evt.preventDefault();
                    }
                }

                else if (p.type === BABYLON.PointerEventTypes.POINTERMOVE) {
                    let previousPosition = this.pointers[pointerId];
                    if (!previousPosition || engine.isPointerLock) {
                        return;
                    }
                    let mesh = camera.controlObj;
                    //  在播放过渡动画的时候不要进行旋转 在camera.stop为true的时候，也就是当点击了单个的原子的时候，不要旋转
                    if (mesh.isAnimating) return;
                    let offsetX = evt.clientX - previousPosition.x;
                    let offsetY = evt.clientY - previousPosition.y;
                    previousPosition.deltaX = offsetX;
                    previousPosition.deltaY = offsetY;
                    previousPosition.x = evt.clientX;
                    previousPosition.y = evt.clientY;
                    offsetX /= this.angularSensibility;
                    offsetY /= this.angularSensibility;
                    let buttonType = p.event.buttons;
                    let pointers = this.pointers;
                    if (pointers.size === 2) {
                        let ary = [];
                        for (let k in pointers) {
                            let obj = pointers[k];
                            if(obj instanceof Object){
                                ary.push(pointers[k]);
                            }
                        }
                        let [p1, p2] = ary;
                        let dis1 = Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
                        let dis2 = Math.sqrt(Math.pow(p1.x + p1.deltaX - p2.x - p2.deltaX, 2) + Math.pow(p1.y + p1.deltaY - p2.y - p2.deltaY, 2));
                        let delta = dis2 - dis1;
                        this.camera.radius += -delta / 80;
                        let moveX = (p1.deltaX + p2.deltaX) / this.angularSensibility * 2;
                        let moveY = -(p1.deltaY + p2.deltaY) / this.angularSensibility * 2;
                        this.moveMesh(mesh, moveX, moveY);
                        moved = true;

                    } else if (buttonType === 2 && evt.pointerType === "mouse") {
                        this.moveMesh(mesh, offsetX * 10, -offsetY * 10);
                        moved = true;
                    } else {
                        this.rotateMesh(mesh, offsetX, offsetY);
                    }
                    // if (buttonType === 2) {
                    //     this.moveMesh(mesh, offsetX * 10, -offsetY * 10);
                    // } else {
                    //     if (camera.stop) {
                    //         offsetX /= 5;
                    //         offsetY /= 5;
                    //     }
                    //     let angle = Math.sqrt(offsetX * offsetX + offsetY * offsetY) * 15;
                    //     if (angle > Math.PI / 5) angle = Math.PI / 5;
                    //     if (angle === 0) return;
                    //     let axis = BABYLON.Vector3.Cross(new BABYLON.Vector3(offsetX, -offsetY, 0), new BABYLON.Vector3(0, 0, 1));
                    //     mesh.rotate(axis, angle, BABYLON.Space.WORLD);
                    // }

                    if (!noPreventDefault) {
                        evt.preventDefault();
                    }
                    //////////////////////////////////////////////////////////////////////////////////////////////
                } else if (p.type === BABYLON.PointerEventTypes.POINTERWHEEL) {
                    let delta = (evt as any).deltaY / 100;
                    let camera = this.camera;
                    camera.radius += delta;

                }
            }
        }

        this._onMouseMove = evt => {
            if (!engine.isPointerLock) {
                return;
            }

            if (engine.isInVRExclusivePointerMode) {
                return;
            }

            var offsetX = evt.movementX || evt.mozMovementX || evt.webkitMovementX || evt.msMovementX || 0;
            var offsetY = evt.movementY || evt.mozMovementY || evt.webkitMovementY || evt.msMovementY || 0;

            if (this.camera.getScene().useRightHandedSystem) {
                this.camera.cameraRotation.y -= offsetX / this.angularSensibility;
            } else {
                this.camera.cameraRotation.y += offsetX / this.angularSensibility;
            }

            this.camera.cameraRotation.x += offsetY / this.angularSensibility;

            this.previousPosition = null;

            if (!noPreventDefault) {
                evt.preventDefault();
            }
        };

        this._observer = this.camera.getScene().onPointerObservable.add(this._pointerInput, BABYLON.PointerEventTypes.POINTERDOWN | BABYLON.PointerEventTypes.POINTERUP | BABYLON.PointerEventTypes.POINTERMOVE | BABYLON.PointerEventTypes.POINTERWHEEL,true);
        // element.addEventListener("mousemove", this._onMouseMove, false);
        // element.addEventListener("touchmove", this._onMouseMove, false);

    }
    moveMesh(mesh, x, y) {
        // if(mesh.justShow)return ;
        // mesh.position.x += x;
        // mesh.position.y += y;
    }
    rotateMesh(mesh, x, y) {
        let angle = Math.sqrt(x * x + y * y) * 15;
        if (angle > Math.PI / 5) angle = Math.PI / 5;
        if (angle === 0) return;
        let axis = BABYLON.Vector3.Cross(new BABYLON.Vector3(x, -y, 0), new BABYLON.Vector3(0, 0, 1));
        // axis = BABYLON.Vector3.TransformCoordinates(axis, (window as any).demo.atoms[0].body.parent.computeWorldMatrix(true).clone().invert());
        mesh.rotate(axis, angle, BABYLON.Space.WORLD);
    }


    detachControl(element) {
        if (this._observer && element) {
            this.camera.getScene().onPointerObservable.remove(this._observer);

            if (this._onMouseMove) {
                element.removeEventListener("mousemove", this._onMouseMove);
            }

            this._observer = null;
            this._onMouseMove = null;
            this.previousPosition = null;
        }
    }

    getClassName(): string {
        return "FreeCameraMouseInput";
    }

    getSimpleName() {
        return "mouse";
    }
}
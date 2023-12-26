export default class Camera {
    public camera
    public minRadius = 2;
    // centerPos是当前摄像机关注的中心
    private _centerPos: BABYLON.Vector3 = BABYLON.Vector3.Zero();
    public set centerPos(v) {
        if (this.camera.target.equals(v)) return;
        let relPos = this.camera.main.centerAtom.body.getPositionInCameraSpace(this.camera);
        let alpha = this.camera.alpha;
        let beta = this.camera.beta;
        this.camera.target = v.clone();
        this.camera.targetScreenOffset.x = relPos.x;
        this.camera.targetScreenOffset.y = relPos.y;
        this.camera.radius = relPos.z;
        this.camera.alpha = alpha;
        this.camera.beta = beta;
    }

    public get centerPos() {
        return this._centerPos;
    }

    constructor(scene: BABYLON.Scene, canvas: HTMLCanvasElement, atomMain) {
        this.camera = new BABYLON.ArcRotateCamera("ArcRotateCamera", -Math.PI / 2, Math.PI / 2, 10, new BABYLON.Vector3(0, 0, 0), scene);
        this.camera.fov = 1;
        // this.camera.inputs.attached.pointers.buttons = [0];
        this.camera.panningSensibility = 2500;
        // 将相机附加到场景
        scene.activeCamera = this.camera;
        this.camera.attachControl(canvas, true);
        this.camera.angularSensibilityX = 2500;
        this.camera.angularSensibilityY = 2500;
        // 调整缩放速度
        this.camera.wheelPrecision = 15; // 鼠标滚轮缩放速度
        this.camera.pinchPrecision = 15; // 触摸缩放速度
        this.camera.upperBetaLimit = Infinity;
        this.camera.lowerBetaLimit = -Infinity;
        this.camera.upperAlphaLimit = Infinity;
        this.camera.lowerAlphaLimit = -Infinity;
        this.camera.main = atomMain;
        this.init();
    }

    private init() {
        let camera = this.camera;
        this.camera.upperRadiusLimit = 30;
        this.camera.lowerRadiusLimit = 5;
        // 设置相机的目标点
        camera.setTarget(BABYLON.Vector3.Zero());
        // Object.defineProperty(camera, "radius", {
        //     set: function (v) {
        //         if(isNaN(v)||this.controlObj.justShow)return ;
        //         if (v < this.minRadius){
        //             v=this.minRadius;
        //         }
        //         this._radius = v;
        //         this.position.z = -v;
        //     },
        //     get: function () {
        //         return this._radius;
        //     }
        // });
        // camera.controlObj = this.atomMain.parent;
    }

    public addControl(element: HTMLElement, noPreventDefault?: boolean) {
        // this.camera.inputs.attachElement(element, noPreventDefault);
        // this.camera.inputs.add(new CameraMouseInput());
    }

    // private translateToNewPos(newPos) {
    //     let atomMain = this.atomMain;
    //     newPos = newPos.clone();
    //     let mesh = atomMain.parent;
    //     // 问题出在这里
    //     // mesh.setPivotPoint(BABYLON.Vector3.Zero());
    //     // mesh.computeWorldMatrix();
    //     let targetPos = BABYLON.Vector3.TransformCoordinates(newPos, mesh._worldMatrix).negate();
    //     if (atomMain.meshAnimation) {
    //         return;
    //     }
    //     let ani = BABYLON.Animation.CreateAndStartAnimation("transitionCamera", mesh, "position", 60, 15, mesh.position, mesh.position, 0);
    //     mesh.isAnimating = true;
    //     this._centerPos = newPos;
    //     ani.onAnimationEnd = () => {
    //         // mesh.setPivotPoint(newPos);
    //         mesh.computeWorldMatrix();
    //         mesh.isAnimating = false;
    //         this._centerPos = newPos;
    //         if (atomMain.choosedAtom === atomMain.centerAtom) {
    //             atomMain.choosedAtom = null;
    //         }
    //         atomMain.meshAnimation = null;
    //         atomMain.atomAnimationAry.forEach((atomAni) => {
    //             atomAni.stop();
    //         })
    //         // mesh.position.x = -targetPos.x;
    //         // mesh.position.y = -targetPos.y;
    //         // mesh.position.z = -targetPos.z;

    //     }
    //     atomMain.meshAnimation =
    //     {
    //         ani: ani,
    //         position: targetPos
    //     };

    // }
}




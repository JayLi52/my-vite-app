// @ts-nocheck

import DataService from "../services/DataService";
import CalculateService from "../services/CalculateService";
import AvailablePosition from "../class/AvailablePosition";
import Bound from "./Bound";
import Angle from "./Angle";
import nb from "./const";
import Main from "../../main";
import { createLine } from '../utils/createAxes'
export default class Atom {
    // 原子的名字
    // 原子所在的位置
    // 原子可以连接的位置
    /** 这个数组里的值应该是这个样子
     *  {        原子 单电子 孤对电子 空（可能不需要）
     *      atom:Atom||1||2||0,
     *      position:[n,e],
     *      value:0||1||2||3
     *  }
     */
    private _id: string = "#" + Math.round(Math.random() * 1e10);
    // 该原子的相关数据
    private data: Object;
    /**每一波更新会有新的changeId生成，每个被更新的原子会被附上新的id*/
    public changeId: number;
    public existingDirection: Array<AvailablePosition> = [];
    /**所有可用的位置*/

    public availablePos: Array<AvailablePosition> & { gotBounds?: number} = [];
    /** 自由的、游离的、可以成键的电子数*/
    private _freeElectron: number = 0;
    public functionalGroup: boolean = false;
    private preInterectionClick: boolean;
    isPreInteraction: any;
    color: any;
    root: Main;
    lastAvailablePos: any;
    /** 自由的、游离的、可以成键的电子数*/
    public set freeElectron(v) {
        this._freeElectron = v;
    }
    public get freeElectron() {
        return this._freeElectron;
    }
    private oldPos: any;
    private _radius: number;
    private defaultRadius: number;
    public set radius(v) {
        if (this._radius === v) {
            return;
        }
        this._radius = v;
        if (this._radius) {
            let targetScale = v / this.defaultRadius;

            let scale = new BABYLON.Vector3(targetScale, targetScale, targetScale);
            BABYLON.Animation.CreateAndStartAnimation(
                "transitionCamera",
                this.body,
                "scaling",
                60,
                15,
                this.body.scaling,
                scale,
                0
            );
            // 更改缩放的动画
        }
    }
    public get radius() {
        return this._radius;
    }
    /**显示比例模型*/
    private _showReal: boolean = null;
    /**显示比例模型*/
    public set showReal(v) {
        v = Boolean(v);
        if (this._showReal === v) return;
        this._showReal = v;
        if (v) {
            this.radius = (this.data as any).radius * nb.ATOM_RADIUS_SCALE * 0.8;
        } else {
            this.radius = this.defaultRadius;
        }
    }
    public get showReal() {
        return this._showReal;
    }
    /**GUI 显示原子名字的textBlock*/
    private text;
    private _showName: Boolean = null;
    public set showName(v) {
        v = Boolean(v);
        if (v === this._showName) return;
        this._showName = v;
        this.text.alpha = Boolean(v);
    }
    public get showName() {
        return this._showName;
    }
    public body: BABYLON.Mesh;
    private scene: BABYLON.Scene;
    public shouldPos: BABYLON.Vector3 = BABYLON.Vector3.Zero();
    public set position(v: BABYLON.Vector3) {
        let oldPos = this.body.position;
        if (oldPos.x === v.x && oldPos.y === v.y && oldPos.z === v.z) {
            return;
        }
        this.shouldPos = v;
        this.body.position = v;
        // if (this.atomMain.centerAtom === this) {
        //     this.atomMain.centerAtom = this;
        // }
        let atomMain = this.atomMain;
        let mesh = atomMain.parent;

        this.body.isAnimating = true;
        let ani = BABYLON.Animation.CreateAndStartAnimation("add", this.body, "position", 60, 15, oldPos, v, 0);
        atomMain.atomAnimationAry.push(ani);
        if (this === atomMain.centerAtom && atomMain.meshAnimation) {
            this.oldPos = oldPos;
        }
        // ani.onAnimationEnd = () => {
        //     if (this === atomMain.centerAtom && atomMain.meshAnimation && atomMain.meshAnimation.onAnimationEnd) {
        //         this.atomMain.parent.position.x = this.atomMain.meshAnimation.position.x;
        //         this.atomMain.parent.position.y = this.atomMain.meshAnimation.position.y;
        //         this.atomMain.parent.position.z = this.atomMain.meshAnimation.position.z;
        //         this.atomMain.meshAnimation.ani.stop(); // 调用meshAnimation
        //     }
        //     this.body.isAnimating = false;
        //     this.body.position = this.shouldPos;
        //     let index = atomMain.atomAnimationAry.indexOf(ani);
        //     if (index !== -1) {
        //         atomMain.atomAnimationAry.splice(index, 1);
        //     } else {
        //         throw "怎么可能没有呢？？";
        //     }
        // };
    }
    public get position() {
        return this.body.position;
    }
    /** 键角们*/
    public angles: Set<Angle> = new Set();

    constructor(public atomMain: Main, public name: string, preInteraction: boolean) {
        this.root = atomMain;
        this.init(preInteraction);
    }
    /**
     * 根据要创建的原子的类型，获取相关的数据，如模型半径，颜色，键长
     **/
    private getMaterial(preInteraction) {
        let data = (this.data = DataService.getAtomData(this.name));
        this.defaultRadius = (data.radius / 200 + 0.5) * 0.8;
        this._showReal = null;
        this._radius = this.defaultRadius;
        // 初始值为核外电子数
        this.freeElectron = data.freeElectron;

        let material = new BABYLON.StandardMaterial("atom", this.scene);
        material.backFaceCulling = false;
        material.twoSidedLighting = true;
        let color = data.color;
        this.color = color;
        material.diffuseColor = new BABYLON.Color3(color[0], color[1], color[2]);
        if (preInteraction) {
            material.alpha = 0.4;
        }

        let sphere: any = this.body = BABYLON.Mesh.CreateSphere("sphere", 32, this.defaultRadius, this.scene);
        this.showReal = this.atomMain.showReal;
        sphere.material = material;
        sphere.parent = this.atomMain.parent;
        sphere.atom = this;

        this.createLocalAxis();
    }
    private createLocalAxis() {
        const array3 = CalculateService.generalPosData[3];
        const array4 = CalculateService.generalPosData[4];

        createLine('aAxis', this.scene, [new BABYLON.Vector3(0, 0, 0), new BABYLON.Vector3(array4[0].x, array4[0].y, array4[0].z)], [1, 0.5, 1], this.body);
        // createLine('bAxis', this.scene, [new BABYLON.Vector3(0, 0, 0), new BABYLON.Vector3(array4[1].x, array4[1].y, array4[1].z)], [1, 0.5, 1], this.body);

        // createLine('cAxis', this.scene, [new BABYLON.Vector3(0, 0, 0), new BABYLON.Vector3(array4[2].x, array4[2].y, array4[2].z)], [1, 0.5, 1], this.body);
        // createLine('dAxis', this.scene, [new BABYLON.Vector3(0, 0, 0), new BABYLON.Vector3(array4[3].x, array4[3].y, array4[3].z)], [1, 0.5, 1], this.body);
        createLine('bAxis', this.scene, [new BABYLON.Vector3(0, 0, 0), new BABYLON.Vector3(array3[1].x, array3[1].y, array3[1].z)], [0.5, 0.5, 0], this.body);
        createLine('cAxis', this.scene, [new BABYLON.Vector3(0, 0, 0), new BABYLON.Vector3(array3[2].x, array3[2].y, array3[2].z)], [0.5, 0.5, 0], this.body);
    }

    public getId() {
        return this._id;
    }

    public init(preInteraction) {
        this.scene = this.atomMain.scene;
        this.isPreInteraction = preInteraction;
        this.availablePos.length = 0;
        this.availablePos.gotBounds = 0;
        this.changeId = -1;
        this.freeElectron = 0;
        this.shouldPos = BABYLON.Vector3.Zero();
        this.getMaterial(preInteraction);
        this.body.position = new BABYLON.Vector3(0, 0, 0);
        this.angles.clear();
        this.initText();
        this.addListeners();
    }
    private initText() {
        let text = (this.text = new BABYLON.GUI.TextBlock("text", this.name));
        // TODO 选用相反的颜色
        text.shadowColor = "white";
        text.shadowBlur = 8;
        text.fontSize = 30;
        let advancedTexture = this.atomMain.advancedTexture;
        advancedTexture.addControl(text);
        this._showName = null;
        this.showName = this.atomMain.showName;
        // text.linkWithMesh(this.body);
    }
    /**
     * 添加事件
     */
    private addListeners() {
        // 添加双击切换中心原子的action事件
        let lastTime = -1;
        let action = new BABYLON.ExecuteCodeAction(
            BABYLON.ActionManager.OnPickDownTrigger,
            (e) => {
                if (e.sourceEvent.pointerId === undefined) return;
                let newTime = Date.now();
                if (newTime - lastTime < 300) {
                    this.atomMain.centerAtom = this;
                }
                lastTime = newTime;
            }
        );
        // 点击预交互原子事件

        
        // let clickAction = new BABYLON.ExecuteCodeAction(
        //     BABYLON.ActionManager.OnPickUpTrigger,
        //     (e) => {
        //         this.preInterection(true);
        //     }
        // );

        let hoverAction = new BABYLON.ExecuteCodeAction(
            BABYLON.ActionManager.OnPointerOverTrigger,
            (event) => {
                // 在这里处理hover事件
                this.atomMain.isHoverAtom = this;
                this.preInterection(false);
            }
        );
        let outAction = new BABYLON.ExecuteCodeAction(
            BABYLON.ActionManager.OnPointerOutTrigger,
            (event) => {
                // 在这里处理out事件
                this.atomMain.isHoverAtom = null;
                this.delPreInterection();
            }
        );

        // 添加监听器
        this.atomMain.eventService.addListener(this.body, outAction);

        // 添加监听器
        this.atomMain.eventService.addListener(this.body, hoverAction);
        this.atomMain.eventService.addListener(this.body, action);
        // this.atomMain.eventService.addListener(this.body, clickAction);
    }

    public preInterection(isClick) {
        if (!this.isPreInteraction && !isClick) return;
        this.preInterectionClick = isClick;
        this.body.material.alpha = 1;
        if (isClick) {
            this.atomMain.canchoose = true;
            this.isPreInteraction = false;
        }
    }

    private delPreInterection() {
        if (this.preInterectionClick === false) {
            this.body.material.alpha = 0.4;
            this.isPreInteraction = true;
        }
    }
    /**
     * atom 要连接上的原子
     * type 连接的键的类型，单键、双建、三键
     * pos 连接的位置（可选）
     */
    public addAtom(atom: Atom, name, boundValue: number, preInteraction: boolean) {
        CalculateService.adjoinTwoAtom(this, atom, name, boundValue, null, preInteraction);
        this.updateAngle();
    }
    // 更新键角的显示
    private updateAngle(avaiLength = this.availablePos.gotBounds - 1) {
        let availablePos = this.availablePos;
        let obj1 = availablePos[avaiLength];
        let first: Atom = obj1.atom;
        for (let i = 0; i < avaiLength; i++) {
            let obj2 = availablePos[i];
            if (
                avaiLength > 1 &&
                Math.abs(BABYLON.Vector3.Dot(obj1.position, obj2.position)) === 1
            ) {
                continue;
            }
            let angle = new Angle(first, this, availablePos[i].atom);
            this.angles.add(angle);
        }
    }
    /**
     * 切换选中或者取消选中的显示状态
     * @param choosed 是否被选中
     */
    public changeStatus(choosed: boolean) {
        if (choosed) {
            // this.body.material.alpha=.5;
            this.atomMain.highlight.addMesh(
                this.body,
                new BABYLON.Color3(0.2, 0.2, 0.2)
            );
        } else {
            this.atomMain.highlight.removeMesh(this.body);
            // this.body.material.alpha=1;
        }
    }
    public getOccupiedElectron() {
        return (this.data as any).freeElectron - this.freeElectron;
    }

    public checkChange(atom?, keyValue?) {
        let occupiedElectron = this.getOccupiedElectron();
        if (atom) {
            let data = DataService.getAtomData(atom);
            return Boolean(data && data.freeElectron >= occupiedElectron);
        }
        return occupiedElectron;
    }

    public changeAtom(atomName: string) {
        if (atomName === this.name) return;
        this.name = atomName;
        let pos = this.position.clone();
        // bug 要改
        let availablePos = Object.assign([], this.availablePos);
        let occupiedElectron = this.getOccupiedElectron();
        let shouldPos = this.shouldPos.clone();
        this.body.dispose();
        this.text.dispose();
        this.init(false);
        this.freeElectron -= occupiedElectron;
        this.shouldPos = shouldPos;
        this.body.position = pos;
        this.availablePos = availablePos;
        for (const element of availablePos) {
            let obj = element;
            if (obj.bound) {
                obj.bound.changeRelatedAtom(obj.root, obj.atom);
            }
        }
    }

    public removeAtom(atom: Atom) {
        CalculateService.removeAtom(this, atom);
    }

    public dispose(baseAtom) {
        let availablePos = this.availablePos;
        if (this.atomMain.centerAtom === this) {
            this.atomMain.centerAtom = baseAtom || null;
        }
        if (baseAtom) {
            // anoAtom是指与这个原子连接的另一个原子删除目前仅支持单连接或者无连接的原子
            let anoAtom;
            if (availablePos.gotBounds > 0) {
                anoAtom = availablePos[0].atom;
                CalculateService.removeAtom(anoAtom, this);
                let obj = availablePos.find((v) => v.atom === anoAtom);
                obj.bound.dispose();
            }
            if (!this.body.isDisposed()) {
                // 丢弃这个原子的body
                this.body.dispose();
                this.text.dispose();
                this.angles.forEach((v) => {
                    v.dispose();
                });
            }
        } else {
            for (const element of availablePos) {
                let atom = element.atom;
                if (atom instanceof Atom) {
                    this.dispose(atom);
                }
            }
            if (!this.body.isDisposed()) {
                // 丢弃这个原子的body
                this.body.dispose();
                this.text.dispose();
                this.angles.forEach((v) => {
                    v.dispose();
                });
            }
        }
    }
    /**
     * 检查该原子能不能再添加原子
     * @param keyValue
     * @returns
     */
    public checkAddAtom(keyValue?) {
        if (keyValue) {
            return keyValue <= this.freeElectron;
        } else {
            return this.freeElectron;
        }
    }
    // 坐标漂移，旧坐标，新坐标
    /**
     * 将原子的某个方向转到目标原子的某个方向
     * @param oldPos 
     * @param newPos 
     * @param newPosAtom 
     * @returns 
     */
    public floatPosition(oldPos: BABYLON.Vector3, aimPos: BABYLON.Vector3, aimPosAtom: Atom) {
        const oriAtom: Atom = this;
        let oldPos_l = oldPos
        /**新方向转全局 */
        let aimPos_g = BABYLON.Vector3.TransformNormal(aimPos, aimPosAtom.body.computeWorldMatrix());
        /**全局转oriAtom */
        let InvOforiAtom = oriAtom.body.computeWorldMatrix().clone().invert();
        let aimPos_l_OriAtom = BABYLON.Vector3.TransformNormal(aimPos_g, InvOforiAtom);
        //如果角度没变就返回
        if (CalculateService.isVectorEqual(oldPos_l, aimPos_l_OriAtom)) {
            return;
        }
        oldPos_l.normalize();
        aimPos_l_OriAtom.normalize();

        let cos = BABYLON.Vector3.Dot(oldPos_l, aimPos_l_OriAtom);
        // 当计算误差导致新老向量不一致时，没必要进行坐标漂移，此时，sin和cos会出现NaN
        if (isNaN(cos)) {
            console.error('角度出错');
        }
        // 旋转轴计算,因为是从oldPos_l转到aimPos_l_OriAtom，所以oldPos_l在前
        let axis = BABYLON.Vector3.Cross(oldPos_l, aimPos_l_OriAtom);
        if (axis.equals(BABYLON.Vector3.Zero())) {
            let { x, y, z } = oldPos_l;
            switch (true) {
                case x !== 0:
                    axis.set(0, 0, 1);
                    break;
                case y !== 0:
                    axis.set(0, 0, 1);
                    break;
                case z !== 0:
                    axis.set(1, 0, 0);
                    break;
            }
        }
        axis.normalize();
        // 旋转角计算
        let rotationAngle = Math.acos(cos);  // 根据计算得到的 cos 计算旋转角度
        this.body.rotate(axis, rotationAngle, BABYLON.Space.LOCAL);
    }

    private calculateVerticalVector(starttVector, targetVector) {
        let axisVector = BABYLON.Vector3.Cross(starttVector, targetVector).normalize();
        let angle = BABYLON.Tools.ToRadians(90);
        let rotationMatrix = BABYLON.Matrix.RotationAxis(axisVector, angle);
        let resultVector = BABYLON.Vector3.TransformNormal(starttVector, rotationMatrix);
        return resultVector;
    }

    private calculateAngle_g(baseAtom, baseVector, atom, atomVector, atomPos) {
        let baseVector_g = BABYLON.Vector3.TransformNormal(baseVector, baseAtom.body.computeWorldMatrix(true));
        let w = atom.body.computeWorldMatrix(true).clone().invert();
        let newBasePos_g = BABYLON.Vector3.TransformNormal(baseVector_g, w);
        // let atomVector_g = BABYLON.Vector3.TransformNormal(atomVector, atom.body.computeWorldMatrix(true)).normalize();
        // let angle = Math.acos(BABYLON.Vector3.Dot(newBasePos_g.normalize(), atomVector.normalize()));
        let dotProduct = BABYLON.Vector3.Dot(newBasePos_g.normalize(), atomVector.normalize());
        let crossProduct = BABYLON.Vector3.Cross(newBasePos_g, atomVector).normalize();
        let angleSign = BABYLON.Vector3.Dot(crossProduct, atomPos.position) < 0 ? -1 : 1;
        // 计算夹角（弧度）
        let angleInRadians = Math.acos(Math.min(1, Math.max(-1, dotProduct))) * angleSign;
        return angleInRadians;
    }

    private calculateRotateAngle(baseAtom, atom, basePos, baseAssistVector, atomPos, atomAssistVector) {
        const baseVerticalVector = this.calculateVerticalVector(basePos.position, baseAssistVector);
        const atomVerticalVector = this.calculateVerticalVector(atomPos.position, atomAssistVector);
        const angle = this.calculateAngle_g(baseAtom, baseVerticalVector, atom, atomVerticalVector, atomPos)
        return angle;
    }


    public selfFloat(baseAtom, atom: Atom, basePos: AvailablePosition, atomPos: AvailablePosition) {
        const baseAssistVector = basePos.auxiliaryVector.find(item => { return !item.equals(basePos.position) });
        const atomAssistVectors = [];
        atomPos.auxiliaryVector.forEach(item => {
            if (!item.equals(atomPos.position)) {
                atomAssistVectors.push(item);
            }
        })
        const rotateAngle = this.calculateRotateAngle(baseAtom, atom, basePos, baseAssistVector, atomPos, atomAssistVectors[0]);
        const rotateAngle2 = this.calculateRotateAngle(baseAtom, atom, basePos, baseAssistVector, atomPos, atomAssistVectors[1]);
        const rotateAngle3 = this.calculateRotateAngle(baseAtom, atom, basePos, baseAssistVector, atomPos, atomAssistVectors[2]);
        let angles = [rotateAngle, rotateAngle2, rotateAngle3];
        let minAbsoluteAngle = Math.min(...angles.map(angle => Math.abs(angle)));
        // 找到原始角度中对应的值
        let minAngle = angles.find(angle => Math.abs(angle) === minAbsoluteAngle);
        // if (angle > 90) {
        //     aa = BABYLON.Vector3.Cross(basePos.position, basePos.auxiliaryVector).normalize();
        //     aaa = BABYLON.Vector3.TransformNormal(aa, baseAtom.body.computeWorldMatrix());
        //     angle = Math.acos(BABYLON.Vector3.Dot(aaa, bbb)) * 180 / Math.PI;
        // }
        function closestAngle(angle) {
            let ang = angle / Math.PI * 180;
            if (ang > 0) {
                return (60 - ang) * Math.PI / 180;
            } else {
                return (-60 - ang) * Math.PI / 180;
            }
        }
        const aimAngle = closestAngle(minAngle)
        if (Math.abs(aimAngle) > 0.1 && basePos.value === 1) {
            atom.body.rotate(atomPos.position, aimAngle, BABYLON.Space.LOCAL);
        } else if (basePos.value === 2) {
            // atom.body.rotate(atomPos.position, angle, BABYLON.Space.LOCAL);
        }
    }
    /**
     * 根据方向更改原子位置
     * @param obj 
     * @param fromAtom 
     */
    public updateThisPosition(obj?: AvailablePosition, fromAtom?: Atom) {
        if (!obj) {
            fromAtom = this.availablePos[0].atom;
            obj = fromAtom.availablePos.find((o) => o.atom === this);
        }
        let length = obj.bound.length || 2;
        let globalDirection = BABYLON.Vector3.TransformNormal(obj.position, fromAtom.body.computeWorldMatrix(true)).normalize();
        let globalPosition = fromAtom.body.getAbsolutePosition();
        let desiredGlobalPosition = globalPosition.add(globalDirection.scale(length));
        let localPosition = BABYLON.Vector3.TransformCoordinates(desiredGlobalPosition, fromAtom.body.parent.computeWorldMatrix(true).clone().invert());
        this.position = localPosition;
    }
    /**
     * 获取用于存储和恢复的数据
     */
    public getSaveData() {
        let availablePos = this.availablePos;
        let availablePosData = [];
        for (let i = 0; i < availablePos.length; i++) {
            availablePosData.push(this.availablePos[i].getSaveData());
        }
        return {
            id: this.getId(),
            name: this.name,
            position: this.position.asArray(),
            freeElectron: this.freeElectron,
            availablePos: availablePosData,
            changeId: this.changeId,
            gotBounds: this.availablePos.gotBounds,
            isPreInteraction: this.isPreInteraction,
            functionalGroup: this.functionalGroup,
        };
    }
    /**
     * 恢复基本数据，不包括连接数据，与restoreAvailableData搭配使用，
     * @param obj
     */
    public restoreData(obj: any) {
        this.name = obj.name;
        this.body.position = BABYLON.Vector3.FromArray(obj.position);
        this.freeElectron = obj.freeElectron;
        this.changeId = obj.changeId;
        this._id = obj.id;
        this.isPreInteraction = obj.isPreInteraction;
        this.functionalGroup = obj.functionalGroup;
    }
    /**
     * 恢复连接数据，需在所有的原子数据恢复完成后使用
     * @param availableData
     */
    public restoreAvailableData(availableData) {
        let availablePosData = availableData.availablePos;
        this.availablePos.length = 0;
        for (const element of availablePosData) {
            let obj = new AvailablePosition(this);
            let data = { ...element };
            if (isNaN(data.atom) && !(data.atom instanceof Atom)) {
                let atom = this.atomMain.getAtomById(data.atom);
                if (!atom) debugger;
                data.atom = atom;
            }
            if (data.bound) {
                let bound = this.atomMain.getBoundById(data.bound);
                if (bound) {
                    data.bound = bound;
                } else {
                    bound = new Bound(this, data.atom, data.value, this.atomMain, false);
                    bound.setId(data.bound);
                    data.bound = bound;
                }
            }
            // 恢复AvailablePosition数据
            obj.restoreData(data);
            this.availablePos.push(obj);
        }
        let bounds = availableData.gotBounds;
        this.availablePos.gotBounds = bounds;
        for (let i = 0; i < bounds; i++) {
            this.updateAngle(i);
        }
    }
}

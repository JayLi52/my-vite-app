// @ts-nocheck

import Atom from "./Atom";

export default class Angle {
    private relatedAtom: Array<Atom>;
    // ribbon
    private body;
    // 更新的路径
    private paths: Array<BABYLON.Vector3> = [];
    // 扇形的半径
    private radius: number = .6;
    private scene;
    // 边缘的线
    private angleEdge;
    private renderFunc;
    // 路径的点数
    private pathLength = 32;
    // 透明度
    private bodyAlpha = .2;
    private edgeAlpha = .6;
    private _showAngle: Boolean = null;
    private set showAngle(v) {
        v = Boolean(v);
        if (this._showAngle === v) return;
        this._showAngle = v;
        if (this.body) {
            this.body.isVisible = v;
            this.angleEdge.isVisible = v;
            this.text.isVisible = v;
        }
    }
    private get showAngle() {
        return this._showAngle;
    }
    // text的GUI
    private text;
    constructor(atom1: Atom, centerAtom: Atom, atom2: Atom) {
        this.relatedAtom = [atom1, centerAtom, atom2];
        atom1.angles.add(this);
        atom2.angles.add(this);
        centerAtom.angles.add(this);
        this.init();
    }

    private generatePath() {

        // 第一个原子 中心原子 第二个原子
        let [atom1, atom2, atom3] = this.relatedAtom;
        let atomMain = atom1.atomMain;
        this.showAngle = atomMain.showAngle;
        if (!this.showAngle) {
            return;
        }

        let path1 = this.paths;
        path1.length = 0;
        let p1 = atom1.position;
        let p2 = atom2.position;
        let p3 = atom3.position;
        let oldPos = p1.subtract(p2);
        let newPos = p3.subtract(p2);
        let zero = BABYLON.Vector3.Zero();
        if (oldPos.equals(zero) || newPos.equals(zero)) return;
        // 根据第一个原子和第二个原子与中心原子的夹角和他们的坐标，差值计算出圆弧上的点的坐标
        oldPos.normalize();
        newPos.normalize();
        let angle = Math.acos(BABYLON.Vector3.Dot(oldPos, newPos));
        // 更新ribbon的path必须保证路径点的个数不变，所以预设好路径点的个数为pathLength，然后每次计算旋转一点角度后的坐标
        let length = this.pathLength;
        let deltaAngle = angle / length / 2;
        let deltaSin = Math.sin(deltaAngle);
        let deltaCos = Math.cos(deltaAngle);
        let v = BABYLON.Vector3.Cross(oldPos, newPos);
        if (v.equals(BABYLON.Vector3.Zero())) {
            let { x, y, z } = oldPos;
            switch (true) {
                case x !== 0: v.set((-y - z) / x, 1, 1); break;
                case y !== 0: v.set(1, (-x - z) / y, 1); break;
                case z !== 0: v.set(1, 1, (-x - y) / z); break;
            }
        }
        v = v.normalize().scale(deltaSin);
        // 生成旋转一小点的四元数
        let quaternion = new BABYLON.Quaternion(v.x, v.y, v.z, deltaCos);
        let lastVector = oldPos;
        let path2 = [];
        // 生成旋转后的坐标
        for (let i = 0; i < length; i++) {
            let result:any = quaternion.multiply(new BABYLON.Quaternion(lastVector.x, lastVector.y, lastVector.z, 0)).multiply(quaternion.conjugate());
            result = new BABYLON.Vector3(result.x, result.y, result.z);
            lastVector = result;
            path1.push(p2.add(result.scale(this.radius / result.length())));
            // 路径
            path2.push(p2);
        }
        let paths = [path1, path2];
        let parent = atomMain.parent;
        let trueAngle = angle;
        if (!this.body) {
            // 角度mesh
            this.body = BABYLON.MeshBuilder.CreateRibbon("angle", { pathArray: paths, sideOrientation: BABYLON.Mesh.DOUBLESIDE, updatable: true }, this.scene);
            let material = this.body.material = new BABYLON.StandardMaterial("angle", this.scene);
            material.alpha = this.bodyAlpha;
            material.diffuseColor = new BABYLON.Color3(.5, .5, .5);
            this.body.parent = parent;
            // 角度边缘的线条
            this.angleEdge = BABYLON.MeshBuilder.CreateLines("angleEdge", { points: path1, updatable: true, instance: undefined }, this.scene);
            this.angleEdge.alpha = this.edgeAlpha;
            this.angleEdge.color = BABYLON.Color3.Red();
            this.angleEdge.parent = parent;
            //文字
            let advancedTexture = atomMain.advancedTexture;
            let text = this.text = new BABYLON.GUI.TextBlock('text', `${(trueAngle / Math.PI * 180).toFixed(1)}°`);
            // TODO 选用相反的颜色
            text.color = "white";
            text.fontSize = 18;
            advancedTexture.addControl(text);
            text.linkOffsetX=-10;
            text.linkWithMesh(this.body);
        } else {
            this.body = BABYLON.MeshBuilder.CreateRibbon(null, { pathArray: paths, instance: this.body });
            this.angleEdge = BABYLON.MeshBuilder.CreateLines("angleEdge", { points: path1, instance: this.angleEdge, updatable: false });
        }
        let angleDeg = trueAngle / Math.PI * 180;
        let degree = Math.floor(angleDeg);
        let minutes = Math.round((angleDeg-degree)*60);
        this.text.text = `${degree}°${minutes}'`;
        // 根据角度更改颜色
        let color = [];
        color.length = 3;
        color.fill(0);
        let per = Math.PI / 3;
        for (let i = 0; i < 3; i++) {
            let a = angle - per;
            if (a < 0) {
                color[i] = angle / per;
                break;
            } else {
                color[i] = 1;
                angle -= per;
            }
        }
        this.body.material.diffuseColor = new BABYLON.Color3(color[2], color[1], color[0]);

        // 当角度的面和视角面几乎重合时，不显示这个mesh
        v.normalize();
        let vector = BABYLON.Vector3.TransformNormal(v, parent.computeWorldMatrix().clone()).normalize();
        let percent = Math.abs(BABYLON.Vector3.Dot(vector, new BABYLON.Vector3(0, 0, -1)));
        this.body.material.alpha = this.bodyAlpha * percent;
        this.angleEdge.alpha = this.edgeAlpha * percent;
        percent = (percent - .5) / .5;
        this.text.alpha = percent < 0 ? 0 : percent;



    }

    private init() {
        let atom = this.relatedAtom[0];
        let main = atom.atomMain;
        this.showAngle = main.showAngle;
        this.scene = atom.body.getScene();
        this.renderFunc = this.generatePath.bind(this);
        this.scene.registerBeforeRender(this.renderFunc);

    }
    public dispose() {
        this.scene.unregisterBeforeRender(this.renderFunc);
        if (this.body) {
            this.body.dispose();
            this.text.dispose();
            this.angleEdge.dispose();
        }
        for (let i = 0; i < this.relatedAtom.length; i++) {
            this.relatedAtom[i].angles.delete(this);
        }
    }
}












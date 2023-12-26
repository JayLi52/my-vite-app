import Atom from "../core/Atom";
import CalculateService from "../services/CalculateService";
export default class AvailablePosition {
    // 原子 数字的话可能是0，1，2，代表啥都没有，单电子，孤对电子
    public atom: Atom = undefined;
    // 地理坐标（45，12）
    public _position: BABYLON.Vector3;
    public oriAngle: number;
    // 键 TODO 类型应该是圆柱
    public bound;
    public auxiliaryVector: Array<BABYLON.Vector3> = [new BABYLON.Vector3(0, 1, 0), new BABYLON.Vector3(0.47140452079103184, -0.33333333333333315, -0.816496580927726), new BABYLON.Vector3(-0.9428090415820635, -0.33333333333333315, 0), new BABYLON.Vector3(0.47140452079103184, -0.33333333333333315, 0.816496580927726)];
    public auxiliaryVector3: Array<BABYLON.Vector3> = [new BABYLON.Vector3(0, 1, 0), new BABYLON.Vector3(-0.8660253882408142, -0.5, 0), new BABYLON.Vector3(0.8660253882408142, -0.5, 0)];
    public randomPerpendicularVector: BABYLON.Vector3;
    public set position(v: BABYLON.Vector3) {
        if (!CalculateService.isVectorEqual(this._position, v)) {
            this._position = v.scale(1 / v.length());
            this.randomPerpendicularVector = CalculateService.getRandomPerpendicularVector(this.position);
        }
    }
    public get position() {
        return this._position;
    }
    /** 键值，0 没键，1 单键，2 双键，3 三键*/
    public value: number = 0;
    constructor(public root) {
        this.root = root;
    }

    public getSaveData() {
        return {
            atom: this.atom instanceof Atom ? this.atom.getId() : this.atom,
            root: this.root instanceof Atom ? this.root.getId() : this.root,
            position: this._position.asArray(),
            bound: this.bound ? this.bound.getId() : null,
            randomPerpendicularVector: this.randomPerpendicularVector,
            value: this.value,
            oriAngle: this.oriAngle,
        };
    }
    public restoreData(obj) {
        this.bound = obj.bound;
        this.root = obj.root
        this._position = BABYLON.Vector3.FromArray(obj.position);
        this.atom = obj.atom;
        this.value = obj.value;
        this.randomPerpendicularVector = new BABYLON.Vector3(obj.randomPerpendicularVector._x, obj.randomPerpendicularVector._y, obj.randomPerpendicularVector._z),
            this.oriAngle = obj.oriAngle
    }
}
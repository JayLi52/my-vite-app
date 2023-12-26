import Atom from "../core/Atom";
import AvailablePosition from "../class/AvailablePosition";
import Main from "../../main";
import Bound from "../core/Bound";
class CalculateService {
    private atomData: Object = require("../../documents/atom.json");
    // private generalAngleData: Array<any> = [
    //     null,
    //     [[90, 0]],
    //     [[90, 0], [-90, 0]],
    //     [[90, 0], [-30, -90], [-30, 90]],
    //     [[90, 0], [-19.471220634490678, -60], [-19.471220634490678, 60], [-19.471220634490678, 180]],
    //     [[90, 0], [-30, -90], [-30, 90], [0, 0], [0, 180]],
    //     [[90, 0], [0, 0], [-90, 0], [0, 180], [0, -90], [0, 90]],
    //     [[90, 0], [0, 0], [-90, 0], [0, 144], [0, -72], [0, 72], [0, -144]]
    // ];
    public generalPosData: Array<any> = [
        [[0, 1, 0], [-0.9681476354598999, -0.2503800094127655, 0]],
        [[0, 1, 0]],
        [[0, 1, 0], [0, -1, 0]],
        [[0, 1, 0], [-0.8660253882408142, -0.5, 0], [0.8660253882408142, -0.5, 0]],
        [[0, 1, 0], [0.47140452079103184, -0.33333333333333315, -0.816496580927726], [0.47140452079103184, -0.33333333333333315, 0.816496580927726], [-0.9428090415820635, -0.33333333333333315, 0]],

        [[0, 1, 0], [0, -0.5, -0.8660254037844387], [0, -0.5, 0.8660254037844387], [1, 0, 0], [-1, 0, 0]],
        [[0, 1, 0], [1, 0, 0], [0, -1, 0], [-1, 0, 0], [0, 0, -1], [0, 0, 1]],
        [[0, 1, 0], [1, 0, 0], [0, -1, 0], [-0.8090169943749473, 0, 0.5877852522924732], [0.30901699437494745, 0, -0.9510565162951535], [0.30901699437494745, 0, 0.9510565162951535], [-0.8090169943749473, 0, -0.5877852522924732]]
    ]
    private changeId: number;
    public main: Main;
    constructor() {
        this.initGeneralPosData();
    }
    /**处理方向数据，将Array转为BABYLON.Vector3 */
    private initGeneralPosData() {
        for (const posAry of this.generalPosData) {
            for (let j = 0; j < posAry.length; j++) {
                let pos = posAry[j];
                posAry[j] = BABYLON.Vector3.FromArray(pos);
            }
        }
    }
    /**更新changeId */
    public generateChangeId() {
        this.changeId = Math.round(Math.random() * 1e10);
        return this.changeId;
    }
    /**
     * 更新定位夹角
     * 定位夹角是指atom辅助向量转到baseAtom后，以baseAtom看向atom方向为normal的夹角，保存在baseAtom上
     */
    public updateAngleForPositioning() {
        this.main.atoms.forEach((baseAtom: Atom) => {
            for (let i = 0; i < baseAtom.availablePos.gotBounds; i++) {
                let availablePosItem = baseAtom.availablePos[i];
                let atom = availablePosItem.atom;
                /**当前atom指向的原子上，指回atom的availablePos */
                let availablePosFromAtomToBaseAtom = atom.availablePos.find((v: AvailablePosition) => v.atom === baseAtom);
                /**定位夹角 */
                let currentAngle = this.angleCal(baseAtom, atom, availablePosItem.randomPerpendicularVector, availablePosFromAtomToBaseAtom.randomPerpendicularVector, availablePosItem.position);
                availablePosItem.oriAngle = currentAngle;
            }
        })

    }
    /**
     * 连接两个原子
     * @param atom1 主原子
     * @param atom2 新加原子
     * @param boundValue 键值 
     */
    public adjoinTwoAtom(atom1: Atom, atom2: Atom, name, boundValue: number, bound, preInteraction) {
        atom1.changeId = this.changeId;
        this.adjustAvailPosition(atom1, atom2, name, boundValue, null, preInteraction);
        atom1.availablePos.forEach(item => {
            this.generateChangeId();
            this.adjustAtomPosition(item.atom, item.root, false, true);
        })
    }

    /**移除原子 */
    public removeAtom(baseAtom, removedAtom) {
        let availablePos = baseAtom.availablePos;
        let obj, index = 0;
        for (; index < availablePos.length; index++) {
            let temp = availablePos[index];
            if (temp.atom === removedAtom) {
                obj = temp;
                break;
            }
        }
        availablePos.gotBounds--;
        baseAtom.freeElectron += obj.value;
        availablePos.splice(index, 1);
    }
    /**
     * 计算一个和direction垂直的辅助向量
     * @param direction 
     * @returns 
     */
    public getRandomPerpendicularVector(direction) {
        // Normalize the input direction vector
        direction.normalize();

        // Generate a random vector
        let randomVector = new BABYLON.Vector3(Math.random(), Math.random(), Math.random());

        // Ensure the random vector is not parallel to the input direction
        while (BABYLON.Vector3.Dot(direction, randomVector) === 1) {
            randomVector = new BABYLON.Vector3(Math.random(), Math.random(), Math.random());
        }

        // Calculate the perpendicular vector using cross product
        let perpendicularVector = BABYLON.Vector3.Cross(direction, randomVector);

        // Normalize the result before returning
        perpendicularVector.normalize();

        return perpendicularVector;
    }
    /**坐标变换，将oriAtom上的向量转换到aimAtom上，然后以aimAtom看oriAtom的方向为normal计算夹角
     * @param aimAtom 目标atom
     * @param oriAtom 源atom
     * @param aimAtomVector 目标atom上指向oriAtom的availablePos上的辅助向量
     * @param oriAtomVector 源atom上指向aimAtom的availablePos上的辅助向量
     * @param availablePosFromAimAtomToOriAtom aimAtom看oriAtom的方向
     * @returns 以aimAtom看oriAtom的方向为normal计算的夹角
     */
    public angleCal(aimAtom: Atom, oriAtom: Atom, aimAtomVector, oriAtomVector, availablePosFromAimAtomToOriAtom) {
        /**源atom上向量转全局 */
        const oriAtomVector_g = BABYLON.Vector3.TransformNormal(oriAtomVector, oriAtom.body.computeWorldMatrix(true));
        const InvOfaimAtom = aimAtom.body.computeWorldMatrix(true).clone().invert();
        /**源atom上向量转aimAtom上 */
        const oriAtomVector_l_OfaimAtom = BABYLON.Vector3.TransformNormal(oriAtomVector_g, InvOfaimAtom);
        // let cos = BABYLON.Vector3.Dot(aimAtomVector, oriAtomVector_l_OfaimAtom);
        // let currn = BABYLON.Vector3.Cross(aimAtomVector, oriAtomVector_l_OfaimAtom);
        // let dir = BABYLON.Vector3.Dot(currn, availablePosFromAimAtomToOriAtom) < 0 ? -1 : 1;
        // cos = clamp(cos, -1, 1);
        const angleForPositioning = BABYLON.Vector3.GetAngleBetweenVectors(aimAtomVector, oriAtomVector_l_OfaimAtom, availablePosFromAimAtomToOriAtom);
        return angleForPositioning;
    }
    /**
     * 根据baseAtom的坐标和指向atom的方位，调整atom中指示baseAtom的方位和自己的坐标
     * @param atom 
     * @param baseAtom 
     */
    public adjustAtomPosition(atom: Atom, baseAtom: any, correction?: boolean, selfF?) {
        if (atom?.changeId === this.changeId) return;
        atom.changeId = this.changeId;
        let pos = atom.availablePos.find(v => v.atom === baseAtom);
        if (!pos) return;
        let truePosObj = baseAtom.availablePos.find(v => v.atom === atom);
        let oppositPos = truePosObj.position.negate();
        atom.updateThisPosition(truePosObj, baseAtom);
        // 将轴转到目标方向
        atom.floatPosition(pos.position, oppositPos, baseAtom);
        // 接下来是绕轴旋转创建优势构象 未完待续...
        if (atom.name === "C" && baseAtom.name === "C" && selfF && !pos.oriAngle) {
            atom.selfFloat(baseAtom, atom, truePosObj, pos);
        }
        // 恢复原子相对角度，主要是在绕轴旋转的时候用
        if (correction || pos.oriAngle) {
            let currentAngle = this.angleCal(atom, baseAtom, pos.randomPerpendicularVector, truePosObj.randomPerpendicularVector, pos.position);
            if (currentAngle !== pos.oriAngle) {
                if (isNaN(currentAngle - pos.oriAngle)) debugger;
                let ang = currentAngle - pos.oriAngle;
                if (Math.abs(currentAngle - pos.oriAngle) > Math.PI) {
                    let dir = currentAngle - pos.oriAngle > 0 ? -1 : 1;
                    ang = (Math.PI * 2 - Math.abs(currentAngle - pos.oriAngle)) * dir;
                }
                atom.body.rotate(pos.position, ang, BABYLON.Space.LOCAL);
            }
        }
        // for (const element of atom.availablePos) {
        //     let obj = element;
        //     if (!obj) continue;
        //     if (obj.atom instanceof Atom && obj.atom !== baseAtom) {
        //         this.changeId++;
        //         this.adjustAtomPosition(obj.atom, atom, correction, selfF);
        //     }
        // }
    }

    /**
     * 向量模糊相等
     * @param v1 
     * @param v2 
     * @returns 
     */
    public isVectorEqual(v1: BABYLON.Vector3, v2: BABYLON.Vector3) {
        if(!v1 || !v2) return false;
        let angle = BABYLON.Vector3.GetAngleBetweenVectors(v1, v2, BABYLON.Vector3.Cross(v1, v2));
        if (v1.equals(v2) || Math.abs(angle) < 1e-10) {
            return true;
        } else {
            return false;
        }
    }


    // 更改原子类型和新加原子，更新baseAtom的availablePos
    /**
     * 外部调用是添加baseAtom的预交互，更新AvailPosition
     * 内部递归是baseAtom的每个预交互原子更新AvailPosition
     * @param baseAtom 
     * @param addAtom 
     * @param name 
     * @param boundValue 
     * @param bound 
     * @param preInteraction 
     * @param justUpdate 
     * @param stableBound 
     * @returns 
     */
    private adjustAvailPosition(baseAtom: Atom, addAtom: Atom, name, boundValue: number = 0, bound?, preInteraction?, justUpdate?, stableBound?) {
        const BaseAtomisCenter = baseAtom === baseAtom.root.centerAtom;
        let { freeElectron, availablePos} = baseAtom;
        // 计算产生新的键后，是什么形状，算上了所有的成键和孤对电子
        let added = false;
        const oriDirection = availablePos.filter(item => item.atom).length;
        /** 计算目前可以伸出的方向数
         * 计算方法是原有方向数 + 1(这次要伸出的方向) + 剩余电子数
        */
        let length = oriDirection + ((boundValue && (freeElectron - boundValue >= 0)) ? freeElectron - boundValue + 1 : 0);
        if(baseAtom.functionalGroup) length = 3;
        // 根据计算出的参数查找数据中对应的形状
        let standardPos = [];
        if (length !== oriDirection) {
            if (baseAtom.name === 'O' && length === 2) {
                standardPos = this.generalPosData[0];
            } else {
                standardPos = this.generalPosData[length];
            }
        } else {
            for (const element of availablePos) {
                standardPos.push(element.position);
            }
        }
        // 有可能在插入新键后，新产生的形状的键数小于之前的键数，所以重新设置下length
        availablePos.length = length;
        /**相比于原来的availablePos里，新出现的方向 */
        let updatedStandardPos = standardPos.filter(pos => {
            // 检查标准位置是否在 availablePos 中
            return !availablePos.some((available: AvailablePosition) => {
                return this.isVectorEqual(pos, available?.position);
            });
        });

        function findMinIndex(oldPos, posArr) {
            // obj.position
            const objPosition = oldPos;

            // updatedStandardPos 是 Vector3 的数组
            const updatedStandardPos = posArr;

            // 初始化最小夹角和对应的索引
            let minCosineSimilarity = Number.MAX_VALUE;
            let minIndex = -1;

            // 遍历 updatedStandardPos 数组
            for (let i = 0; i < updatedStandardPos.length; i++) {
                // 计算夹角余弦值
                const cosineSim = Math.abs(BABYLON.Vector3.GetAngleBetweenVectors(objPosition, updatedStandardPos[i], BABYLON.Vector3.Cross(objPosition, updatedStandardPos[i])));
                // 更新最小夹角和对应的索引
                if (cosineSim < minCosineSimilarity) {
                    minCosineSimilarity = cosineSim;
                    minIndex = i;
                }
            }
            return minIndex;
        }

        // 新加入的原子是否加入到了数组中，如果加入了，added就是true
        // 根据找到的标准位置进行相应的位置赋值
        for (let i = 0; i < length; i++) {
            let obj = availablePos[i];
            if (obj && !standardPos.some(pos => { return this.isVectorEqual(pos, obj?.position)})) {
                const minIndex = findMinIndex(obj.position, updatedStandardPos);
                obj.position = updatedStandardPos[minIndex].clone();
                if (obj.atom) {
                    obj.atom.atomMain.canchoose = false;
                }
                updatedStandardPos.splice(minIndex, 1);
            } else if (!obj) {
                obj = new AvailablePosition(baseAtom);
                availablePos[i] = obj;
                obj.position = updatedStandardPos[0].clone();
                updatedStandardPos.splice(0, 1);
            }
            // 如果没有value，说明这个位置是没有化学键
            if (!obj.value) {
                if (added && !BaseAtomisCenter) {
                    obj.value = 0;
                } else {
                    added = true;
                    obj.value = boundValue;
                    availablePos.gotBounds++;
                    let atom, bound1;
                    if (BaseAtomisCenter) {
                        atom = new Atom(baseAtom.root, name, preInteraction)
                        atom.position = baseAtom.position;
                        bound1 = new Bound(baseAtom, atom, boundValue, baseAtom.root, preInteraction);
                        obj.atom = atom;
                        obj.bound = bound1;
                        this.adjustAvailPosition(atom, baseAtom, null, boundValue, bound1);
                        baseAtom.root.atoms.push(atom);
                    } else {
                        obj.atom = addAtom;
                        obj.bound = bound;

                    }
                    baseAtom.freeElectron -= boundValue;
                }
            } else {
                obj.atom.changeId = this.changeId;
            }
        }
    }
}
export default new CalculateService();

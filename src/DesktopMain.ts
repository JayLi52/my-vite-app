import DataService from "./libs/services/DataService";
import NBEvent from "./libs/events/NBEvent";
import Main from "./main";
export default class DesktopMain {
    private main;
    private showData: Array<any> = null;
    constructor(canvas?) {
        // (window as any).demo = this;
        this.main = new Main(canvas);
    }
    public set showName(v) {
        this.main.showName = Boolean(v);
    }
    public get showName() {
        return this.main.showName;
    }
    public set showAngle(v) {
        this.main.showAngle = Boolean(v);
    }
    public get showAngle() {
        return this.main.showAngle;
    }
    public set showReal(v) {
        this.main.showReal = Boolean(v);
    }
    public get showReal() {
        return this.main.showReal;
    }

    public getAtomList() {
        return DataService.getDesktopData();
    }

    public subscribe(type: string, callback: Function, bindObj = null) {
        this.main.eventService.subscribe(type, callback, bindObj);
    }
    public unsubscribe(type, callback) {
        this.main.eventService.unsubscribe(type, callback);
    }

    // 点击原子，分三种情况，1、有点击的原子且有参数传入，那么传入name就是要替换这个原子。2、有点击的原子但没有传入的参数，那就是检查哪些原子可以传入。3、没有点击的原子，那就是向中心原子上添加新的原子
    public getAvailableAtom(name?) {
        let choosedAtom = this.main.choosedAtom;
        if (choosedAtom && choosedAtom.name) {
            return this.main.choosedAtom.checkChange(name);
        }
        if (!this.main.choosedAtom) {
            return true;
        } else {
            return this.main.choosedAtom.freeElectron > 0;
        }
    }

    public clickAtom(name) {
        let choosedAtom = this.main.choosedAtom;
        if (choosedAtom && choosedAtom.name && choosedAtom.name !== name) {
            return this.main.choosedAtom.changeAtom(name);
        }
        if (!this.main.choosedAtom) {
            this.main.publicCreateAndLinkAtom(name);
        }
    }

    public clickBoundValue(value, name?) {
        let choosedAtom = this.main.choosedAtom;
        if (choosedAtom) {
            if (!choosedAtom.name && choosedAtom.checkChange) {
                choosedAtom.changeKeyValue(value);
            } else if (name) {
                return this.main.publicCreateAndLinkAtom(name, value);

            }
            return;
        }
    }
    // 点击键值，分四种情况，1、有点击的键值且有传入的键值，那么就是要替换这个键值。2、有点击的键值但没有传入键值，那就是检查可以传入什么键值。
    // 3、没有点击的原子，但有传入的键值和名字，那就是要在中心原子上添加该键值的原子。4、没有中心原子，没有选中的原子，那就直接创建吧
    public getAvailableBoundValue(value?) {
        let choosedAtom = this.main.choosedAtom;
        if (choosedAtom) {
            if (!choosedAtom.name && choosedAtom.checkChange) {
                if (value) {
                    return choosedAtom.checkChange(null, value);
                } else {
                    let len = choosedAtom.checkChange();
                    return len > 3 ? 3 : len;
                }
            } else {
                return choosedAtom.checkAddAtom(value);
            }
        }
        // let centerAtom = this.main.choosedAtom;
        // if(centerAtom){
        //     return centerAtom.checkAddAtom(value);
        // }else{
        //     return true;
        // }
    }

    public getSwitchItemList() {
        return [
            { name: "原子名", propertyName: "showName", isActive: false },
            { name: "键角", propertyName: "showAngle", isActive: false },
            { name: "比例模型", propertyName: "showReal", isActive: false }
        ];
    }

    public clear() {
        this.main.publicClearAll();
    }
    public undo() {
        this.main.operationService.undo();
        if (this.main.atoms.length > 0) {
            this.main.eventService.activate(NBEvent.HAVE_ATOM);
        } else {
            this.main.eventService.activate(NBEvent.EMPTY);
        }
    }
    public redo() {
        this.main.operationService.redo();
        if (this.main.atoms.length > 0) {
            this.main.eventService.activate(NBEvent.HAVE_ATOM);
        } else {
            this.main.eventService.activate(NBEvent.EMPTY);
        }
    }

    // 找到NBEvent
    public getNBEvent() {
        return this.main.NBEvent;
    }

    // 获取choosedAtom
    public getChoosedAtom() {
        return this.main.choosedAtom;
    }

    public changeCenterAtom() {
        let currentCenter = this.getChoosedAtom();
        this.main.centerAtom = currentCenter;
    }
    public removeAtom() {
        let currentCenter = this.getChoosedAtom();
        this.main.choosedAtom = null;
        this.main.publicRemoveAtom(currentCenter);
    }

    public showMode(id: string) {
        let num = 0;
        switch (id) {
            case "c4ca4238": num = 1; break;
            case "c81e728d": num = 2; break;
            case "eccbc87e": num = 3; break;
            case "a87ff679": num = 4; break;
        }
        if (!num) return;
        this.main.justShow = true;
        this.main.parent.justShow = true;
        if (!this.showData) {
            this.showData = require("./documents/showData.json");
        }
        let data = Object.assign({}, this.showData[num - 1]);
        let centerId;
        if (data.centerPos) {
            centerId = BABYLON.Vector3.FromArray(data.centerPos);
        }
        let centerAtomId;
        console.log(data.centerAtom);
        if (data.centerAtom) {
            centerAtomId = data.centerAtom;
            delete data.centerAtom;
        }
        this.main.scene.clearColor = new BABYLON.Color4(0.09019607843137255, 0.7450980392156863, 1, 1);
        this.main.restoreData(data);
        if (centerId) {
            this.main.parent.setPivotPoint(centerId);
            this.main.parent.position = BABYLON.Vector3.Zero();
        }
        if (centerAtomId) {
            let atom = this.main.getAtomById(centerAtomId);
            if (atom) {
                this.main._centerAtom = atom;
            }
        }
        if (num === 2) {
            this.main.showAngle = true;
        }
        if (num === 1) {
            this.main.showName = true;
        }
    }
}
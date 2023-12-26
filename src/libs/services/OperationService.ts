


export default class OperationService {
    // 存储操作的数组
    private undoQueue: Array<Object> = [];
    // 存储重做的数组
    private redoQueue: Array<Object> = [];
    // 最多存储多少步
    private maxAmount = 20;
    // 当前操作所在的次序
    private funcNameIndex = { 
        createAndLinkAtom: "removeAtom", 
        removeAtom: "createAndLinkAtom", 
        undoRedoSwitchTwoAtomPos: "undoRedoSwitchTwoAtomPos",
        clearAll:"restoreData",
        restoreData:"clearAll"
    }
        ;
    constructor(private atomMain) {

    }

    init() {

    }

    undo() {
        let obj  = (this.undoQueue.pop() as any);
        if(!obj)return;
        this.redoQueue.push(obj);
        this.atomMain.inQueue=true;
        obj.target[obj.invFuncName].apply(obj.target,obj.param);
        this.atomMain.inQueue=false;
    }

    redo() {
        let obj = (this.redoQueue.pop() as any);
        if(!obj)return;
        this.undoQueue.push(obj);
        this.atomMain.inQueue=true;
        obj.target[obj.funcName].apply(obj.target,obj.param);
        this.atomMain.inQueue=false;
    }

    add(target, funcName, param) {
        if(this.undoQueue.length>this.maxAmount-1){
            this.undoQueue.shift();
        }
        this.undoQueue.push({
            target: target,
            funcName: funcName,
            invFuncName:this.funcNameIndex[funcName],
            param: param
        });
        this.redoQueue.length=0;
    }
}
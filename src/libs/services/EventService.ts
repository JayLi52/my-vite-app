import Main from "../../main";
class EventService {
    public atomMain: Main;
    private events: Object = null;
    constructor(main) {
        this.atomMain = main;
        this.init();
    }
    init() {
        this.events={};
    }

    addListener(target, action) {
        let manager = target.actionManager;
        if (!manager) {
            manager = target.actionManager = new BABYLON.ActionManager(this.atomMain.scene);
        }
        manager.registerAction(action);
    }
    removeListener(target, action) {
        let manager = target.actionManager;
        if (manager && action) {
            let actions = manager.actions;
            for (let i = 0; i < actions.length; i++) {
                if (actions[i] === action) {
                    actions.splice(i, 1);
                    break;
                }
            }
        }
    }

    subscribe(type, callback, bindObj = null) {
        let ary = this.events[type];
        if (!ary) {
            ary = this.events[type] = [];
        }
        ary.push(callback.bind(bindObj));
    }

    unsubscribe(type,callback){
        let ary = this.events[type];
        if (!ary) {
            debugger;
            throw new Error("未知的事件类型");
        }
        for(let i=0;i<ary.length;i++){
            let func = ary[i];
            if(func === callback){
                ary.splice(i,1);
                break;
            }
        }
    }

    activate(type, data) {
        let ary = this.events[type];
        if (!ary) {
           return ;
        }
        ary.forEach(v => v(data));
    }
}
export default EventService;
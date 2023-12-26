/**
 * NB事件字符串
 * Created by onlyjyf on 10/15/16.
 */

var NBEvent = {
    click: {
        // 点击原子对象发
        ATOM: 'click.atom',
        // 点击化学键对象发
        BOUND: 'click.bound',
        // 点击空白区域
        EMPTY: 'click.empty'
    },
    change: {
        CENTERATOM: 'change.centerAtom'
    },
    EMPTY:"empty",
    HAVE_ATOM:"haveAtom"

};
if (window) {
    window.NBEvent = NBEvent;
}
module.exports = NBEvent;

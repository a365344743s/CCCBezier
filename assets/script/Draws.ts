import Bezier from "./Bezier";
const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Graphics)
    private ctx: cc.Graphics = null;

    private bezier: Bezier = null;

    @property(cc.RichText)
    private bezierCurveTo: cc.RichText = null;

    @property(cc.Node)
    private role: cc.Node = null;

    onLoad() {
        cc.debug.setDisplayStats(false);
        this.bezier = new Bezier(this.ctx);
        // this.role.position = this.bezier.getOrigin();
        console.log(this.bezier);
        this.showBezierCurveTo();
        cc.log(this)
    }

    private showBezierCurveTo() {
        this.bezierCurveTo.string = `<color=#ffffff>${JSON.stringify(this.bezier.bezier)}</c>`;
    }

    private touchStartListener(e) {
        let v: cc.Vec2 = e.currentTouch.getLocation();
        this.bezier.dragStart(v);
    }

    private touchMoveListener(e) {
        // let v: cc.Vec2 = this.node.convertToNodeSpaceAR(e.currentTouch.getLocation());
        let v: cc.Vec2 = e.currentTouch.getLocation();

        this.bezier.dragging(v);
        this.showBezierCurveTo();
    }

    private touchEndListener() {
        this.bezier.dragEnd();
    }

    /**
     * 创建 Bezier
     */
    addBezier() {
        this.bezier.addBezier();
        this.bezier.drawBezier();
        this.showBezierCurveTo();
    }

    deleteBezier() {

        this.bezier.deleteBezier();
        this.showBezierCurveTo();
    }

    onRunAction() {
        this.role.stopAllActions();
        let list = this.bezier.getBezier();
        this.role.position = this.bezier.getOrigin();
        this.runAction(list)
        cc.log(list);
    }

    getConfig() {
        var file = new File([JSON.stringify(this.bezier.bezier)], "BezierConfig.json", { type: "text/plain;charset=utf-8" });
        window.saveAs(file);
    }

    private runAction(list: cc.Vec2[][]) {
        this.role.runAction(cc.sequence(

            cc.bezierTo(2, list.shift()),
            cc.callFunc(() => {
                if (list.length) {
                    this.runAction(list)
                }
            })
        ));
    }

    onEnable() {
        this.node.on(cc.Node.EventType.TOUCH_START, this.touchStartListener, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.touchMoveListener, this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.touchEndListener, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.touchEndListener, this);
    }
    onDisable() {
        this.node.off(cc.Node.EventType.TOUCH_START, this.touchStartListener);
        this.node.off(cc.Node.EventType.TOUCH_MOVE, this.touchMoveListener);
        this.node.off(cc.Node.EventType.TOUCH_CANCEL, this.touchEndListener);
        this.node.off(cc.Node.EventType.TOUCH_END, this.touchEndListener);
    }
};

export default class Bezier {
    private ctx: cc.Graphics;
    private style: any;
    private drag: any[];
    // bezierCurveTo: number[] = [null, null, null, null, null, null];
    /**操纵点 */
    private dot: any[][] = [];
    bezier: any[] = [];
    /**操纵点颜色 */
    private dotColor: cc.Color[];

    // bezier: cc.Vec2[];
    constructor(ctx: cc.Graphics) {
        this.ctx = ctx;
        this.dotColor = [cc.color(122, 86, 233), cc.color(86, 233, 155), cc.color(233, 174, 86), cc.color(248, 132, 230)];


        this.style = {
            curve: {
                width: 5,
                color: cc.color(51, 51, 51, 255)
            },
            cpline: {
                width: 2,
                color: cc.color(204, 0, 0, 255)
            },
            point: {
                radius: 20,
                width: 2,
                color: cc.color(253, 0, 0, 255),
                fillColor: cc.color(200, 200, 200, 170),
                arc1: 0,
                arc2: 2 * Math.PI
            }
        };

        // this.drawCanvas();
    }

    /**
     * 默认点位置
     */
    private pointDefault(): any[] {
        return [
            { x: 100, y: 200 },
            { x: 300, y: 200 },
            { x: 150, y: 100 },
            { x: 250, y: 100 }
        ]
    }

    /**
     * 新增曲线
     */
    addBezier() {
        if (this.dot.length) {
            let v = this.dot[this.dot.length - 1][1];
            let point: any[] = [
                v,
                { x: v.x + 200, y: v.y },
                { x: v.x + 50, y: v.y - 100 },
                { x: v.x + 150, y: v.y - 100 }
            ];
            this.dot.push(point);

        } else {
            this.dot.push(this.pointDefault());
        }
    }

    /**
     * 绘制贝塞尔曲线
     */
    drawBezier() {
        let ctx = this.ctx;
        let dot = this.dot;
        let style = this.style;
        ctx.clear();
        // this.bezier=[];
        // 绘制操纵杆
        ctx.lineWidth = style.cpline.width;
        ctx.strokeColor = style.cpline.color;
        dot.forEach((point) => {
            ctx.moveTo(point[0].x, point[0].y);
            ctx.lineTo(point[2].x, point[2].y);
            ctx.moveTo(point[1].x, point[1].y);
            ctx.lineTo(point[3].x, point[3].y);
        });
        ctx.stroke();

        // 绘制曲线路径
        ctx.lineWidth = style.curve.width;
        ctx.strokeColor = style.curve.color;
        dot.forEach((point, i) => {
            ctx.moveTo(point[0].x, point[0].y);
            this.bezier[i] = [ Math.round(point[2].x)  ,Math.round(point[2].y) ,Math.round(point[3].x) ,Math.round(point[3].y) ,Math.round(point[1].x) ,Math.round(point[1].y) ];
            ctx.bezierCurveTo(...this.bezier[i]);
        });
        ctx.stroke();

        // 绘制控制点
        dot.forEach((point) => {
            point.forEach((dot, i) => {
                ctx.strokeColor = this.dotColor[i];
                ctx.fillColor = style.point.fillColor;
                ctx.arc(dot.x, dot.y, style.point.radius, style.point.arc1, style.point.arc2, true);
                ctx.fill();
                ctx.stroke();
            });
        });
    }

    /**
     * 拖拽开始
     * @param v 
     */
    dragStart(v: cc.Vec2) {

        let style = this.style;
        let dot = this.dot;

        cc.log(v)
        a: for (let j = 0; j < dot.length; j++) {
            for (let i = 0; i < dot[j].length; i++) {
                let d = dot[j][i];
                let dx = d.x - v.x;
                let dy = d.y - v.y;
                if ((dx * dx) + (dy * dy) < Math.pow(style.point.radius, 2)) {
                    this.drag = [j, i];
                    break a;
                }
            }
        }
    };

    /**
     * 拖拽
     * @param v 
     */
    dragging(v: cc.Vec2) {

        let drag = this.drag;
        if (drag) {
            let dot = this.dot[drag[0]][drag[1]];
            dot.x = v.x;
            dot.y = v.y;
            this.drawBezier();
        }

        // if (drag) {
        //     point[drag].x = v.x;
        //     point[drag].y = v.y;
        //     // this.drawCanvas();
        // }
    }

    /**
     * 拖拽结束
     */
    dragEnd() {
        this.drag = null;
        this.drawBezier();
    }

    getOrigin(): cc.Vec2 {
        return cc.v2(this.dot[0][0].x, this.dot[0][0].y - cc.game.canvas.height * 2)
    }

    getBezier() {
        let h = cc.game.canvas.height * 2;
        return this.dot.map((point) => {
            return [
                cc.v2(point[2].x, point[2].y - h),
                cc.v2(point[3].x, point[3].y - h),
                cc.v2(point[1].x, point[1].y - h)
            ];
        });
    }

    deleteBezier() {
        this.dot.pop();
        this.bezier.pop();
        this.drawBezier();
    }
}

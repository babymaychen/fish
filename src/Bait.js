/**
 * Created by Daniel.Duan on 14-4-8.
 */
//鱼饵
var Bait = cc.Sprite.extend({

    ctor:function () {
        this._super(MW.BAIT[MW.BAIT_SELECT].RES);
//        this.x = arg.x;
//        this.y = arg.y;
        this.x = MW.BAIT_X;
        this.y = MW.BAIT_Y;
        this.setScale(0.3);
    },

    collideRect:function (x, y) {
        return cc.rect(x - 3, y - 3, 6, 6);
    }
});


Bait.create = function (arg) {
    var bait = new Bait(arg);
    g_sharedGameLayer.addBait(bait, 1, 1001);
    return bait;
};
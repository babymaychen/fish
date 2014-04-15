/**
 * Created by Daniel.Duan on 14-4-4.
 */
var Fish = cc.Sprite.extend({
    active:true,
    speed:200,
    HP:15,
    scopeMin:0,
    scopeMax:480,
    interval:null,
    baitPosition:null,
    struggleFactor:3,            //摆脱力
    score:10,
    ctor:function (arg) {
        this._super(arg.textureName);

        this.HP = arg.HP;
        this.speed = arg.speed;
        this.scopeMin = arg.scopeMin;
        this.scopeMax = arg.scopeMax;
        this.struggleFactor = arg.struggle;
        this.setScale(arg.Scale);
        this.score = arg.score;

        this.interval = 1 + Math.random();
        this.schedule(this.swim, this.interval);
//        this.scheduleUpdate();
    },

    _timeTick:0,
    update:function (dt) {

    },

    destroy:function () {
        this.visible = false;
        this.active = false;
        this.stopAllActions();
        this.unschedule(this.swim);
    },

    collideRect:function (x, y) {
        var w = this.width, h = this.height;
        return cc.rect(x - w / 2, y - h / 4, w, h / 2+20);
    },

    swim:function () {
        var position = cc.p(Math.random() * 600-100,
            Math.round(Math.random() * (this.scopeMax-this.scopeMin) + this.scopeMin));

        this.moveTo(position);
    },

    struggleOff:function (p) {
        this.baitPosition = p;
        this.unschedule(this.swim);
        this.schedule(this.struggleTo, 0.2)
    },

    struggleTo:function () {
        var p = cc.p(this.baitPosition.x, this.baitPosition.y);
        var struggle = this.width * this.scale * this.struggleFactor;
        p.x += Math.random() * struggle - struggle/2;
        p.y += Math.random() * struggle - struggle/2;
        this.moveTo(p, 0.5)
    },

    moveTo:function(position, dt){
        this.stopAllActions();

        var o = position.x - this.x;
        var a = position.y - this.y;

        var at = Math.atan(a / o) * 57.29577951;  // radians to degrees

        if (a > 0) {
            if (o < 0)
                at = 180 + Math.abs(at);
            else
                at = 360 -  Math.abs(at);
        }else{
            if (o < 0)
                at = 180 - Math.abs(at);
            else
                at = Math.abs(at);
        }

        this.runAction(cc.RotateTo.create(0, at));
        if(dt){
            this.runAction(cc.MoveTo.create(dt, position));
        }else{
            this.runAction(cc.MoveTo.create(Math.random()*3, position));
        }

    },

    fadeAway:function(x){
        var p;
         if(this.x > x){
             p = cc.p(100 + winSize.width, this.y)
         }else{
             p = cc.p(-100, this.y)
         }
        this.moveTo(p);
        this.unschedule(this.swim);
//        this.destroy();
    }
});


Fish.create = function (arg) {
    var fish = new Fish(arg);
    fish.x = 100+ Math.random()*300;
    fish.y = 200+ Math.random()*60;
    g_sharedGameLayer.addFish(fish, 1, 1000);
    MW.CONTAINER.FISH.push(fish);
    return fish;
};

Fish.preSet = function () {
    MW.CONTAINER.FISH = [];
    var fish = null;
    for(var i=0; i<MW.SITE[MW.SITE_SELECT].FISH.length; i++){
        var type =MW.SITE[MW.SITE_SELECT].FISH[i].TYPE;
        var max = MW.SITE[MW.SITE_SELECT].FISH[i].MAX;
        var min = MW.SITE[MW.SITE_SELECT].FISH[i].MIN;
        var count = Math.round(Math.random() * (max-min)) + min;
        for (var j = 0; j < count; j++) {
            fish = Fish.create(FishType[type]);
            fish.stopAllActions();
//        fish.unscheduleAllCallbacks();
        }
    }

};
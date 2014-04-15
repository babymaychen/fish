/**
 * Created by Daniel.Duan on 14-4-2.
 */

STATE_SWIMMING = 0;
STATE_GAMEOVER = 1;
STATE_STRUGGLING = 2;
STATE_CATCHING = 2;
MAX_CONTAINT_WIDTH = 10;
MAX_CONTAINT_HEIGHT = 10;

var g_sharedGameLayer;


var FishLayer = cc.Layer.extend({
    _time: 0,
    _fish: null,
    _state: STATE_SWIMMING,
    _direction: 1,
    _angle: 0,
    _littleFish: null,
    _bait:null,
    _hp: 150,
    _background:null,
    _draw:null,

    score:null,

    init: function () {
        var bRet = false;
        if (this._super()) {

            this._draw = cc.DrawNode.create();
            this.addChild(this._draw, 10);
            this._draw.visible = false;


            this._background = cc.Sprite.create(MW.SITE[MW.SITE_SELECT].RES);
            this._background.attr({
                anchorX: 0,
                anchorY: 0
            });
            this.addChild(this._background, 0, 1);


            var bar = cc.Sprite.create(res.Bar_png);
            bar.attr({
                anchorX: 0,
                scale: 0.5,
                x: 54,
                y: 420
            });
            this._background.addChild(bar, 1, 3);

            //little fish
            this._littleFish = cc.Sprite.create(res.Fish_png);
            this._littleFish.attr({
                scale: 0.1,
                x: 130,
                y: 420
            });
            this._background.addChild(this._littleFish, 1, 4);


            // score
            this.score = cc.LabelBMFont.create("Score: " + MW.SCORE, res.arial_14_fnt);
            this.score.attr({
                anchorX: 1,
                anchorY: 0,
                x: winSize.width - 5,
                y: winSize.height - 30
            });
            this.score.textAlign = cc.TEXT_ALIGNMENT_RIGHT;
            this.addChild(this.score, 1000);


            if ('mouse' in cc.sys.capabilities)
                cc.eventManager.addListener({
                    event: cc.EventListener.MOUSE,
                    onMouseDown: function (event) {
                        event.getCurrentTarget().processEvent(event);
                    }
                }, this);

            if (cc.sys.capabilities.hasOwnProperty('touches')) {
                cc.eventManager.addListener({
                    event: cc.EventListener.TOUCH_ALL_AT_ONCE,
                    onTouchesBegan:function(touches, event){
                        event.getCurrentTarget().processEvent(touches[0]);
                    }
                }, this);
            }

            bRet = true;

            g_sharedGameLayer = this;

            Fish.preSet();

            //bait
            //TODO 甩勾
            var offsetX = Math.random()*60 - 30;
            var offsetY = Math.random()*30 - 15;
            var arg={x:winSize.width/2 + offsetX, y:winSize.height/2 + offsetY};
            Bait.create(arg);

            // schedule
            this.scheduleUpdate();

        }
        return bRet;
    },

    processEvent: function () {
        if (this._state == STATE_STRUGGLING) {
            if (MW.SOUND) {
                cc.audioEngine.setMusicVolume(0.7);
                cc.audioEngine.playMusic(res.Click_mp3, false);
            }
            var dx = this._fish.x - this._bait.x;
            var dy = this._fish.y - this._bait.y;
            var dis = Math.sqrt(dx * dx + dy * dy);
            if(dis<MW.POLE[MW.POLE_SELECT].SCOPE/2){
                this._littleFish.x -= 20;
                this.showClick("Perfect");
            }else if(dis<MW.POLE[MW.POLE_SELECT].SCOPE){
                this._littleFish.x -= 10;
                this.showClick("Great");
            }else{
                this._littleFish.x += 5;
                this.showClick("Miss");
            }

        }
    },

    showClick: function(dt){
        var fadeIn = cc.FadeIn.create(0.5);
        var fadeOut = cc.FadeOut.create(1);
        var moveUp = cc.MoveTo.create(1, cc.p(winSize.width/2 + 50, 400));
        var result= cc.LabelBMFont.create(dt, res.arial_14_fnt);
        result.attr({
            x: winSize.width/2 + 50,
            y: winSize.height/2
        });
        this.addChild(result, 1000);
        result.runAction(cc.Sequence.create(fadeIn, moveUp));
        result.runAction(fadeOut);
    },

    update: function () {
        if (this._state == STATE_SWIMMING) {
//            this.updateHp(dt);
//            this.moveFish(dt);
            this.checkIsCollide();
        }
    },

    updateHp: function (dt) {
        this._littleFish.x += dt * MW.SPEED;
        if (this._littleFish.x > 268) {
            this._state = STATE_GAMEOVER;
            this.onGameOver();
        }
        if (this._littleFish.x < 54) {
            this._state = STATE_GAMEOVER;
            this.onWin();
        }
    },

    checkIsCollide:function () {
        var fish, bait = this._bait;
        // check collide
        for (var i = 0; i < MW.CONTAINER.FISH.length; i++) {
            fish = MW.CONTAINER.FISH[i];
            if (this.collide(fish, bait)) {
                cc.log("got fish");
                this._state = STATE_CATCHING;
                this.gotFish(i, this._bait.getPosition());
            }
        }
    },

    collide:function (a, b) {
        var ax = a.x, ay = a.y, bx = b.x, by = b.y;
        if (Math.abs(ax - bx) > MAX_CONTAINT_WIDTH || Math.abs(ay - by) > MAX_CONTAINT_HEIGHT)
            return false;

        var aRect = a.collideRect(ax, ay);
        var bRect = b.collideRect(bx, by);
        return cc.rectIntersectsRect(aRect, bRect);
    },

    gotFish:function(index, p){
        this._draw.visible = true;
        this._draw.drawDot( cc.p(this._bait.x, this._bait.y), MW.POLE[MW.POLE_SELECT].SCOPE/2, cc.color(255, 0, 255, 128) );
        this._draw.drawDot( cc.p(this._bait.x, this._bait.y), MW.POLE[MW.POLE_SELECT].SCOPE, cc.color(255, 0, 255, 64) );
        this.schedule(this.updateHp);
        for (var i = 0; i < MW.CONTAINER.FISH.length; i++) {
            if(i == index){
                this._fish = MW.CONTAINER.FISH[i];
                this._fish.struggleOff(p)
            }else{
                MW.CONTAINER.FISH[i].fadeAway(p.x);
            }
        }
    },

//    moveFish: function (position) {
//        var sprite = this._fish;
//        sprite.stopAllActions();
//        var o = position.x - sprite.x;
//        var a = position.y - sprite.y;
//
//        var at = Math.atan(a / o) * 57.29577951;  // radians to degrees
//
//        if (a > 0) {
//            if (o < 0)
//                at = 180 + Math.abs(at);
//            else
//                at = 360 -  Math.abs(at);
//        }else{
//            if (o < 0)
//                at = 180 - Math.abs(at);
//            else
//                at = Math.abs(at);
//        }
//
//        sprite.runAction(cc.RotateTo.create(0, at));
//        sprite.runAction(cc.MoveTo.create(1, position));
//    },

    onGameOver: function () {
        if (MW.SOUND) {
            cc.audioEngine.setMusicVolume(0.7);
            cc.audioEngine.playMusic(res.Fail_mp3, false);
        }
        cc.log("Game over ");
        var fail = cc.Sprite.create(res.Fail_png);
        fail.attr({
            scale: 0.6,
            x: 150,
            y: 200
        });
        this.addChild(fail, 1, 8);
        this.addMenu();
        this.addMainMenu();
        this.unschedule(this.updateHp);
    },

    onWin: function () {
        if (MW.SOUND) {
            cc.audioEngine.setMusicVolume(0.7);
            cc.audioEngine.playMusic(res.Success_mp3, false);
        }
        MW.SCORE += this._fish.score;
        this.score.setString("Score: " + MW.SCORE);
        var win = cc.Sprite.create(res.Win_png);
        win.attr({
            scale: 0.6,
            x: 150,
            y: 200
        });
        this.addChild(win, 1, 9);
        this.addMenu();
        this.addMainMenu();
        this.unschedule(this.updateHp);
    },

    addMenu: function () {
        cc.MenuItemFont.setFontSize(18);
        cc.MenuItemFont.setFontName("Arial");
        var systemMenu = cc.MenuItemFont.create("Again", this.refreshGame);
        var menu = cc.Menu.create(systemMenu);
        menu.x = 0;
        menu.y = 0;
        systemMenu.attr({
            x: winSize.width - 120,
            y: 5,
            anchorX: 0,
            anchorY: 0
        });
        this.addChild(menu, 1, 2);
    },

    addMainMenu: function () {
        cc.MenuItemFont.setFontSize(18);
        cc.MenuItemFont.setFontName("Arial");
        var mainMenu = cc.MenuItemFont.create("Back", this.mainMenu);
        var menu = cc.Menu.create(mainMenu);
        menu.x = 0;
        menu.y = 0;
        mainMenu.attr({
            x: winSize.width - 60,
            y: 5,
            anchorX: 0,
            anchorY: 0
        });
        this.addChild(menu, 1, 2);
    },

    refreshGame: function () {
        cc.director.runScene(cc.TransitionFade.create(0.5, new FishLayer.scene));
    },

    mainMenu: function () {
        cc.director.runScene(cc.TransitionFade.create(0.5, new SiteLayer.scene));
    }
});

FishLayer.create = function () {
    var sg = new FishLayer();
    if (sg && sg.init()) {
        return sg;
    }
    return null;
};

FishLayer.scene = function () {
    var scene = cc.Scene.create();
    var layer = FishLayer.create();
    scene.addChild(layer, 1);
    return scene;
};

FishLayer.prototype.addFish = function (fish, z, tag) {
    this._background.addChild(fish, z, tag);
};

FishLayer.prototype.addBait = function (bait, z, tag) {
    this._background.addChild(bait, z, tag);
    this._bait = bait;
};
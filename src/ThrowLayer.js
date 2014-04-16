/**
 * Created by Daniel.Duan on 14-4-16.
 */
var ThrowLayer = cc.Layer.extend({
    _pole:null,

    init:function(){
        var bRet = false;
        if (this._super()) {


            if( 'accelerometer' in cc.sys.capabilities ) {
                // call is called 30 times per second
                cc.inputManager.setAccelerometerInterval(1/10);
                cc.inputManager.setAccelerometerEnabled(true);
                cc.eventManager.addListener({
                    event: cc.EventListener.ACCELERATION,
                    callback: function(accelEvent, event){
                        var target = event.getCurrentTarget();
                        cc.log('Accel x: '+ accelEvent.x + ' y:' + accelEvent.y + ' z:' + accelEvent.z + ' time:' + accelEvent.timestamp );

                        var w = winSize.width;
                        var h = winSize.height;

                        var x = w * accelEvent.x + w/2;
                        var y = h * accelEvent.y + h/2;


                        // Low pass filter
                        x = x*0.2 + target.prevX*0.8;
                        y = y*0.2 + target.prevY*0.8;

                        if(Math.abs(y-target.prevY) > winSize.height*0.3){
                            cc.inputManager.setAccelerometerEnabled(false);
                            MW.BAIT_X = x;
                            MW.BAIT_Y = winSize.height - y;
                            target.doneThrow();
                        }

                        target.prevX = x;
                        target.prevY = y;
                        target._pole.x = x;
                        target._pole.y = y ;


                    }
                }, this);

                this._pole = cc.Sprite.create(MW.POLE[MW.POLE_SELECT].RES);
                this._pole.x = winSize.width/2;
                this._pole.y = winSize.height/2;
                this.addChild(this._pole, 0, 1);

                // for low-pass filter
                this.prevX = 0;
                this.prevY = 0;
            } else {
                cc.log("ACCELEROMETER not supported");
            }

            bRet = true;
        }
        return bRet;
    },

    doneThrow: function () {
        cc.director.runScene(cc.TransitionFade.create(1.2, new FishLayer.scene));
    }
});

ThrowLayer.create = function () {
    var sl = new ThrowLayer();
    if (sl && sl.init()) {
        return sl;
    }
    return null;
};

ThrowLayer.scene = function () {
    var scene = cc.Scene.create();
    var layer = ThrowLayer.create();
    scene.addChild(layer, 1);
    return scene;
};
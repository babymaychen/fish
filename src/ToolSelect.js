/**
 * Created by Daniel.Duan on 14-4-14.
 */
var ToolLayer = cc.Layer.extend({

    _poleLabel:null,
    _baitLabel:null,

    init:function(){
        var bRet = false;
        if (this._super()) {

            // add display label
            this._poleLabel = ccui.Text.create();
            this._poleLabel.attr({
                string: "",
                fontName: "Marker Felt",
                fontSize: 20,
                anchorX: 0.5,
                anchorY: -1,
                x: winSize.width / 2.0,
                y: 380
            });

            this._poleLabel.setText(MW.POLE[0].NAME);
            this._poleLabel.setColor(cc.color.RED);
            this.addChild(this._poleLabel);

            // add BAIT label
            this._baitLabel = ccui.Text.create();
            this._baitLabel.attr({
                string: "",
                fontName: "Marker Felt",
                fontSize: 20,
                anchorX: 0.5,
                anchorY: -1,
                x: winSize.width / 2.0,
                y: 150
            });

            this._baitLabel.setText(MW.BAIT[0].NAME);
            this._baitLabel.setColor(cc.color.RED);
            this.addChild(this._baitLabel);


            // Create the page view
            var polePageView = ccui.PageView.create();
            polePageView.setSize(cc.size(220, 150));
            polePageView.setTouchEnabled(true);
            polePageView.x = winSize.width/2 - polePageView.getSize().width/2 ;
            polePageView.y = 250 ;
            for (var i = 0; i < MW.POLE.length; ++i) {
                var layout1 = ccui.Layout.create();
                layout1.setSize(cc.size(220, 150));
                var layoutRect1 = layout1.getSize();

                var imageView1 = ccui.ImageView.create();
                imageView1.setTouchEnabled(true);
                imageView1.setScale9Enabled(true);
                imageView1.loadTexture(MW.POLE[i].RES);
                imageView1.setSize(cc.size(220, 150));
                imageView1.x = layoutRect1.width / 2;
                imageView1.y = layoutRect1.height / 2;
                layout1.addChild(imageView1);

                polePageView.addPage(layout1);
            }
            polePageView.addEventListenerPageView(this.polePageViewEvent, this);
            this.addChild(polePageView);


            // Create the page view
            var baitPageView = ccui.PageView.create();
            baitPageView.setSize(cc.size(100, 60));
            baitPageView.setTouchEnabled(true);
            baitPageView.x = winSize.width/2 - baitPageView.getSize().width/2 ;
            baitPageView.y = 100 ;
            for (var j = 0; j < MW.BAIT.length; ++j) {
                var layout = ccui.Layout.create();
                layout.setSize(cc.size(100, 60));
                var layoutRect = layout.getSize();

                var imageView = ccui.ImageView.create();
                imageView.setTouchEnabled(true);
                imageView.setScale9Enabled(true);
                imageView.loadTexture(MW.BAIT[j].RES);
                imageView.setSize(cc.size(100, 60));
                imageView.x = layoutRect.width / 2;
                imageView.y = layoutRect.height / 2;
                layout.addChild(imageView);

                baitPageView.addPage(layout);
            }
            baitPageView.addEventListenerPageView(this.baitPageViewEvent, this);
            this.addChild(baitPageView);


            //add select menu
            cc.MenuItemFont.setFontSize(18);
            cc.MenuItemFont.setFontName("Arial");
            var systemMenu = cc.MenuItemFont.create("OK", this.toolSelect);
            var menu = cc.Menu.create(systemMenu);
            menu.x = 0;
            menu.y = 0;
            systemMenu.attr({
                x: winSize.width - 95,
                y: 5,
                anchorX: 0,
                anchorY: 0
            });
            this.addChild(menu, 1, 2);

            bRet = true;
        }
        return bRet;
    },

    polePageViewEvent: function (sender, type) {
        switch (type) {
            case ccui.PageView.EVENT_TURNING:
                MW.POLE_SELECT = sender.getCurPageIndex();
                this._poleLabel.setText(MW.POLE[MW.POLE_SELECT].NAME);
                break;
            default:
                break;
        }
    },

    baitPageViewEvent: function (sender, type) {
        switch (type) {
            case ccui.PageView.EVENT_TURNING:
                MW.BAIT_SELECT = sender.getCurPageIndex();
                this._baitLabel.setText(MW.BAIT[MW.BAIT_SELECT].NAME);
                break;
            default:
                break;
        }
    },

    toolSelect: function () {
        cc.director.runScene(cc.TransitionFade.create(1.2, new ThrowLayer.scene));
    }
});

ToolLayer.create = function () {
    var sl = new ToolLayer();
    if (sl && sl.init()) {
        return sl;
    }
    return null;
};

ToolLayer.scene = function () {
    var scene = cc.Scene.create();
    var layer = ToolLayer.create();
    scene.addChild(layer, 1);
    return scene;
};
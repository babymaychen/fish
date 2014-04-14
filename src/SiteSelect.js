/**
 * Created by Daniel.Duan on 14-4-4.
 */
var SiteLayer = cc.Layer.extend({

    _displayLabel:null,

    init:function(){
        var bRet = false;
        if (this._super()) {
//            var background = this._widget.getChildByName("background_Panel");

            winSize = cc.director.getWinSize();

            // add display label
            this._displayLabel = ccui.Text.create();
            this._displayLabel.attr({
                string: "",
                fontName: "Marker Felt",
                fontSize: 20,
                anchorX: 0.5,
                anchorY: -1,
                x: winSize.width / 2.0,
                y: 470
            });

            this._displayLabel.setText(MW.SITE[0].NAME);
            this._displayLabel.setColor(cc.color.RED)
            this._displayLabel.x = winSize.width / 2.0;
            cc.log(winSize.height / 2.0 + this._displayLabel.height * 1.5)
//            this._displayLabel.y = winSize.height / 2.0 + this._displayLabel.height * 1.5;
            this._displayLabel.y = 380;
            this.addChild(this._displayLabel)


            // Create the page view
            var pageView = ccui.PageView.create();
            pageView.setTouchEnabled(true);
//            pageView.y = (winSize.height - background.height) / 2 + (background.height - pageView.height) / 2;
//            pageView.x = (winSize.width - background.width) / 2 + (background.width - pageView.width) / 2;
            pageView.x = 40 ;
            pageView.y = 50 ;

            pageView.setSize(cc.size(250, 350));
            for (var i = 0; i < MW.SITE.length; ++i) {
                var layout = ccui.Layout.create();
                layout.setSize(cc.size(250, 350));
                var layoutRect = layout.getSize();

                var imageView = ccui.ImageView.create();
                imageView.setTouchEnabled(true);
                imageView.setScale9Enabled(true);
                imageView.loadTexture(MW.SITE[i].RES);
                imageView.setSize(cc.size(250, 350));
                imageView.x = layoutRect.width / 2;
                imageView.y = layoutRect.height / 2;
                layout.addChild(imageView);

                pageView.addPage(layout);
            }
            pageView.addEventListenerPageView(this.pageViewEvent, this);
            var a = ccui.Layout.create();
            this.addChild(pageView);


            //add select menu
            cc.MenuItemFont.setFontSize(18);
            cc.MenuItemFont.setFontName("Arial");
            var systemMenu = cc.MenuItemFont.create("Select", this.siteSelect);
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

            return true;
        }
        return bRet;
    },

    pageViewEvent: function (sender, type) {
        switch (type) {
            case ccui.PageView.EVENT_TURNING:
//                var pageView = sender;
                MW.SITE_SELECT = sender.getCurPageIndex();
                this._displayLabel.setText(MW.SITE[MW.SITE_SELECT].NAME);
                break;
            default:
                break;
        }
    },

    siteSelect: function () {
        cc.director.runScene(cc.TransitionFade.create(1.2, new ToolLayer.scene));
    }
});

SiteLayer.create = function () {
    var sl = new SiteLayer();
    if (sl && sl.init()) {
        return sl;
    }
    return null;
};

SiteLayer.scene = function () {
    var scene = cc.Scene.create();
    var layer = SiteLayer.create();
    scene.addChild(layer, 1);
    return scene;
};
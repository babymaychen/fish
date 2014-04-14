var MW = MW || {};
var winSize;

//SPEED EXTRA
MW.SPEED = 30;
MW.SCORE = 0;
MW.SITE_SELECT=0;
MW.POLE_SELECT=0;
MW.BAIT_SELECT=0;

//sound
MW.SOUND = true;

//container
MW.CONTAINER = {
    FISH:[]
};

//site config
MW.SITE=[
    {NAME:"SITE1 little and more", RES: res.Background_png, MIN:5, MAX:8},
    {NAME:"SITE2 medium", RES: res.Background1_jpg, MIN:2, MAX:5},
    {NAME:"SITE3 large and less", RES: res.Background2_png, MIN:1, MAX:3}
];

//pole config
MW.POLE=[
    {NAME:"pole1", RES: res.Fish_Pole1_png, DESCRIPTION:"", SCOPE:50},
    {NAME:"pole2", RES: res.Fish_Pole2_png, DESCRIPTION:"", SCOPE:60},
    {NAME:"pole3", RES: res.Fish_Pole3_png, DESCRIPTION:"", SCOPE:70}
];

//bait config
MW.BAIT=[
    {NAME:"bait1", RES: res.Bait1_png, DESCRIPTION:"", CHARM:10},
    {NAME:"bait2", RES: res.Bait2_png, DESCRIPTION:"", CHARM:20},
    {NAME:"bait3", RES: res.Bait3_png, DESCRIPTION:"", CHARM:30}
];

MW.FISH=[];
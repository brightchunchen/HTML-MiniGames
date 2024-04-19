/**
 * Created by yin123 on 2017/7/25.
 */
//global 虚构函数
function global(x,y,w,h){
    this.x=x;//x
    this.y=y;//y
    this.w=w;//宽度
    this.h=h;//高度
    /*对象计时器 如果对帧的概念不是很了解还是别看这个属性了*/
    this.timmer=0;
    /*像做的加速度*/
    this.leftG=10;
    /*向下移动速度*/
    this.vBottm=0;
    /*最大速度*/
    this.vMaxBottm=10;
    /*初始化速度*/
    this.vLeft=0;
    /*最大移动速度*/
    this.vMaxLeft=8;
    /*跳跃速度*/
    this.initJunpV=20;
    /*正在死亡*/
    this.deathIng=false;
    /*最高跳跃速度备份*/
    this.initJunpVBuff=20;
    this.Ih=0;
    this.Iw=0;
    /*确认死亡*/
    this.death=false;
    /*死亡延迟*/
    this.deathYc=5;
    /*死亡延迟的一个对比*/
    this.deathYcCon=0;
    /*子弹数量*/
    this.zdNum=2;
    /*生命值*/
    this.SMZ=5;
//降落方法
    /*死亡调用函数可以重写*/
    this.deathFun=function(){

    };
    /*向下落的函数*/
    this.moveBottom=function(terrainArr){
        if(this.moveBottomBool==false){
            return 1;
        }

        if(this.death==true){
            this.vBottm=this.vBottm+4;
            this.y=this.y+this.vBottm;
            this.deathYcCon++;
            if(this.deathYc==this.deathYcCon){
                return "death";
            }
            return "deathIng";
        }
        var moveBottom_Con=false;
        var WHlx=Math.floor(this.x/this.w);
        if(/^[0-9]*$/.test(this.x/this.w)){
            moveBottom_Con=true;
        }
        var WHly=Math.floor((this.y)/this.h);
        var around=terrainArr.getAround(WHly*terrainArr.WH.split("|")[0]+WHlx);
        var WHrx=Math.floor((this.x+this.w)/this.w);
        if(/^[0-9]*$/.test((this.x+this.w)/this.w)){
            moveBottom_Con=true;
        }
        var WHry=Math.floor((this.y)/this.h);
        var around2=terrainArr.getAround(WHry*terrainArr.WH.split("|")[0]+WHrx);
        var WHcx=Math.floor((this.x+this.w/2)/this.w);
        var around3=terrainArr.getAround(WHry*terrainArr.WH.split("|")[0]+WHcx);
        if(around3[7]==1){
            moveBottom_Con=false;
        }
        var THIS = this;
        function type0(){
            if(THIS.vBottm>THIS.vMaxBottm){
                THIS.vBottm=THIS.vBottm+4;
            }else{
                THIS.vBottm=THIS.vMaxBottm;
            }
            THIS.y=THIS.y+THIS.vBottm;
        }
        function type1(){
            THIS.initJunpV=THIS.initJunpVBuff;
            if(THIS.y+THIS.vBottm>WHly*THIS.h){
                THIS.y=WHly*THIS.h;
            }else{
                if(around[2]==0){
                    THIS.y=THIS.y+THIS.vBottm;
                }
            }
        }
        if(around[7]==0&&around2[7]==0){
            type0();
        }else if(around[7]==1&&around2[7]==0){
            if(moveBottom_Con){
                type0();
            }else{
                type1();
            }

        }else if(around[7]==0&&around2[7]==1){
            if(moveBottom_Con){
                type0();
            }else{
                type1();
            }
        }else if(around[7]==1&&around2[7]==1){
            type1();
        }
    };
    //this.moveWidth=moveWidth;//移动改变的距离
    //this.g=10;//下落加速度
    //this.speedG=3;//左右移动加速度
    //this.junpG=100;//跳跃加速度
    /*动画方法*/
    this.movePoint=function(P,time,f,o){
        if(this.timmer){
            clearInterval(this.timmer);
        }

        if(time==-1){
            this.x=typeof P.x!="undefined"?P.x:this.x;
            this.y=typeof P.y!="undefined"?P.y:this.y;
            return 1;
        }
        var moveJGx = (this.x- P.x)/time;
        var moveJGy = (this.y- P.y)/time;
        var THIS=this;
        var target=0;
        var num=0;
        this.timmer=setInterval(function(){
            num++;

            if(num>=time){
                if(typeof P.x!="undefined"){
                    THIS.x= P.x;
                }
                if(typeof P.y!="undefined"){
                    THIS.y= P.y;
                }

                clearInterval(THIS.timmer);
                if(f){
                    f(THIS);
                }
            }else{
                if(typeof P.x!="undefined"){
                    THIS.x=THIS.x-moveJGx
                }
                if(typeof P.y!="undefined"){
                    THIS.y=THIS.y-moveJGy;
                }
            }
            if(o&& o.interFun){
                o.interFun(THIS,o.constructor==user?"zdA":"zdB");
            }
        },1)
    };
}
//struct P
//option x 二维坐标x
//option y 二维坐标y
//time 位移间隔 time为-1表示没有间隔

//地形类

function terrain(x,y,w,h,type,WH,img,consotion){
    global.call(this,x,y,w,h);
    if(typeof consotion=="undefined"){
        consotion=false;
    }
    this.type=type;
    this.WH=WH;
    this.img=null;
    if(typeof img=="string"){
        this.img=new Image();
        this.img.src=img;
    }else{
        this.img=img;
    }
    this.consotion=consotion;
}
/*子弹类*/
function gjA(x,y,w,h,img){
    global.call(this,x,y,w,h);
    this.img=null;
    if(typeof img=="string"){
        this.img=new Image();
        this.img.src=img;
    }else{
        this.img=img;
    }
};
//用户操作类
function user(x,y,w,h,WH,img){
    global.call(this,x,y,w,h);
    this.WH=WH;
    this.img=null;
    this.fx="left";//子弹面向方向
    this.moveBottomBool=true;
    this.IMG_YC=0;
    if(typeof img=="string"){
        this.img=new Image();
        this.img.src=img;
    }else{
        this.img=img;
    }
    this.deathFun=function(global){
        global.gameIsEnd("Game Over");
    }
}
//初始化WH wh矩阵需要使用
user.prototype.initWH=function(){
        this.WH=Math.floor(this.x/this.w)+"|"+Math.floor(this.y/this.h);
};
//左移动方法
user.prototype.moveLeft=function(terrainArr){
    this.initWH();
    this.Ih=2;
    if(this.IMG_YC>=2){
        if(this.Iw>=2){
            this.Iw=0
        }else{
            this.Iw++;
        }
        this.IMG_YC=0;
    }else{
        this.IMG_YC++;
    }

    this.fx="left";
    var around=terrainArr.getAround(this.WH.split("|")[1]*terrainArr.WH.split("|")[0]+parseInt(this.WH.split("|")[0]));
    var around2=terrainArr.getAround(this.WH.split("|")[1]*terrainArr.WH.split("|")[0]+parseInt(this.WH.split("|")[0])+1);
    switch (around[2]){
        case 0:{
            if(this.vLeft<=this.vMaxLeft){
                this.vLeft=this.vLeft+this.leftG*0.5;
            }else{
                this.vLeft=this.vMaxLeft;
            }

            switch (around2[2]){
                case 1:{
                    this.vLeft=((parseInt(this.WH.split("|")[0])+1)*this.w-this.x)/1.5+1;
                    this.x=this.x+this.vLeft;
                    break;
                }
                case null:{
                    this.vLeft=((parseInt(this.WH.split("|")[0])+1)*this.w-this.x)/1.5+1;
                    this.x=this.x+this.vLeft;
                    break;
                }
                case 0:{
                    this.x=this.x+this.vLeft;
                }
            }
            break;
        }
        case 1:{
            this.x=this.WH.split("|")[0]*this.w;
            this.vLeft=0;
        }
    }
};
//右移动方法
user.prototype.moveRight=function(terrainArr){
    this.initWH();
    this.Ih=1;
    if(this.IMG_YC>=2){
        if(this.Iw>=2){
            this.Iw=0
        }else{
            this.Iw++;
        }
        this.IMG_YC=0;
    }else{
        this.IMG_YC++;
    }
    this.fx="right";
    var around=terrainArr.getAround(this.WH.split("|")[1]*terrainArr.WH.split("|")[0]+parseInt(this.WH.split("|")[0]));

    switch (around[0]){
        case 0:{
            if(this.vLeft<this.vMaxLeft){
                this.vLeft=this.vLeft+5;
            }else{
                this.vLeft=this.vMaxLeft;
            }
            this.x=this.x-this.vLeft;
            break;
        }
        case null:{
            this.x=this.WH.split("|")[0]*this.w;
            this.vLeft=0;
            break;
        }
        case 1:{
            this.x=this.WH.split("|")[0]*this.w;
            this.vLeft=0;
        }
    }
};
//跳跃方法
user.prototype.moveTop=function(terrainArr){
    this.initWH();
    this.moveBottomBool=false;
    var around=terrainArr.getAround(this.WH.split("|")[1]*terrainArr.WH.split("|")[0]+parseInt(this.WH.split("|")[0]));

    switch (around[4]){
        case 0:{
            if(this.initJunpV>0){
                this.initJunpV=this.initJunpV-4;
            }else{
                this.initJunpV=0;
                this.moveBottomBool=true;
            }
            this.y=this.y-this.initJunpV;
            break;
        }
        case 1:{
            this.vBottm=0;
            this.initJunpV=0;
            this.moveBottomBool=true;
        }
    }
};
//type 类型 jzImg 比列 4x1 defaultFun 默认函数 deathYc 死亡延迟
function monster(x,y,w,h,WH,img,type,jzImg,defaultFun,dtathYc,prototypeAttr){

    global.call(this,x,y,w,h);
    /*平A*/
    this.AtimeJG=100;
    this.Atime=0;

    this.skillBool=true;
    this.skillBoolJG=2000;

    this.SMZ=2;
    this.type=type;
    this.jzImg=jzImg;
    this.Ih=0;
    this.Iw=0;
    this.WH=WH;
    /*图片频率演出*/
    this.IMG_YC=0;
    this.defaultFun=defaultFun?defaultFun:"leftRight";
    if(typeof img=="string"){
        this.img=new Image();
        this.img.src=img;
    }else{
        this.img=img;
    }
    this.deathYc=dtathYc;
    this.deathYcCon=0;
    this.moveLeftGo=true;
    this.zdOk=true;
    if(typeof prototypeAttr!="object"){
        this.prototypeAttr=prototypeAttr;
    }else{
        var keys=Object.keys(prototypeAttr);
        for(var i=0;i<keys.length;i++){
            this[keys[i]]=prototypeAttr[keys[i]];
        }
    }
}
/*怪物发射子弹函数*/
monster.prototype.zdFun=function(a,b){
    if(Math.abs(b.userObj.y-this.y)<=50&&Math.abs(b.userObj.x-this.x)<=100&&this.zdOk==true&&this.zdNum>0){
        this.zdOk=false;
        var THIS = this;
        setTimeout(function(){
            THIS.zdOk=true;
        },1500);
        this.zdNum--;
        this.A(b);
    }
};



/*改变图片 位置*/
monster.prototype.IMG_CHANGE=function(){
    switch (this.jzImg){
        case "4x1":{
            this.Iw=0;
            this.Ih=0;
            break;
        }
        case "4x2":{
            if(this.moveLeftGo==true){
                this.Ih=1;
                if(this.IMG_YC>=4){
                    if(this.Iw>=3){
                        this.Iw=2;
                    }else{
                        this.Iw++;
                    }
                    this.IMG_YC=0;
                }else{
                    this.IMG_YC++;
                }

            }else{
                this.Ih=0;
                if(this.IMG_YC>=4){
                    if(this.Iw>=3){
                        this.Iw=2;
                    }else{
                        this.Iw++;
                    }
                    this.IMG_YC=0;
                }else{
                    this.IMG_YC++;
                }
            }
            break;
        }
    }
};

monster.prototype.leftRight=function(terrainArr){
    if(this.deathIng==true){
        return 0;
    }
    var ltW=Math.floor(this.x/this.w);
    var ltH=Math.floor(this.y/this.h);
    var around=terrainArr.getAround(ltH*terrainArr.WH.split("|")[0]+ltW);
    var around02=terrainArr.getAround(ltH*terrainArr.WH.split("|")[0]+ltW+1);
   this.IMG_CHANGE();
    switch (around[2]){
        case 1:{
            this.moveLeftGo=false;
            break;
        }
        case 0:{
            if(this.moveLeftGo==true){
                this.x=this.x+2;
            }
            break;
        }
        case null:{
            this.moveLeftGo=false;
            break;
        }
    }
    switch (around02[0]){
        case 1:{
            this.moveLeftGo=true;
            break;
        }
        case 0:{
            if(this.moveLeftGo==false){
                this.x=this.x-2;
            }
            break
        }
        case null:{
            this.moveLeftGo=true;
            break;
        }
    }
    switch (around02[2]){
        case null:{
            this.moveLeftGo=false;
            break;
        }
        case 1:{
            this.x=this.x-2;
            this.moveLeftGo=false;
        }
    }
    switch (around[8]){
        case 0:{
            this.moveLeftGo=false;
        }
    }
    switch (around02[6]){
        case 0:{
            this.moveLeftGo=true;
        }
    }
};
/*当遇到可落下的会自动落下 怪物左右移动方法2*/
monster.prototype.leftRightTwo=function(terrainArr){
    if(this.deathIng==true){
        return 0;
    }
    var ltW=Math.floor(this.x/this.w);
    var ltH=Math.floor(this.y/this.h);
    var around=terrainArr.getAround(ltH*terrainArr.WH.split("|")[0]+ltW);
    var around02=terrainArr.getAround(ltH*terrainArr.WH.split("|")[0]+ltW+1);
    this.IMG_CHANGE();
    switch (around[2]){
        case 1:{
            this.moveLeftGo=false;
            break;
        }
        case 0:{
            if(this.moveLeftGo==true){
                this.x=this.x+2;
            }
            break;
        }
        case null:{
            this.moveLeftGo=false;
            break;
        }
    }

    switch (around02[0]){
        case 1:{
            this.moveLeftGo=true;
            break;
        }
        case 0:{
            if(this.moveLeftGo==false){
                this.x=this.x-2;
            }
            break
        }
        case null:{
            this.moveLeftGo=true;
            break;
        }
    }
    switch (around02[2]){
        case null:{
            this.moveLeftGo=false;
        }
    }
};
monster.prototype.ISPZ=function(terrainArr,x,y){
    var ltW=Math.floor(x/this.w);
    var ltH=Math.floor(y/this.h);
    var around=terrainArr.getAround(ltH*terrainArr.WH.split("|")[0]+ltW);
    if(around[0]==1||around[2]==1||around[4]==1){
        return true;
    }else{
        return false;
    }
};
monster.prototype.A=function(O){
    if(this.Atime!=0){
        return 0;
    }
    var THIS = this;
    this.Atime=setTimeout(function(){
        clearTimeout(THIS.Atime);
        THIS.Atime=0;
    },this.AtimeJG);
    var zd=new gjA(THIS.moveLeftGo==false?THIS.x:THIS.x+this.w,THIS.y+3,
        O.loadRes[0].width,
        O.loadRes[0].height,O.loadRes[0]);
    O.zdB.push(zd);
    zd.movePoint({
        x:O.userObj.x,
        y:O.userObj.y
    },350,function(){
        for(var i=0;i<O.zdB.length;i++){
            if(O.zdB[i]==zd){
                O.zdB.splice(i,1);
            }
        }
    },{
        interFun:O.zdTrien
    });
};


/*BOOS 技能*/
/*skill_JumpKill.argu 函数参数*/
monster.prototype.skill_JumpKill=function(Obj,O){
    var defaultObj={
        time:10,
        allTime:500,
        addT:-1,
        endFun:function(){}
    };
    $EXTEND(defaultObj,typeof this.skill_JumpKill.argu=="undefined"?{}:this.skill_JumpKill.argu[0]);
    if(this.skillBool==false){
        return 0;
    }
    this.skillBool=false;

    this.buffDefaultFun=this.defaultFun;
    this.moveBottomBool=false;
    this.defaultFun="-1";
    var addT=defaultObj.addT==-1?defaultObj.time/defaultObj.allTime:defaultObj.addT;
    var T=0;
    var START_POINT={
        x:this.x,
        y:this.y
    };
    var END_POINT=null;
    if(this.moveLeftGo){
       END_POINT={
            x:this.x+100,
            y:this.y-100
        };
    }else{
        END_POINT={
            x:this.x-100,
            y:this.y-100
        }
    }
    var CENTER_POINT={
        x:this.moveLeftGo?this.x+100:this.x-100,
        y:this.y
    };
    var THIS = this;
    setTimeout(function(){THIS.skillBool=true},this.skillBoolJG);
    this.skill_JumpKillTimmer=setInterval(function(){
        T=T+addT;
        if(T>=1){
            clearInterval(THIS.skill_JumpKillTimmer);
            if(!defaultObj){
                return 0;
            }
            defaultObj.endFun(THIS);
            defaultObj=null;
            THIS.skill_JumpKillTimmer=null;
            THIS.moveBottomBool=true;
            THIS.defaultFun=THIS.buffDefaultFun;
            console.log(THIS.buffDefaultFun);
        }
        var x=bezierCurve({
            t:T,
            P0:START_POINT.x,
            P1:END_POINT.x,
            P2:CENTER_POINT.x
        });
        THIS.A(O);
        var y=bezierCurve(
            {
                t:T,
                P0:START_POINT.y,
                P1:END_POINT.y,
                P2:CENTER_POINT.y
            }
        );
        if(!THIS.ISPZ(mapUI[O.gs],x,y)){
            THIS.x=x;
            THIS.y=y;
        }else{

            clearInterval(THIS.skill_JumpKillTimmer);
            if(!defaultObj){
                clearInterval(THIS.skill_JumpKillTimmer);
                return 0;
            }
            defaultObj.endFun(THIS);
            defaultObj=null;
            THIS.skill_JumpKillTimmer=null;
            THIS.moveBottomBool=true;
            THIS.defaultFun=THIS.buffDefaultFun;
        }
        x=null;
        y=null;
    },defaultObj.time);
};
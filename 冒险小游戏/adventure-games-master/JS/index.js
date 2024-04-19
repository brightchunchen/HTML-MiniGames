(function(){
    var globalFun={};
    //中心计时器速度
    globalFun.speed=50;
    globalFun.gs=0;
    //canvas
    globalFun.targetTime=(new Date().getMinutes()+5)*60+new Date().getSeconds();
    globalFun.timeEndSeconds=globalFun.targetTime-0;
    globalFun.canvas=document.getElementById("c");
    globalFun.terrain="20|20";//地形宽高
    globalFun.userObj=new user(0,0,20,20,"0|0","Image/terrain/USER.png");
    globalFun.userObj.zdNum=5;
    globalFun.momoryCanvas=null;
    globalFun.userCanvas=null;

    globalFun.initBoss=false;
    globalFun.BOSS=null;
    //c2d
    globalFun.c2d=globalFun.canvas.getContext("2d");
//user message
    globalFun.userMove=false;
    globalFun.userObjLeft=false;
    globalFun.userObjRight=false;
    globalFun.userObjTop=false;
    globalFun.userDown=0;
    globalFun.userDebugger=false;
    //镜头X由于只有左右移动所以只有viewX参数
    globalFun.viewX=0;

    globalFun.animateA=null;
    //开始函数
    globalFun.startFun=function(){
        globalFun.initFun();
        clearInterval(globalFun.centerTime);
        //中心计时器
        var bgC=function(){
            if(globalFun.loaded==true){
                globalFun.centerTime=setInterval(globalFun.centerFun,globalFun.speed);
                drawTerrain();
                function a(){
                    globalFun.c2d.save();
                    globalFun.c2d.beginPath();
                    globalFun.c2d.clearRect(0,0,globalFun.canvas.width,globalFun.canvas.height);
                    globalFun.c2d.fillStyle="rgba(255,255,255,0.8)";
                    globalFun.c2d.fillRect(0,0,globalFun.canvas.width,globalFun.canvas.height);
                    globalFun.c2d.translate(globalFun.viewX,(globalFun.canvas.height-globalFun.momoryCanvas.height)/2);
                    //绘制背景
                    drawGameBg();
                    //绘制用户操作

                    //绘制面板

                    //
                    globalFun.c2d.drawImage(globalFun.userCanvas,0,0);
                    drawUserUI();
                    //判断用户操作角色和怪物数组碰撞


                    //镜头函数

                    globalFun.c2d.closePath();
                    globalFun.c2d.restore();
                    globalFun.animateA=requestAnimationFrame(a);
                    monsterUserObj();
                }
                a();

            }else{
                setTimeout(bgC,10);
            }
        };
        bgC();
    };
    //地形数组
    globalFun.terrainArr=[];
    //怪物数组
    globalFun.monsterArr=[];
    //子弹数组
    globalFun.zdA=[];
    //怪物子弹数组
    globalFun.zdB=[];
    //暂停函数
    globalFun.endFun=function(){
        globalFun.gameIsEnd("Game Over");
        clearInterval(globalFun.centerTime);
    };

    //初始化函数
    globalFun.initFun=function(){
        globalFun.canvas.width=document.documentElement.clientWidth>640?640:document.documentElement.clientWidth;
        globalFun.canvas.height=document.documentElement.clientHeight>500?500:document.documentElement.clientHeight;
        initTerrain();
    };
    //中心计时器周期调用函数;
    globalFun.centerFun=function(){
        var dateNum=new Date();
        globalFun.timeEndSeconds=globalFun.targetTime-(dateNum.getMinutes()*60+dateNum.getSeconds());
        if(globalFun.timeEndSeconds<=0){
            console.log("time is end");
            globalFun.timeEndSeconds=0;
        }
        dateNum=null;
        drawUserObj();
        //绘制怪物
        drawMonster();
        //调用每个关数相关函数
        startGSGlobalFun();
        jtFun();
        //drawTerrain();
    };
    //游戏结束触发函数只是对于清除了中心计时器
    globalFun.gameIsEnd=function(t){
        clearInterval(globalFun.centerTime);
        cancelAnimationFrame(globalFun.animateA);
        globalFun.c2d.clearRect(0,0,globalFun.canvas.width,globalFun.canvas.height);
        globalFun.c2d.fillStyle="#000000";
        globalFun.c2d.font="32px Georgia";
        globalFun.c2d.fillRect(0,0,globalFun.canvas.width,globalFun.canvas.height);
        var gradient=globalFun.c2d.createLinearGradient(0,0,c.width,0);
        gradient.addColorStop("0","#666666");
        gradient.addColorStop("0.25","#eeeeee");
        gradient.addColorStop("1.0","#ffffff");
        globalFun.c2d.fillStyle=gradient;
        globalFun.c2d.textBaseline="middle";
        globalFun.c2d.textAlign="center";
        globalFun.c2d.fillText(t,globalFun.canvas.width/2,globalFun.canvas.height/2);
    };
    //判断碰撞
    function isPZ(rect1,rect2){
        var str={};
        if(rect1.x>rect2.x&&rect1.x<rect2.x+rect2.w){
            str.leftRight="left";
        }else if(rect1.x+rect1.w>rect2.x&&rect1.x+rect1.w<rect2.x+rect2.w){
            str.leftRight="right"
        }else if(rect1.x==rect2.x){
            str.leftRight="right";
        }else if(rect1.x+rect1.w==rect2.x){
            str.leftRight="left"
        }else{
            str.leftRight=-1
        }
        if(rect1.y>rect2.y&&rect1.y<rect2.y+rect2.h){
            str.topBottom="top";
        }else if(rect1.y+rect1.h>rect2.y&&rect1.y+rect1.h<rect2.y+rect2.h){
            str.topBottom="bottom"
        }else if(rect1.y==rect2.y){
            str.topBottom="top"
        }else{
            str.topBottom=-1
        }
        return str;
    }
    function drawUserUI(){
        globalFun.c2d.fillText("子弹数量:"+globalFun.userObj.zdNum+" 生命值"+globalFun.userObj.SMZ+" 剩余时间"+ globalFun.timeEndSeconds,-globalFun.viewX+10,20-(globalFun.canvas.height-globalFun.momoryCanvas.height)/2);

    }
    function monsterUserObj(){
        var pzObj=null;
        for(var i=0;i<globalFun.monsterArr.length;i++){
            pzObj=isPZ(globalFun.userObj,globalFun.monsterArr[i]);
            if(pzObj.leftRight!=-1&&pzObj.topBottom!=-1){
                if(pzObj.topBottom=="bottom"){
                    if(globalFun.userDebugger==true){
                        return 0;
                    }
                    if( globalFun.monsterArr[i].death!=true&&globalFun.userObj.death!=true){
                        globalFun.monsterArr[i].death=true;
                        globalFun.monsterArr[i].deathFun(globalFun);
                        globalFun.userObj.zdNum++;
                       var deathObj=globalFun.userObj;
                        deathObj.moveBottomBool=false;
                        deathObj.movePoint({
                            y:deathObj.y-30
                        },50,function(){
                            deathObj.moveBottomBool=true;
                            deathObj=null;
                        });
                    }
                }else if(pzObj.topBottom=="top"){
                    if(globalFun.monsterArr[i].death!=true){
                        if(globalFun.userDebugger==true){
                            return 0;
                        }
                        if(globalFun.userObj.SMZ<=0){
                            globalFun.userObj.death=true;
                            globalFun.userObj.deathFun(globalFun);
                        }else{
                            globalFun.userObj.SMZ--;
                        }
                    }
                }
            }
        }
        for(i=0;i<globalFun.monsterArr.length;i++){
            for(w=0;w<globalFun.zdA.length;w++){
                pzObj=isPZ(globalFun.zdA[w],globalFun.monsterArr[i]);
                if(pzObj.leftRight!=-1&&pzObj.topBottom!=-1){
                   var deathObj=globalFun.monsterArr[i];
                    deathObj.deathIng=true;
                    deathObj.moveBottomBool=false;
                    globalFun.monsterArr[i].movePoint({
                        x:globalFun.monsterArr[i].x,
                        y:globalFun.monsterArr[i].y-15
                    },10,function(){
                        deathObj.deathFun(globalFun);
                        deathObj.death=true;
                        deathObj.moveBottomBool=true;
                        deathObj=null;
                    });
                    for( var e=0;e<globalFun.zdA.length;e++){
                        if(globalFun.zdA[e]==globalFun.zdA[w]){
                            clearInterval(globalFun.zdA[e].timmer);
                            globalFun.zdA.splice(e,1);
                        }
                    }
                }
            }
        }
        for( i=0;i<globalFun.zdB.length;i++){
            pzObj=isPZ(globalFun.zdB[i],globalFun.userObj);
            if(pzObj.leftRight!=-1&&pzObj.topBottom!=-1){
                if(globalFun.userDebugger==true){
                    return 0;
                }
                if(globalFun.userObj.SMZ<=1){
                    globalFun.userObj.death=true;
                    globalFun.userObj.deathFun(globalFun);
                    globalFun.userObj.SMZ=0;
                }else{
                    globalFun.userObj.SMZ--;
                }
                for( var f=0;f<globalFun.zdB.length;f++){
                    if(globalFun.zdB[f]==globalFun.zdB[i]){
                        clearInterval(globalFun.zdB[f].timmer);
                        globalFun.zdB.splice(f,1);
                    }
                }
            }
        }
    }
    //运行每一个关数相对应的函数
    function startGSGlobalFun(){
        for(var i=0;i<gsFun[globalFun.gs].length;i++){
            gsFun[globalFun.gs][i](globalFun);
        }
    }
    //绘制怪物

    //绘制用户操作角色
    function drawUserObj(){
        globalFun.u2d.clearRect(0,0,globalFun.userCanvas.width,globalFun.userCanvas.height);
        globalFun.u2d.save();
        globalFun.u2d.beginPath();
        globalFun.u2d.drawImage(globalFun.userObj.img,globalFun.userObj.Iw*32,globalFun.userObj.Ih*48,32,48,globalFun.userObj.x,globalFun.userObj.y,globalFun.userObj.w,globalFun.userObj.h);
        globalFun.userObj.moveBottom(mapUI[globalFun.gs]);
        if(globalFun.userMove){
            if(globalFun.userObjLeft){
               globalFun.userObj.moveLeft(mapUI[globalFun.gs]);
            }
            if(globalFun.userObjRight){
                globalFun.userObj.moveRight(mapUI[globalFun.gs]);
            }
            if(globalFun.userObjTop){
                globalFun.userObj.moveTop(mapUI[globalFun.gs]);
            }
        }

    }
    function monsterMoveType(o){
        if(o.defaultFun==-1){
            return 0;
        }
        var funName=o.defaultFun.split("*");
        for(var i=0;i<funName.length;i++){
            o[funName[i]](mapUI[globalFun.gs],globalFun);
        }
    }
    function  drawMonster(){

        for(var i=0;i<globalFun.monsterArr.length;i++){
            globalFun.u2d.drawImage(globalFun.monsterArr[i].img,
                globalFun.monsterArr[i].Iw*(globalFun.monsterArr[i].img.width/globalFun.monsterArr[i].jzImg.split("x")[0])
                ,globalFun.monsterArr[i].Ih*(globalFun.monsterArr[i].img.height/globalFun.monsterArr[i].jzImg.split("x")[1]),(globalFun.monsterArr[i].img.width/globalFun.monsterArr[i].jzImg.split("x")[0]),
                (globalFun.monsterArr[i].img.height/globalFun.monsterArr[i].jzImg.split("x")[1]),
                globalFun.monsterArr[i].x,globalFun.monsterArr[i].y,globalFun.monsterArr[i].w,globalFun.monsterArr[i].h);
            monsterMoveType(globalFun.monsterArr[i]);
            if(globalFun.monsterArr[i].moveBottom(mapUI[globalFun.gs])=="death"){
                globalFun.monsterArr.splice(i,1);
            };
        }
        for(i=0;i<globalFun.zdA.length;i++){
            globalFun.u2d.drawImage(globalFun.zdA[i].img,globalFun.zdA[i].x,globalFun.zdA[i].y,globalFun.zdA[i].w,globalFun.zdA[i].h);
        }
        for(i=0;i<globalFun.zdB.length;i++){
            globalFun.u2d.drawImage(globalFun.zdB[i].img,globalFun.zdB[i].x,globalFun.zdB[i].y,globalFun.zdB[i].w,globalFun.zdB[i].h);
        }

        globalFun.u2d.closePath();
        globalFun.u2d.restore();
    }

    //初始化内存bg
    globalFun.initStrToMonster=function(str,bool){
        if(typeof bool!="undefined"&&bool==true){
            if(globalFun.initBoss==true){return 0;}
            globalFun.initBoss=true;
        }

        var momArr=null;
            momArr=str.split(":");
            var Obj=new Object();
            if(typeof momArr[9]!="undefined"){
                var keys=momArr[9].split("*");
                for (var o=0;o<keys.length;o++){
                    Obj[keys[o].split("=>")[0]]=keys[o].split("=>")[1]?keys[o].split("=>")[1]:keys[o].split("=>")[0];
                }
            }
            return new monster(parseInt(momArr[0]),parseInt(momArr[1]),parseInt(momArr[2]),parseInt(momArr[3]),"0|0",momArr[4],parseInt(momArr[5]),momArr[6],momArr[7],
                parseInt(momArr[8]),Obj);
    };
    function  initTerrain(){
        var w=globalFun.terrain.split("|")[0];
        var h=globalFun.terrain.split("|")[1];
        globalFun.momoryCanvas=document.createElement("canvas");
        globalFun.momoryCanvas.width=w*mapUI[globalFun.gs].getWidth();
        globalFun.momoryCanvas.height=h*mapUI[globalFun.gs].getHeight();
        globalFun.userCanvas=document.createElement("canvas");
        globalFun.userCanvas.width=w*mapUI[globalFun.gs].getWidth();
        globalFun.userCanvas.height=h*mapUI[globalFun.gs].getHeight();
        globalFun.momoryC2d=globalFun.momoryCanvas.getContext("2d");
        globalFun.u2d=globalFun.userCanvas.getContext("2d");
        function drawImg(type,i){
            switch (type){
                case 0:{
                    break;
                }
                case 1:{
                    globalFun.terrainArr.push(new terrain(0,0,w,h,1,mapUI[globalFun.gs].getNowWH(i),"Image/terrain/terrain1.png",true));
                    break;
                }
            }
        }
       // window.testArr=globalFun;
        for(var i=0;i<mapUI[globalFun.gs].length;i++){
            drawImg(mapUI[globalFun.gs][i],i);
        }
        var momArr=null;
        for(i=0;i<monsterData[globalFun.gs].length;i++){
            momArr=monsterData[globalFun.gs][i].split(":");
            var Obj=new Object();
            if(typeof momArr[9]!="undefined"){
                var keys=momArr[9].split("*");
                for (var o=0;o<keys.length;o++){
                    Obj[keys[o].split("=>")[0]]=keys[o].split("=>")[1]?keys[o].split("=>")[1]:keys[o].split("=>")[0];
                }
            }
            globalFun.monsterArr.push(new monster(parseInt(momArr[0]),parseInt(momArr[1]),parseInt(momArr[2]),parseInt(momArr[3]),"0|0",momArr[4],parseInt(momArr[5]),momArr[6],momArr[7],
                parseInt(momArr[8]),Obj));
        }
        globalFun.loadRes=[
            new Image()
        ];
        globalFun.loadRes[0].src="Image/zdA/zd1.gif";
        var dT=function(){
            var loaded=0;
            var loadedM=0;
            var loadedRes=0;
            for(var i=0;i<globalFun.terrainArr.length;i++){
                if(globalFun.terrainArr[i].img.complete){
                    loaded++;
                }
            }
            for(i=0;i<globalFun.monsterArr.length;i++){
                if(globalFun.monsterArr[i].img.complete){
                    loadedM++;
                }
            }
            for(i=0;i<globalFun.loadRes.length;i++){
                if(globalFun.loadRes[i].complete){
                    loadedRes++;
                }
            }
            if(loadedRes==globalFun.loadRes.length&&loadedM==globalFun.monsterArr.length&&loaded==globalFun.terrainArr.length&&globalFun.userObj.img.complete==true){
                globalFun.loaded=true;
                console.log("loaded");
            }else{
                setTimeout(dT,10);
            }
        };
        dT();
    }
    //绘制内存地形bg
    function drawTerrain(){
        var w=0;
        var h=0;
        for(var i=0;i<globalFun.terrainArr.length;i++){
            w=globalFun.terrainArr[i].WH.split("|")[0]*globalFun.terrain.split("|")[0];
            h=globalFun.terrainArr[i].WH.split("|")[1]*globalFun.terrain.split("|")[1];
            globalFun.momoryC2d.drawImage(globalFun.terrainArr[i].img,w,h,globalFun.terrain.split("|")[0],globalFun.terrain.split("|")[1]);
        }
    }
    //绘制背景
    function  drawGameBg(){
        globalFun.c2d.drawImage(globalFun.momoryCanvas,0,0);
    }
    //移动镜头
    function jtFun(){
        if((globalFun.canvas.width/2)<(globalFun.userObj.x+globalFun.viewX)-10){
            globalFun.rightViewX();
        }else if((globalFun.canvas.width/2)>(globalFun.userObj.x+globalFun.viewX)+10){
            globalFun.leftViewX();
        }
    }
    globalFun.leftViewX=function(){
        if(globalFun.viewX>=0){
            globalFun.viewX=0;
        }else{
            globalFun.viewX+=5;
        }
    };
    globalFun.rightViewX=function(){
        if(globalFun.viewX<=(-globalFun.momoryCanvas.width+globalFun.canvas.width)){
            globalFun.viewX=(-globalFun.momoryCanvas.width+globalFun.canvas.width);
        }else{
            globalFun.viewX-=5;
        }
    };
    window.onkeydown=function(e){
        if(e.keyCode==65){

            // globalFun.userObj.moveRight(mapUI[globalFun.gs]);
            globalFun.userObjRight=true;
            globalFun.userMove=true;
            //globalFun.leftViewX();

        }
        if(e.keyCode==68){
            globalFun.userObjLeft=true;
            globalFun.userMove=true;
            //globalFun.userObj.moveLeft(mapUI[globalFun.gs]);
            // globalFun.rightViewX();
        }
        if(e.keyCode==87){
            globalFun.userObjTop=true;
            //globalFun.userObj.moveTop(mapUI[globalFun.gs]);
            globalFun.userMove=true;
        }
    };
    window.onkeyup=function(e){
        if(e.keyCode==87){
            globalFun.userObjTop=false;
        }
        if(e.keyCode==68){
            globalFun.userObjLeft=false;
        }
        if(e.keyCode==65){
            globalFun.userObjRight=false;
        }
        if(e.keyCode==87|| e.keyCode==68|| e.keyCode==65){
            globalFun.userObj.moveBottomBool=true;
            globalFun.userMove=false;
        }
        if(e.keyCode==74){
            if(globalFun.userObj.death==true||globalFun.userObj.zdNum<=0){
                return 0;
            }
            var zd=new gjA(globalFun.userObj.fx=="right"?globalFun.userObj.x:globalFun.userObj.x+globalFun.userObj.w,globalFun.userObj.y+3,globalFun.loadRes[0].width,globalFun.loadRes[0].height,globalFun.loadRes[0]);
            globalFun.userObj.zdNum--;
            zd.zdLen=globalFun.zdA.length;
            globalFun.zdA.push(zd);
            zd.movePoint({
                x:globalFun.userObj.fx=="right"?zd.x-80:zd.x+80,
                y:zd.y
            },100,function(){
                for(var i=0;i<globalFun.zdA.length;i++){
                    if(globalFun.zdA[i]==zd){
                        globalFun.zdA.splice(i,1);
                    }
                }
            },{
                interFun:globalFun.zdTrien
            });
        }
    };
    globalFun.zdTrien=function(T,arrName){
        var WHlx=Math.floor(T.x/globalFun.terrain.split("|")[0]);
        var WHly=Math.floor(T.y/globalFun.terrain.split("|")[1]);
        var arr=mapUI[globalFun.gs].getAround(parseInt(WHly*mapUI[globalFun.gs].WH.split("|")[0])+WHlx);
        if(arr[1]==1){
            for(var i=0;i<globalFun[arrName].length;i++){
                if(globalFun[arrName][i]==T){
                    clearInterval(T.timmer);
                    globalFun[arrName].splice(i,1);
                }
            }
        }
        arr=null;
    };
    globalFun.startFun();
})();
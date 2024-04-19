/**
 * Created by yin123 on 2017/7/24.
 */
Array.prototype.WH=null;
Array.prototype.getWidth=function(){
    if(this.WH==null){
        console.log("Now this.WH is null");
        return -1;
    }
    if(this.WH.split("|").length==2){
        return parseInt(this.WH.split("|")[0]);
    }else{
        console.log("Now this.WH is error");
        return -1;
    }
};
Array.prototype.getHeight=function(){
    if(this.WH==null){
        console.log("Now this.WH is null");
        return -1;
    }
    if(this.WH.split("|").length==2){
        return parseInt(this.WH.split("|")[1]);
    }else{
        console.log("Now this.WH is error");
        return -1;
    }
};
Array.prototype.getNowWH=function(i){
    var w=i%this.getWidth();
    var h=Math.floor(i/this.getWidth());
    return w+'|'+h;
};
Array.prototype.emptyArr=function(){
    this.splice(0,this.length);
};
Array.prototype.Around=new Array();
/*0 左边 1当前 2右边 3上左 4上中 5上右 6下左 7下中 8下右*/
Array.prototype.getAround=function(a){
    if(a<0||a>=this.length){
        console.log("getAround arguments is error");
        return -1;
    }
    this.Around.emptyArr();
    var returnArr=new Array();
    var w=Math.floor(a/this.getWidth());
    for(var i=0;i<3;i++){
        if(a-1+i>=w*this.getWidth()&&a-1+i<(w+1)*this.getWidth()){
            if(typeof this[a-1+i]!="undefined"){
                this.Around.push(this[a-1+i]);
            }else{
                this.Around.push(null);
            }
        }else{
            this.Around.push(null);
        }
    }
    for(i=0;i<3;i++){
        if(a-1+i-this.getWidth()>=(w-1)*this.getWidth()&&a-1+i-this.getWidth()<(w)*this.getWidth()){
            if(typeof this[a-1+i-this.getWidth()]!="undefined"){
                this.Around.push(this[a-1+i-this.getWidth()]);
            }else{
                this.Around.push(null);
            }
        }else{
            this.Around.push(null);
        }

    }
    for(i=0;i<3;i++){
        if(a-1+i+this.getWidth()>=(w+1)*this.getWidth()&&a-1+i+this.getWidth()<(w+2)*this.getWidth()){
            if(typeof this[a-1+i+this.getWidth()]!="undefined"){
                this.Around.push(this[a-1+i+this.getWidth()]);
            }else{
                this.Around.push(null);
            }
        }else{
            this.Around.push(null);
        }
    }
    returnArr=[].concat(this.Around);
    return returnArr;
};
//二次贝塞尔曲线(1-t)*(1-t)*P0+2*t*(1-t)*P1+t*tP2  t属于区间[0-1];
/**
 *
 * @param O 出入结构
 */
/*继承对象属性 bool如果是false那么O2将不会为null否则为null*/
function $EXTEND(O1,O2,bool){
    var key1=Object.keys(O2);
    for(var i=0;i<key1.length;i++){
        if(O2[key1[i]]){
           O1[key1[i]]=O2[key1[i]];
        }
    }
    key1=null;
    i=null;
    if(typeof bool!="undefined"&&bool==false){
        O2=null;
    }
}
function bezierCurve(O){
    var defaultObj={
        t:0,
        P0:0,
        P1:0,
        P2:0
    };
    $EXTEND(defaultObj,O);
    //defaultObj=null;
    return (1-defaultObj.t)*(1-defaultObj.t)*defaultObj.P0+2*defaultObj.t*(1-defaultObj.t)*defaultObj.P1+defaultObj.t*defaultObj.t*defaultObj.P2;
}


function on() {
  document.getElementById('game_rule').style.display = "block";
}
function off() {
  document.getElementById('game_rule').style.display = "none";
}                                                              //游戏规则弹出与关闭
function start() {
  var iwidth = 182;
  var time = 60;
  function sub() {
    iwidth -= 3;
    if (iwidth <= 0) {//如果达到最小值就不在减小
      iwidth = 0;
      clearInterval(timer);//定时器停止

      document.getElementById("game_over").style.display = "block";//时间结束，游戏结束界面显示
      stopyxtion()//93行函数 移除图片，清除定时器
    }
    document.getElementById('progress').style.width = iwidth + "px";
    time -= 1;
    if (time <= 0) {
      time = 0;
    }
    document.getElementById("sj").innerHTML = time + "S";
  }
  var timer = setInterval(sub, 100);//定时器定义进度条速度
}

$(function () {
  $("#start").click(function () {//点击开始按钮 调用开始函数
    $(this).stop().fadeOut(100);
    startyxtion();
    start();
  });

  $(".index").click(function () { //返回按钮点击事件绑定
    $(".game_over").hide();
    $("#start").stop().fadeIn(100);
  })
  $('#re').click(function () {    //重新开始按钮点击调用...
    startyxtion();
    start()
    $(".game_over").hide();       //游戏结束界面隐藏
    score = 0;
    $('.score').text(score)       //重新开始时分数重置
  })
})

var yx;
function startyxtion() {
  var arradd = ['./img/h0.png', './img/h1.png', './img/h2.png', './img/h3.png', './img/h4.png', './img/h5.png', './img/h6.png', './img/h7.png', './img/h8.png', './img/h9.png']

  var arrsub = ['./img/x0.png', './img/x1.png', './img/x2.png', './img/x3.png', './img/x4.png', './img/x5.png', './img/x6.png', './img/x7.png', './img/x8.png', './img/x9.png']

  var arrPos = [                    //图片出现位置数组
    { left: "100px", top: "115px" },
    { left: "20px", top: "160px" },
    { left: "190px", top: "142px" },
    { left: "105px", top: "193px" },
    { left: "19px", top: "221px" },
    { left: "202px", top: "212px" },
    { left: "120px", top: "275px" },
    { left: "30px", top: "295px" },
    { left: "209px", top: "297px" }
  ];

  var $yxImages = $("<img src='' class='yxImages'>")

  var posIndex = Math.round(Math.random() * 8);

  $yxImages.css({
    position: "absolute",
    left: arrPos[posIndex].left,
    top: arrPos[posIndex].top
  });

  var type = Math.round(Math.random()) == 0 ? arradd : arrsub;

  window.yxIndex = 0;
  window.yxIndexEnd = 5;
  yx = setInterval(function () {
    if (yxIndex > yxIndexEnd) {
      $yxImages.remove();
      clearInterval(yx);
      startyxtion();
    }
    $yxImages.attr("src", type[yxIndex]);
    yxIndex++;
  }, 200);
  $(".container").append($yxImages);
  gameRules($yxImages);
}
function stopyxtion() {
  $(".yxImages").remove();
  clearInterval(yx);
}
function gameRules($yxImages) {       //游戏加减分规则函数
  $yxImages.one("click", function () {
    window.yxIndex = 5;
    window.yxIndexEnd = 9;

    var $src = $(this).attr('src');
    console.log($src);
    var flag = $src.indexOf("x") >= 0 //调用indexOf方法判断src属性返回的字符串中是否包含x，也就是小灰灰的一组图片

    if (flag) {
      $('.score').text(parseInt($(".score").text()) - 10);
      if ($(".score").text() < 0) {
        $(".score").text(0)
      }
    } else {
      $('.score').text(parseInt($(".score").text()) + 10);
    }
  })
}
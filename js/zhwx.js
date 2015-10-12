/**
 * Created by muyuruhai on 12/10/15.
 */
var lastUser = null;
var lastDes = null;
var lastImg = null;
var cUser = null;
var cScore = null;
//配置页面在config.js
//加载页面
<?php
    $name = isset($_GET["name"])?htmlspecialchars(trim($_GET["name"])):null;
    $des = isset($_GET["des"])?htmlspecialchars(trim($_GET["des"])):null;
    $img = isset($_GET["img"])?htmlspecialchars(trim($_GET["img"])):null;
    if($name && $des && $img){
        echo "lastUser ='".$name."';"."\n";
        echo "lastDes ='".$des."';"."\n";
        echo "lastImg ='".$img."';"."\n";
    }
?>

$(document).ready(function(){
    var myconfig = function(opt){
        opt = opt ? opt : {};
        var me = {};
        if (opt.debug !== true) {
            me.shareLink = 'http://wx.wordhi.com';
            me.shareImgUrl = 'http://wx.wordhi.com/src/img/badge/';
            me.shareImg = 'http://wx.wordhi.com/src/img/badge/stamp_3.png';
        }else{
            me.shareLink = 'http://dev.muyuruhai.com';
            me.shareImgUrl = 'http://dev.muyuruhai.com/src/img/badge/';
            me.shareImg = 'http://dev.muyuruhai.com/img/badge/stamp_3.png';
        }
        return me;
    };


    wx.config({
        debug: true,
        appId: '<?php echo $signPackage["appId"];?>',
        timestamp: <?php echo $signPackage["timestamp"];?>,
    nonceStr: '<?php echo $signPackage["nonceStr"];?>',
        signature: '<?php echo $signPackage["signature"];?>',
        jsApiList: [
        'onMenuShareTimeline',
        'onMenuShareAppMessage',
        'onMenuShareQQ',
        'onMenuShareWeibo'
    ]
});
wx.ready(function() {
    var thisLink = myconfig({debug:true});
    console.log(thisLink);
    var shareTitle = "嗨！冒险 之 逃离深山 大冒险 现在起动啦！ 快来嗨一把吧！";
    var shareDesc = '你要逃离深山，看你啦';
    var shareLink = thisLink.shareLink;
    var shareImgUrl =thisLink.shareImgUrl;
    var shareImg = thisLink.shareImg;
    wx.checkJsApi({
        jsApiList: ['chooseImage'], // 需要检测的JS接口列表，所有JS接口列表见附录2,
        success: function(res) {
            // 以键值对的形式返回，可用的api值true，不可用为false
            // 如：{"checkResult":{"chooseImage":true},"errMsg":"checkJsApi:ok"}
        }
    });

    // 分享给朋友事件绑定
    wx.onMenuShareAppMessage({
        title: shareTitle,
        desc: shareLink,
        link: shareLink,
        imgUrl: shareImg,
        success:function(res){
        },
        trigger:function(){
            if (zhGameLogic.userDes() !== ''){
                this.title = '冒险者: '+zhGameLogic.userName();
                this.imgUrl = shareImgUrl + zhGameLogic.userBadge();
                this.desc = zhGameLogic.userDes();
                this.link = shareLink+'?name='+zhGameLogic.userName()+'&des='+zhGameLogic.userDes()+'&img='+zhGameLogic.userBadge();
            }else{
                this.title = shareTitle;
                this.imgUrl = shareLink + '/src/img/head.jpg';
                this.desc = '字嗨之逃离深山';
                this.link = shareLink;
            }
        }
    });

    // 分享到朋友圈
    wx.onMenuShareTimeline({
        title: shareTitle,
        link: shareLink,
        imgUrl: shareImg,
        trigger:function(res){
            if (zhGameLogic.userDes()!== ''){
                this.title = '冒险者: '+zhGameLogic.userName()+' 在逃离深山冒险获得\n“'+zhGameLogic.userDes()+'”称号';
                this.imgUrl = shareImgUrl + zhGameLogic.userBadge();
                this.link = shareLink+'?name='+zhGameLogic.userName()+'&des='+zhGameLogic.userDes()+'&img='+zhGameLogic.userBadge();
            }else{
                this.title = shareTitle;
                this.imgUrl = shareLink + '/src/img/head.jpg';
                this.link = shareLink;
            }
        }
    });

    // 分享到QQ
    wx.onMenuShareQQ({
        title: shareTitle,
        desc: shareDesc,
        link: shareLink,
        imgUrl: shareImg
    });

    // 分享到微博
    wx.onMenuShareWeibo({
        title: shareTitle,
        desc: shareDesc,
        link: shareLink,
        imgUrl: shareImg
    });
});

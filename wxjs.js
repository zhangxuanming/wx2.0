//	    wx.config({
//		    debug: true,
//		    appId: '<?php //echo $signPackage["appId"];?>//',
//		    timestamp: <?php //echo $signPackage["timestamp"];?>//,
//		    nonceStr: '<?php //echo $signPackage["nonceStr"];?>//',
//		    signature: '<?php //echo $signPackage["signature"];?>//',
//		    jsApiList: [
//			    'onMenuShareTimeline',
//			    'onMenuShareAppMessage',
//			    'onMenuShareQQ',
//			    'onMenuShareWeibo'
//		    ]
//	    });

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
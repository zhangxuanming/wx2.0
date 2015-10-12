<?php
//require_once "jssdk.php";
//$jssdk = new JSSDK("wx05fe1a08ee8d2a7b", "684bc37baad5b76148c9344275d83682");
//$signPackage = $jssdk->GetSignPackage();
?>
<!DOCTYPE html>
<html>
<head lang = "en">
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="target-densitydpi=device-dpi,width=640,width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
    <title>嗨！冒险 之 逃离深山 大冒险 现在起动啦！ 快来嗨一把吧！</title>

    <!-- Bootstrap -->
    <link href="css/bootstrap-3.3.5-dist/css/bootstrap.css" rel="stylesheet">
    <link href="css/app.css" rel="stylesheet">
    <!-- HTML5 shim and Respond.js for IE8 support of HTML5 elements and media queries -->
    <!-- WARNING: Respond.js doesn't work if you view the page via file:// -->
    <!--[if lt IE 9]>
        <!--<script src="https://oss.maxcdn.com/html5shiv/3.7.2/html5shiv.min.js"></script>-->
        <!--<script src="https://oss.maxcdn.com/respond/1.4.2/respond.min.js"></script>-->
    <![endif]-->
	<img src="src/img/head.jpg" style="position:absolute;width: 0;height: 0;">
    <script src="js/juicer-min.js"></script>
<!--    <script src="http://res.wx.qq.com/open/js/jweixin-1.0.0.js"></script>-->

    <!--模板-->
    <script id="pageTpl" type="text/template">
        <div class="row page page${id} full zh-hidden zh-read-yellow" data-page="${id}">
            <div class="col-md-12 full" style="position: relative;">
                <div class="row">
                    <div class="col-sm-12 zh-img-block">
	                    {@if img}
	                        <img src="src/img/${img}" class="zh-img-story img-responsive center-block" alt="Responsive image" >
	                    {@/if}
                    </div>
                </div>
                <div class="row" style="margin-top: 1em">
                    <div class="col-sm-12 zh-txt">
                        {@each txt as item,index}
                            {@if item==""}
                                <br/>
                            {@else}
                                <p class="zh-t-white zh-story-text">$${item}</p>
                            {@/if}
                        {@/each}
                    </div>
                </div>
                <div class="row zh-option">
                    <div class="col-md-12">
                        <button class="btn center-block btn-block zh-btn zh-showoptbtn zh-black"></button>
                    </div>
                    <div class="col-sm-12 zh-btnblock">

                        {@each actions as item,index}
                            <button data-from="${item.from}" data-to="${item.to}" data-score="${item.score}" class="btn btn-block zh-btn zh-sbtn">${item.txt}</button>
                        {@/each}

                    </div>
                </div>
            </div>
        </div>
    </script>
</head>

<body class="zh-black" ontouchstart="">
<div class="container" style="overflow-x: hidden">
<!--	上个用户页面-->
	<div class="row page pagelastuser full zh-hidden zh-yellow">
		<div class="col-md-12 full">
			<div class="row">
				<!--徽章-->
				<div class="col-xs-12" style="background-color: #ffffff">
					<div id="lastuserbadge" class="zh-stamp center-block"
					     style="background-image: url(./src/img/badge/angry.png);"></div>
				</div>
				<div id="lastusersummary" class="col-xs-12">
					<h2 id="lastusername" style="font-weight: bold"></h2>
					<h4>在字嗨逃离深山 大冒险中</h4>
					<h4>获得称号</h4>
					<h3 id="lastuserdes"></h3>
				</div>
			</div>
		</div>
		<div class="col-xs-12" style="position: absolute;bottom: 0;left: 0">
			<div class="row" >
				<div class="col-xs-12">
					<button data-from="0" data-to="1"
					        class="btn btn-block zh-btnwant"
					        style="font-weight: bold;">我也要玩</button>
				</div>
			</div>
		</div>
	</div>
<!--	splash页面-->
	<div class="row page pagesplash full zh-hidden">
		<div class="col-xs-12 v-center ">
			<img class="splash-logo" src="src/img/splash/bg2.png" />
		</div>
	</div>
<!--	起始页-->
    <div class="row page pagestart full zh-hidden zh-yellow" style="background:url(../src/img/yure1/startbg.png);">
	    <div class="col-xs-12 ps-block">
		    <h3 class="center-block text-center zh-t-white"
		        style="float: left;margin-left: 5%;font-size: 1.2em;color: rgba(255, 255, 255, 0.78);"
			    >嗨！冒险 之</h3>
		    <h1 class="center-block text-center zh-t-white"
		        style="float: left;margin-left: 5%;clear: both;margin-top: 5px;"
			    >逃离深山</h1>
		    <h3 class="center-block zh-t-white"
		        style="float: left;text-align: left;margin:5%;font-size: 1.2em;color: rgba(255, 255, 255, 0.78);line-height: 1.5em;"
			    >你从酒吧出来已是午夜，夜灯下无人的马路自有其浪漫风味。忽然你觉得脑后一疼……</h3>
		    <div class="row zh-name-wrap">
			    <input id="zh-name" class="zh-name" type="text" maxlength="8" value="你的名字?" placeholder="默认嗨客">
		    </div>
		    <div class="row">
			    <button data-from="0" data-to="1"
			            class="col-xs-10 col-xs-offset-1 btn btn-lg zh-btn zh-btn-yellow zh-btnstart"
			            style="font-weight: bold;"
				    >开始嗨</button>
		    </div>
	    </div>
    </div>

    <!--剧情会被插入这里-->

    <!--结局页-->
    <div class="row page pageend full zh-hidden zh-yellow" style="background-color: #ffe681">
	    <div class="col-xs-12" style="margin-top: -6%;">
		    <div class="row"><!--徽章-->
			    <div class="col-xs-12" style="background:#fff;"><!--分值-->
				    <p id="zh-summaryPage-title" class="text-center" style="padding-top: 10%;color: #777;">根据您的战斗表现，我们觉得您的战斗力为 :</p>
				    <p class="text-center">
					    <span class="zh-totalscore text-center" style="font-size:60pt;color:#FFF054;line-height: 1"></span>
				    </p>
				    <p class="text-center zh-t-yellow1">战斗力</p>
				    <!--结语-->
				    <img class="zh-stamp center-block" style="margin-top: -3px;margin-bottom: 4%;" src="./src/img/badge/stamp_3.png" />
			    </div>
		    </div>
	    </div>
	    <div class="col-xs-12 v-bottom" style="background-color: #ffe681">
		    <div class="row">
			    <div class="col-xs-12" style="margin-top: 2%;">
				    <br>
				    <h4 class="zh-summarytext text-center" style="    font-size: 24px;margin-top: 5%;color: #8A6E00;"></h4>
			    </div>
			    <div class="col-xs-6 col-xs-offset-3">
				    <button class="btn btn-block btn-lg zh-btn zh-restartbtn">重玩一次</button>
			    </div>
		    </div>
	    </div>
    </div>

</div>

<!--遮罩层-->
<div class="zh-overlay-mask" style=" overflow:  hidden;">
	<div id="zh-modal-wrap">
		<div id="zh-modal" class="zh-modal zh-item-modal">
			<div class="zh-modal-top">
				<div class="row">
					<div class="col-xs-10">
						<span class="zh-m-name">看法宝！</span>
					</div>
					<div class="col-xs-2">
						<span class="zh-m-img" style="background: url(./src/img/logo1.jpg) center;background-size: cover"></span>
					</div>
					<div class="col-xs-12" style="margin-top: 1em">
						<p class="zh-m-des" ">点击文字拾取宝物哟</p>
					</div>
				</div>
				<button class="zh-btn zh-btn-yellow btn-block zh-m-btn" data-modal="close" data-txt="嗯，朕知道了">额。。这是啥</button>
			</div>
		</div>
		<div id="zh-modal-noty" class="zh-modal-noty">
			<div class="row">
				<div class="col-xs-12 zh-noty-title">
					<p>君上威武！</p>
				</div>
				<div class="col-xs-12 zh-noty-content">
					<p>获得: [<span>吃饭睡觉</span>] 剧情选项</p>
				</div>
			</div>
		</div>
	</div>
</div>

<!--<script src="js/vue/vue.js"></script>-->
<script src="js/jquery-2.1.4.min.js"></script>
<!--配置页面-->
<script src="js/config.js"></script>
<script src="css/bootstrap-3.3.5-dist/js/bootstrap.min.js"></script>
<script src="js/greensock-js/src/minified/TweenMax.min.js"></script>
<script src="js/zh-game.js"></script>
<script src="js/zh-story.js"></script>
<!--<script src="js/hammer/hammer.js"></script>-->

<script>
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



	    return;
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
    });

	window.onload = function(){
		zhLoadStory.setConfig(zhConfig);
		zhLoadStory.setLogicModal(zhGameLogic);
		zhLoadStory.init();
		zhGameLogic.showLastUserResult(lastUser,lastDes,lastImg);
		$(".zh-restartbtn").click(function(e){
			zhGameLogic.restart();
		});
		$(".zh-btnwant").click(function(e){
			zhGameLogic.restart();
		});
		var $zhname = $('#zh-name');
		$zhname.focus(function(e){
			$(this).toggleClass("zh-name-active");
		});
		$zhname.blur(function(e){
			$(this).toggleClass("zh-name-active");
		})
	};
</script>
</body>
</html>
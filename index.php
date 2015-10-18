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
    <title>嗨！冒险 之 成语挑战！</title>

    <!-- Bootstrap -->
    <link href="css/bootstrap-3.3.5-dist/css/bootstrap.css" rel="stylesheet">
	<!-- zihi style sheet-->
<!--    <link href="css/app.css" rel="stylesheet">-->
	<link href="css/wx20.css" rel="stylesheet">
	<script src="js/jquery-2.1.4.min.js"></script>
	<script src="js/greensock-js/src/minified/TweenMax.min.js"></script>
	<script src="js/underscore-min.js"></script>
    <script src="js/juicer-min.js"></script>
	<!-- template engine	-->
	<script src="css/bootstrap-3.3.5-dist/js/bootstrap.min.js"></script>
	<!-- <script src="http://res.wx.qq.com/open/js/jweixin-1.0.0.js"></script>-->

	<img src="src/img/head.jpg" style="position:absolute;width: 0;height: 0;">
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

<body class="" ontouchstart="">
<div class="container full" style="overflow-x: hidden">
<!--	上个用户页面-->

<!--	splash页面-->
	<div class="row page pagesplash full zh-hidden">
		<div class="col-xs-12 v-center ">
			<img class="splash-logo" src="src/img/splash/bg2.png" />
		</div>
	</div>

<!--    游戏页-->
    <div class="row wrap full zh-yellow">
<!--	    头部信息-->
	    <div class="col-sm-12 g-top">
		    <div class="col-sm-12 center-block" style="padding:0.3em;text-align: center;font-size: 1.2em;color: azure">视觉系颜值高</div>
		    <div class="g-top-container">
			    <div class="row">
				    <div class="col-xs-5 g-score">XXX分</div>
				    <div class="col-xs-5 g-timeleft">xxx毫秒</div>
			    </div>
			    <div class="row">
				    <div class="col-xs-10 g-timebar">
					    <span class="g-barinner"></span>
				    </div>
			    </div>
		    </div>
	    </div>
<!--	    游戏区-->
	    <div class="col-sm-12 g-middle">
		    <div class="row">
			    <div class="col-sm-12 g-info" style="background-color: greenyellow">12321</div>
			    <div class="col-sm-12 g-area">
				    <div class="g-wrap">

				    </div>
			    </div>
		    </div>
	    </div>
<!--	    底部操作区-->
	    <div class="col-sm-12 g-bottom"></div>
    </div>

    <!--结局页-->
    <div class="row page pageend full zh-hidden zh-yellow" style="background-color: #ffe681">

    </div>

</div>

<!--遮罩层-->
<div class="zh-overlay-mask zh-hidden" style=" overflow:  hidden;">
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

<!--配置页面-->
<script src="js/zh-gameLayout.js"></script>
<script src="js/zh-gameTimer.js"></script>
<!--<script src="js/config.js"></script>-->
<!--<script src="js/zh-game.js"></script>-->
<!--<script src="js/zh-story.js"></script>-->
<!--<script src="js/hammer/hammer.js"></script>-->

<script>

	//		tim(0);
	$(document).ready(function(){

		gameModule.init({
			col:6,
			row:5,
			margin:1
		});
		$g = $(".g-timeleft");
		$bar = $('.g-barinner');
		$m = $('.zh-overlay-mask');
		function getBarLegnth(){
			return 100*(1 -  tt.getRunningSecond() / tt.getMaxtime());
		}

		var tt = gameTimer;
		tt.setMaxtime(5);
		tt.setDelay(1000/24);
		tt.updateCallback(function(n){
			var bl = getBarLegnth();
			$bar.css({"width":bl+"%"});
			$g.html(tt.getRunningSecond());
		});
		tt.endCallback(function(n){
			console.log("end la");
		});
		var an = true;
		//倒计时
		var tcd = new tt.cd(1000);
		$(".g-block").click(function(){
			if(an){
				tcd.stepFunc(function(n){
					$g.html("预备开始:"+(4-n));
					$m.fadeIn(400).delay(200).fadeOut(200);
				});
				tcd.start(function(n){
					tt.loopRestart();
				},3);
			}else{
				tt.loopStop();
			}
			an = !an;
		});

	});
</script>
</body>
</html>
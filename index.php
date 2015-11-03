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
    <title>四目矩阵！</title>

    <!-- Bootstrap -->
    <link href="css/bootstrap-3.3.5-dist/css/bootstrap.css" rel="stylesheet">
	<!-- zihi style sheet-->
<!--    <link href="css/app.css" rel="stylesheet">-->
	<link href="css/wx20.css" rel="stylesheet">
	<script src="js/jquery-2.1.4.min.js"></script>
	<script src="js/greensock-js/src/minified/TweenMax.min.js"></script>
	<script src="js/underscore-min.js"></script>
	<script src="js/underscore.string.js"></script>
	<script>_.mixin(s.exports());</script>
    <script src="js/juicer-min.js"></script>
	<script src="js/howler.min.js"></script>
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
	<div class="row page pagesplash full zh-hidden1">
		<div class="col-xs-12 v-center ">
			<img class="splash-logo" src="src/img/splash/bg2.png" />
		</div>
	</div>
	<!--	游戏首页页面-->
	<div class="row page landing full zh-hidden">
		<div class="l-gamedes center-block">
		</div>
		<div class="l-btnWrap col-xs-12">
			<button class="btn btn-block btn-default g-startBtn l-btn">开始游戏</button>
			<button class="btn btn-block btn-default g-aboutBtn l-btn">关于</button>
		</div>
	</div>
<!--    游戏页-->
    <div class="row game-wrap full">
<!--	    头部信息-->
	    <div class="col-sm-12 g-top">
		    <div class="col-sm-12 center-block" style="padding:0.3em;text-align: center;font-size: 1.2em;color: azure">四目矩阵</div>
		    <div class="g-top-container clearfix">
			    <div style="width: 50%;height: 100%;float:left;">
				    <div class="row">
					    <div class="col-xs-12">积分:<span class="g-score">0</span></div>
				    </div>
				    <div class="row">
					    <div class="col-xs-12"><span>倒计时:</span><span class="g-timeleft">60</span></div>
				    </div>
				    <div class="row">
					    <div class="col-xs-12"><span>正确率:</span><span class="g-correctRate"></span></div>
				    </div>
			    </div>
			    <div class="clearfix g-boxBagContainer">
				    <div class="g-boxBag">
				    </div>
			    </div>

		    </div>
	    </div>
<!--	    游戏区-->
	    <div class="col-sm-12 g-middle">
		    <div class="row">
			    <div class="col-xs-12 g-collectedBox">
				    <div class="g-cwrap">
					    <div class="g-cbox"></div>
					    <div class="g-cbox"></div>
					    <div class="g-cbox"></div>
					    <div class="g-cbox"></div>
				    </div>
			    </div>
		    </div>
		    <div class="row">
			    <div class="col-sm-12 g-area">
				    <div class="row">
					    <div class="col-xs-12 g-timebar">
						    <span class="g-barinner"></span>
					    </div>
				    </div>
				    <div class="g-wrap">

				    </div>
			    </div>
		    </div>
	    </div>
<!--	    底部操作区-->
	    <div class="col-sm-12 g-bottom">
		    <div id="btn-refresh" class="btn zh-yellow btn-block">太难了，换一个</div>
		    <div id="btn-restart" class="btn zh-yellow btn-block">重新开始</div>
	    </div>
    </div>

    <!--结局页-->
    <div class="row page pageend full zh-hidden zh-yellow" style="background-color: #ffe681">

    </div>

</div>

<!--卡片-->
<!--<div class="g-cardWrap">-->
<!--	<p>欣欣向荣</p>-->
<!--</div>-->

<div class="zh-overlay-mask zh-hidden" style=" overflow:  hidden;">
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
							<p class="zh-m-des" ">点击文字拾取宝物哟 </p>
						</div>
					</div>
					<button class="zh-btn zh-btn-yellow btn-block zh-m-btn" data-modal="close" data-txt="嗯，朕知道了">额。。这是啥</button>
				</div>
			</div>
			<!--		<div id="zh-modal-noty" class="zh-modal-noty">-->
			<!--			<div class="row">-->
			<!--				<div class="col-xs-12 zh-noty-title">-->
			<!--					<p>君上威武！</p>-->
			<!--				</div>-->
			<!--				<div class="col-xs-12 zh-noty-content">-->
			<!--					<p>获得: [<span>吃饭睡觉</span>] 剧情选项</p>-->
			<!--				</div>-->
			<!--			</div>-->
			<!--		</div>-->
		</div>
</div>

<!--配置页面-->
<script src="js/zh-gameLayout.js"></script>
<script src="js/zh-gameTimer.js"></script>
<script src="js/zh-gameLogic.js"></script>
<!--<script src="js/config.js"></script>-->
<!--<script src="js/zh-game.js"></script>-->
<!--<script src="js/zh-story.js"></script>-->
<!--<script src="js/hammer/hammer.js"></script>-->

<script>

	$(document).ready(function(){
		//游戏入场
		$(".pagesplash").click(function(){
			$(this).fadeOut(300,function(){
				$(".landing").fadeIn(300);
			})
		});
		$(".g-startBtn").click(function(){
			$(".landing").fadeOut(50,function(){
				var tl = new TimelineMax();
				tl.to($(this),0.2,{display:'none'})
					.fromTo($(".game-wrap"),0.1,{alpha:0},{alpha:1})
					.staggerFromTo($(".g-block"),0.3,{alpha:0,x:_.random(-1000,1000),y:_.random(-1000,1000)},
					{alpha:1,scale:1,x:0,y:0,zIndex:"none",ease:Back.easeInOut},0.02);
				tl.eventCallback("onComplete",function(){TweenMax.set($(".g-block"),{clearProps:"z-index"})});
			});
		});

		//游戏初化设定
		gameModule.init({
			col:6,
			row:5,
			margin:2,
			debug:true
		});

		//时间槽设定
		$g = $(".g-timeleft");
		$bar = $('.g-barinner');
		$m = $('.zh-overlay-mask');
		function getBarLegnth(){
			return 100*(1 -  tt.getRunningSecond() / tt.getMaxtime());
		}
		//时间控制模块
		var tt = gameTimer;
		tt.setMaxtime(60);//设定游戏时长
		//设定update 调用
		tt.updateCallback(function(n){
			var bl = getBarLegnth();
			$bar.css({"width":bl+"%"});
			$g.html(parseFloat(60 - tt.getRunningSecond()).toFixed(3));
		});
		//设定时间结束后的调用
		tt.endCallback(function(n){
			gameOver();
		});
		function gameOver(){
			var summary = gameModule.gameOver();
			console.log(summary);
		}

		//重新开始游戏
		$('#btn-restart').click(function(){
			$(".g-cardWrap").remove();
			var summary = gameModule.gameOver();
			gameModule.init();
			tt.reset();
		});

		//声音模块设定
		var sound1 = new Howl({
			urls:["src/sound/kick.wav"],
			volume:1,
			buffer:true
		});
		var sound2 = new Howl({
			urls:["src/sound/rippaper.wav"],
			volume:1,
			buffer:true
		});

		//刷新每轮
		$("#btn-refresh").click(function(){
			if(gameModule.isGameOver()){
				console.log("游戏已经结束啦");
				return;
			}
			sound1.play();
			gameModule.refresh();
			if(tt.isStopped()){
				tt.start();
			}
			tt.changeRuningSecond(-5);
		});

		var boxLeft = 10;
		var boxTop = 2
			,_selectedCss = "g-blockSelected";
		var boxBagPosition = function(){
			var $boxBag = $(".g-boxBag");
			console.log($boxBag.offset());
			return {
				width:$boxBag.width(),
				height:$boxBag.height(),
				left:$boxBag.offset().left-20,
				top:$boxBag.offset().top
			}
		};
		//点击动作
		$(document).on({
			click:function(e){
				boxBagPosition();
				//游戏结束后点击无用
				if(gameModule.isGameOver()){
					return;
				}
				if(tt.isStopped()){
					tt.start();
				}
				var $box = $(this);
				var boxId = $box.attr("data-boxid");
				var isBoxCheckResult = gameModule.Logic.checkBoxOnClick(boxId); //取得判定结果
				if(!isBoxCheckResult){
					return;
				}
				if(!isBoxCheckResult.isBox){
					tt.changeRuningSecond(-5);
					_.each(isBoxCheckResult.positionHistory,function(v,i){
						$('[data-boxid="'+v+'"]').removeClass(_selectedCss);
					});
				}else{
					$box.addClass(_selectedCss);
				}

				if(isBoxCheckResult.isNewCollected){
					var $b = $('body');
//					var $b = $('#boxBag');
					var dw = 0;
					boxLeft = 0;
					_.each(isBoxCheckResult.isNewCollected,function(v,i){
						var d = $('[data-boxid='+ v.pos+']');
						var pos = d.offset();
						var cl = d.clone();
						var cbSize = {
							width:d.width()/3,
							height: d.width()/3
						};


						dw = d.width()/2.5;
						boxLeft = boxLeft + dw;
//						cl.removeAttr("data-boxid")
//							.removeClass("g-block")
//							.removeClass('g-blockSelected')
//							.addClass("g-collected");
//						TweenMax.fromTo(cl,2
//							,{"left":pos.left,"top":pos.top,"zIndex":10}
//							,{"top":boxTop+"px","left":boxLeft+"px","width":cbSize.width,"height":cbSize.height,"fontSize":"0.6em","position":"absolute",delay:0,ease:Back.easeInOut}
//							,0.3,"+=2");
//						$b.append(cl);


//						$b.append(card);
//						var tl = new TimelineMax();
//						var h = bagSize.top - card.height()/3;
//						var dTop = h + card.height()/1.8;
//						console.log(bagSize);
//						TweenMax.set(card,{alpha:0});
//						tl.fromTo(card,0.7,{alpha:0,scale:0},{alpha:1,scale:1,'zIndex':'10',ease:Back.easeInOut})
//							.to(card,0.7,{'left':bagSize.left,'top':h,onComplete:function(){
//								$(card).appendTo('.g-boxBag');
//							}},"+=0.7")
//							.to(card,1,{'top':dTop,'boxShadow':'none'});


					});
					var bagSize = boxBagPosition();
					var card = $('<div class="g-cardWrap"><p>'+isBoxCheckResult.collectedWord+'</p></div>');
					$b.append(card);
					var tl = new TimelineMax();
					var h = bagSize.top - card.height()/3;
					var dTop = h + card.height()/1.8;
					var gTop = $(".g-top");
					var gh = gTop.height();
					var gw = gTop.width();
					var mh = gh*0.75;
					var mw = gw/3;
					var ml = gw - 30;//gw/3 + 30;
					var mt = '1em';
					var color = 'rgb('+_.random(255)+','+ _.random(255)+','+ _.random(255)+')';
//					card.css({"background-color":color});
					console.log(color);
					console.log(mt);
					TweenMax.set(card,{alpha:0});
//					tl.fromTo(card,0.7,{alpha:0,scale:0},{alpha:1,scale:1,'zIndex':'10',ease:Back.easeInOut})
//						.to(card,0.7,{'left':bagSize.left,'top':h,onComplete:function(){
//							$(card).appendTo('.g-top');
//						}},"+=0.7")
//						.to(card,1,{'top':dTop,'boxShadow':'none'});
					var mox = ($(".g-cardWrap").size()-1) * -(card.width()/2);//15;
					var moy = 0; //($(".g-cardWrap").size()-1) * 3;
					tl.fromTo(card,0.5,{alpha:0,scale:0},{alpha:1,scale:1,'zIndex':'10',ease:Back.easeInOut})
						.to(card,0.5,{'left':bagSize.left,'top':h,ease:Back.easeOut},"+=0.2")
						.to(card,0.5,{'top':mt,'left':ml,'height':mh,'boxShadow':'none',rotationY:0,x:mox,y:moy,ease:Back.easeInOut},"+=0.1")
						.to(card,2,{alpha:2,rotationY:360,repeat:-1,"margin":0,ease:Back.easeInOut});
//						.to(card,0.5,{'top':mt,'left':ml,'height':mh,'width':mw,'boxShadow':'none',rotationY:-80,x:mox,y:moy,ease:Back.easeInOut});
					boxTop = boxTop+dw;
				}
				if(isBoxCheckResult.isVictory){
					gameModule.refresh();
					//tt.stop();
				}
				sound2.play();

				var _summary  = gameModule.Summary.get();
				console.log(_summary);
				$(".g-score").html(_summary.TotalScore);
				$(".g-correctRate").html(((_summary.TotalCorrectClick/_summary.TotalClickCount)*100).toFixed(1) + "%")
			}
		},".g-block");
	});
</script>
</body>
</html>
/**
 * Created by muyuruhai on 8/10/15.
 */
var zhGameLogic = (function(me){
    var _opt = {
        "page":".page",
        "badgeUrl":'./src/img/badge/'
    };

    //var me = {};
    var totalScore = 0;
    var _userName = "嗨客";
    var _userScore = 0;
    var _userDes = "";
    var _userBadge = "";

    var _lastUserName = null;
    var _lastUserDes = null;
    var _itemPool   = null;//物品池
    var _pickedItemPool = {};//拾取过的物品记录
    //var _itemDialog = new zhItemDialog();
    //绑定设定用户得分方法
    var setUserScore = function(score){
        _userScore = score;
    };
    //绑定,设定用户名方法
    var setUserName = function(usr){
        _userName = usr;
    };
    var setUserDes = function(des){
        _userDes = des;
    };
    var setUserBadge = function(badge){
        _userBadge = badge;
    };
    me.userName = function(){
        return _userName;
    };
    me.userScore = function(){
        return _userScore;
    };
    me.userDes = function(){
        return _userDes;
    };
    me.userBadge = function(){
        return _userBadge;
    };
    //设定上个用户名
    me.setLastUserName = function(lusername){
        _lastUserName = lusername;
    };
    //设定上个用户分数
    me.setLastUserScore = function(luserDes){
        _lastUserDes = luserDes;
    };
    me.setItemPool = function(itemPool){
        _itemPool = itemPool;
    };

    //展示上个玩家页面
    me.showLastUserResult = function(lastUser,lastDes,lastImg){
        var $lastuserpage = $(".pagelastuser");
        var $splashpage =  $(".pagesplash");
        if (!lastUser || !lastDes || !lastImg) {
            $splashpage.fadeIn(1000);
            return false;
        }
        lastUser=decodeURIComponent(lastUser);
        lastDes=decodeURIComponent(lastDes);
        lastImg=_opt.badgeUrl + decodeURIComponent(lastImg);
        var $stamp = $("#lastuserbadge");
        TweenMax.set($stamp,{alpha:0});
        $stamp.css('background-image','url('+lastImg+')');
        $("#lastusername").html(lastUser);
        $("#lastuserdes").html(lastDes);
        $lastuserpage.fadeIn(500,function(){
            TweenMax.fromTo($stamp,2,{alpha:1,scale:3,rotationY:360},{alpha:1,scale:1,rotationY:0,ease:Elastic.easeOut});
        });
    };

    //字嗨splash页面逻辑
    var showSplash = function(){
        $(".pagesplash").click(function(e){
            var $startPage = $(".pagestart");
            var tl = new TimelineMax();
            tl.fromTo($(this),0.5,{},{display:'none'})
                .fromTo($startPage,1,{alpha:0},{alpha:1,display:'block'});
        });
    };

    //游戏开始页面逻辑
    var startGame = function(){
        $(".zh-btnstart").click(function(){
            var $page1 = $(".page1");
            var $pageStart = $(".pagestart");
            var tl = new TimelineMax();
            tl.fromTo($pageStart,0,{},{display:'none'})
                .fromTo($page1,1,{alpha:0,scale:1.3},{alpha:1,scale:1,ease:Strong.easeOut,display:'block'});
        });
    };

    //随机动画
    var animationEffect = function(){
        var e = {};
        var seffect = [
            {alpha:0,x:-1000,y:0},
            {alpha:0,x:1000,y:0},
            {alpha:0,scale:1.3},
            {alpha:0,rotationX:180},
            {alpha:0},
            {alpha:0,rotationY:180}
        ];
        return seffect[Math.floor(Math.random()*seffect.length)];
    };

    //页面跳转
    var switchPage = function($btn){
        var t = $btn;
        var np = $(".page"+ t.attr('data-to')); //next page
        var cp = $('.page'+ t.attr('data-from')); //current page
        var score = t.attr('data-score');
        var tl = new TimelineMax();
        var d = 1; //动画时间

        score = score ? parseInt(score) : 0;
        if(cp.selector==np.selector){
            return;
        }
        totalScore += score;
        setUserScore(totalScore); //设定用户得分
        if (t.attr('data-to') == "end"){
            var summaryText = getSummary(totalScore);
            setSummary(summaryText);
            d = 0;
        }
        tl.fromTo(cp,0,{alpha:1},{alpha:0,ease:Strong.easeOut,display:'none'})
            .fromTo(np,d,animationEffect(),
            {alpha:1,scale:1,x:0,y:0,rotationX:0,rotationY:0,ease:Strong.easeOut,display:'block'});
    };

    //计算总结页和展示
    var getSummary = function(score){
        var des = null;
        var me = {};
        $.each(zhConfig.summaryText.scoreSummary,function(i,v){
            des = (score>= v.from && score<= v.to) ? v.text : null;
            if (des){
                me.name = _userName;
                me.text = v.text;
                me.img = v.stamp;
                me.score = score;
                return false;
            }
        });
        return me;
    };

    //设定结局页面
    var setSummary = function(s){
        $('#zh-summaryPage-title').html("本轮逃离深山故事，对你测脸结果为：");
        $('.zh-stamp').attr("src","./src/img/badge/"+s.img);
        $('.zh-totalscore').html(s.score);
        $('.zh-summarytext').html('<span style="font-weight: bolder" ">'+s.name+'</span>' +', '+ s.text);
        setUserDes(s.text);
        setUserBadge(s.img);
    };

    //拾取物品信息处理成物品Object并返回
    var pickItemInfo = function(itemRef,pageIndex){
        pageIndex = pageIndex || null;
        //判定是否拾取过
        if(!_itemPool){
            console.log("物品没有初始化");
            return false;
        }
        var _itemObj = _itemPool[itemRef];
        if (!_itemObj) {return false;}
        //如果拾取过，只展示，去除button按钮
        if (_pickedItemPool[itemRef]) {
            if (_itemObj.buttons){
                _itemObj.buttons = null;
            }
            return _itemObj;
        }
        _pickedItemPool[itemRef] = true;//记录拾取过的物品
        if (pageIndex && _itemObj.buttons) {
            _itemObj.buttons.from = pageIndex;
        }
        return _itemObj;
    };

    //以前zidialog的位置

    //页面跳转
    me.goPage = function(pageIndex,animation){
        var $pages = $(_opt.page);
        var $goPage = $(_opt.page+pageIndex);
        $pages.hide();
        $goPage.show();
    };

    //重玩
    me.restart = function(){
        totalScore = 0;
        setUserScore(-1000);
        $(".page").hide();
        $(".pagesplash").fadeIn(500);
        $(".zh-showoptbtn").show();
        $(".zh-btnblock").hide();
    };

    //剧情页面切换调度
    var bind_jumpAction = function(){
        $(".container").on({
            click:function(e){
                switchPage($(this));
            }
        },".zh-sbtn");
    };

    //显示跳转按钮
    var binding_showAction = function(){
        $(document).on({
            click:function(e){
                var ob = $(this).parent().siblings(".zh-btnblock");
                var _btn = ob.find(".zh-sbtn");
                var tl = new TimelineMax();
                var tl1 = new TimelineMax();
                $(this).hide();
                ob.show();
                tl.fromTo(ob,0.5,{alpha:0,y:400},{alpha:1,y:0},-0.5);
                tl1.staggerFromTo(_btn,1.5,{alpha:0,y:-100},{alpha:1,rotationX:0,y:0,x:0,ease:Back.easeOut},0.2);
            }
        },'.zh-showoptbtn');
    };

    //取得用户名
    var binding_getUserName = function(){
        var $nameTxt = $("#zh-name");
        var _u = "";
        $nameTxt.focus(function(){
            $(this).val('');
        });
        $nameTxt.focusout(function(){
            _u = $.trim($(this).val().length) > 0 ? $.trim($(this).val()) : "嗨客" ;
            $(this).val(_u);
            setUserName(_u);
        });
    };

    //拾取宝物触发
    var binding_itemOnClick = function(){
        $(document).on({
            click:function(e){
                var _currentPage = $(this).parents('.page').attr('data-page');//取得当前页面
                var _itemInfo = pickItemInfo($(this).text(),_currentPage);//取得物品信息
                me.zhItemDialog.open(_itemInfo);
                $(this).css({
                    'background-color':'transparent'
                    ,'color':'orangered'
                });
            }
        },'.zh-story-text a');
    };
    //关闭模板层
    var binding_pl_closeModal = function(){
        $("[data-modal=close]").click(function(){
            console.log(me);
            me.zhItemDialog.close();
            //switchPage($(this));
        });
    };

    //绑定所有UI操作
    var bindingUifunctions = function(){
        bind_jumpAction();
        binding_getUserName();
        binding_showAction();
        binding_itemOnClick();
        binding_pl_closeModal();
    };
    //初始化
    me.setOption = function(options){
        _opt = options || {
            "page":".page",
            "badgeUrl":'./src/img/badge/'
        };
    };
    me.init = function(options){
        me.setOption(options);
        startGame();
        showSplash();
        bindingUifunctions();
    };
    return me;
}(zhGameLogic || {}));

//物品对话框模块

zhGameLogic.zhItemDialog = (function(){
    var me =  {};
    var  _$modalMask    = $('.zh-overlay-mask')
        ,_$modal    = $('#zh-modal')
        ,_$modalAfter    = $("#zh-modal:after")
        ,_$itemName = $('.zh-m-name')
        ,_$itemImg  = $('.zh-m-img')
        ,_$itemDes  = $('.zh-m-des')
        ,_$itemBtn  = $('.zh-m-btn')
        ,_$noty     = $('#zh-modal-noty')//获取物品提示层
        ,_$notyMsg  = $('.zh-noty-content')
        ,_itemType = {
            display :'display',
            option  : 'option'
        };

    //添加按钮
    var addButton = function(_itemObj){
        var _item = _itemObj;
        if (!_itemObj){
            return false
        }
        var _$itemBtn = $($('.zh-sbtn').get(0)).clone();
        _$itemBtn.attr('data-from',_item.buttons.from);
        _$itemBtn.attr('data-to',_item.buttons.to);
        _$itemBtn.attr('data-score',_item.buttons.score);
        _$itemBtn.text(_item.buttons.txt);
        _$itemBtn.hide();
        $('.page'+_item.buttons.from).find('.zh-btnblock').find('.zh-sbtn').first().before(_$itemBtn);
        _$itemBtn.fadeIn(1000);
    };

    //获得奖励的信息
    var showNoty = function(notyMsg){
        var _html = '';
        $.each(notyMsg,function(i,v){
            _html += "<p>"+v+"</p>";
        });
        _$notyMsg.html(_html);
        _$noty.show();
    };
    var closeNoty = function(){
        _$noty.hide();
    };
    var setNotyLayout = function(itemType){
        switch (itemType){
            case _itemType.display:
                _$itemName.css({'color':'azure'});
                break;
            case _itemType.option:
                _$itemName.css({'color':'tomato'});
                break;
            default :
        }
    };
    //打开对话框
    me.open  = function(_itemObj){
        var _item = _itemObj;
        var _notyMsg = [];
        closeNoty();
        if(!_itemObj){
            return;
        }
        setNotyLayout(_item.itemType);

        if (!_item.itemName) {
            return false
        }
        _$itemName.html(_item.itemName);
        _$itemDes.html(_item.itemDes);
        if (_item.buttons){
            _$itemBtn.attr('data-from',_item.buttons.from);
            _$itemBtn.attr('data-to',_item.buttons.to);
            _$itemBtn.attr('data-score',_item.buttons.score);
            _$itemBtn.text(_$itemBtn.attr('data-txt'));
            _notyMsg.push("获得: [<span>"+_item.buttons.txt+"</span>] 剧情选项");
            addButton(_item);//添加按钮到下部跳转区
            showNoty(_notyMsg);//处理消息层
        }else{
            _$itemBtn.removeAttr('data-from');
            _$itemBtn.removeAttr('data-to');
            _$itemBtn.removeAttr('data-score');
            _$itemBtn.text(_$itemBtn.attr('data-txt'));
        }
        if (_item.img) { }//设定图片 暂时没用
        _$modalMask.fadeIn(200);
    };
    //关闭对话框
    me.close = function(callback){
        var _callback = callback || false;
        _$modalMask.fadeOut(200,_callback);
    };
    return me;
}());
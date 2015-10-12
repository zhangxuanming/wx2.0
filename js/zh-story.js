/**
 * Created by muyuruhai on 8/10/15.
 */

//加载剧情
var zhLoadStory = (function(){
    var me = {};
    var storyObject = {};
    var _allItemsList = [];
    var _config = null;

    var _logicModal = null;
    var tpl = $('#pageTpl').html();

    var randerPage = function(data){
        return juicer(tpl,data);
    };

    //加载剧情，加载游戏模式
    function ajaxLoadStory(){
        var  _storyTpl = {}
            ,_itemPoolTpl = {}
            ,_storyObj = {}
            ,_itemPoolObj = {}
            ,_summaryTpl = {};
        $.get(_config.storyTpl,function(data){
            if(!data){
                alert('剧情加载错误。。。:(');
                return false
            }
            var t = $(data);
            _storyTpl   = t.filter("#stories").find("section");
            _itemPoolTpl  =t.filter("#itemlist").find("section");
//				_summaryTpl = t.filter("#summary");//暂时没用

            //分离剧情
            _storyObj = templateToObject(_storyTpl);
            renderStoryPage(_storyObj);

            //提取物品池模板返回Ojbect
            _itemPoolObj = templateToItemPoolObject(_itemPoolTpl);
            //载入游戏逻辑modal

            _logicModal.setItemPool(_itemPoolObj);
            _logicModal.init();
        });
    }

    //取得剧情数据转化成object
    var templateToObject = function(storiesBlock){
        //template to object
        var _imgFolder = _config.storyName+'/';
        var _itemsInStory = [];
        $.each(storiesBlock,function(i,v){
            var st = {};
            var act = [];//actions
            var d = $(v);
            st.id = d.attr("id");
            st.img = d.find("img") ? _imgFolder + d.find("img").attr("data-img"): null;

            //初始化段落
            var _textLines = d.find('[data-txt=story]').find("p");
            st.txt = {};
            $.each(_textLines,function(i,v){
                //提取item列表
                var __itemInLine = $(v).get(0).children;
                if (__itemInLine.length>0){
                    for (var j = 0, n = __itemInLine.length; j<n; j++){
                        _itemsInStory.push(__itemInLine[j].innerHTML);
                    }
                }
                var a = $(v).html();
                st.txt[i] = $.trim(a);
            });
            //初始化按钮
            if (d.find("button")){
                $.each(d.find("button"),function(i,v){
                    var btn = {};
                    var adom = $(v); //action dom
                    btn.from = st.id;
                    btn.to = adom.attr("data-to");
                    btn.score = adom.attr("data-score");
                    btn.txt = adom.text();
                    act.push(btn);
                })
            }
            st.actions = act;
            storyObject[i] = st;
        });
        _allItemsList = $.unique(_itemsInStory);
        return storyObject;
    };
    //建立物品池
    var templateToItemPoolObject = function(itemPool){
        var _itemObejct = {}
            ,_itemRef   = ''
            ,_itemName  = ''
            ,_itemDes   = ''
            ,_itemImg   = ''
            ,_itemType  = ''
            ,$btn       = ''
            ,_btn       = '';
        $.each(itemPool,function(i,v){
            var $v = $(v);
            _itemRef = $.trim($v.attr('data-ref')); //情节文字索引
            _itemName = $.trim($v.attr('data-name'));
            _itemType = $.trim($v.attr('data-type'));
            _itemDes = $.trim($v.find('p').html());
            $btn = $v.find('button');
            if ($btn.length > 0){
                _btn = {
                    to    : $btn.attr('data-to'),
                    score : $btn.attr('data-score'),
                    txt   : $.trim($btn.html())
                }
            } else{
                _btn = null;
            }
            _itemObejct[_itemRef] = {
                itemRef  : _itemRef,
                itemName : _itemName,
                itemDes  : _itemDes,
                itemImg  : _itemImg,
                itemType : _itemType,
                buttons  : _btn
            };
        });
        return _itemObejct;
    };
    //渲染页面
    var renderStoryPage = function(storyObject){
        //模板装载页面
        var _html = '';
        $.each(storyObject,function(i,v){
            _html += randerPage(v);
        });
        $(".pagestart").after(_html);
    } ;

    me.init = function() {
        ajaxLoadStory();
    };

    me.setLogicModal = function(logicModal){
        _logicModal = logicModal;
    };
    me.setConfig = function(config){
        _config = config;
    };
    return me
}());

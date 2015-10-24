/**
 * Created by muyuruhai on 15/10/15.
 */

var gameModule = (function(my){

    my.init = function(layoutConfig){
        this.Layout.init(layoutConfig);
        this.Logic.init();
    };
    return my;
}(gameModule || {}));

//布局子模块
gameModule.Layout = (function(my){
    var $gArea = $('.g-area')
        ,$gWrap = $('.g-wrap');
    var _layoutConfig = {
        col : 6,
        row : 5,
        margin :3,
        debug:false
    };
    my.getConfig = function(){
        return _layoutConfig;
    };
    var setlayoutConfig  = function(lc){
        lc.debug = lc.debug || false;
        _layoutConfig = lc || _layoutConfig;
    };
    //取得包围框的大小
    var getWrapSize = function(){
        //var _w = $gArea.width();
        var _w = window.screen.width;
        _w = _w - _w % _layoutConfig.col;
        return {
            width  : _w,
            height : _w
        }
    };
    //设定wrap大小
    var setWrapSize = function(w,h){
        $gWrap.width(w);
        $gWrap.height(h);
    };

    //计算每个按键大小返回size Object
    var getSizes = function(){
        var _wrapSize =  getWrapSize();
        var _w = 0
            ,_h = 0;
        _w = Math.floor((_wrapSize.width / _layoutConfig.col) - _layoutConfig.margin);
        _h = _w;
        return {
            wrapWidth : _w * _layoutConfig.col + _layoutConfig.margin*(_layoutConfig.col-1),
            wrapHeight : _h * _layoutConfig.row + _layoutConfig.margin * (_layoutConfig.row+1),
            blockWidth  :_w,
            blockHeight :_h
        }
    };

    //根据size 计算布局确定坐标
    var getBoxPostion = function(sizeObj){
        var _blockSize = sizeObj
            ,_blockQty = _layoutConfig.col * _layoutConfig.row;
        var _poObj = [];
        var offsetX = 0
            ,offsetY = 0;
        var _x = offsetX
            ,_y= offsetY
            ,_n=0;
        for (var j = 0; j<_layoutConfig.row;j++){
            _y = _y + _layoutConfig.margin;
            for (var i = 0;i<_layoutConfig.col;i++){
                _poObj[_n] = {
                    x :_x,y :_y,
                    bx:offsetX,by:offsetY
                };
                if (i!==_layoutConfig.col-1){
                    _x = _x + _layoutConfig.margin;
                }
                _x = _x + _blockSize.blockWidth;
                _n++;
            }
            _x = offsetX;
            _y = _y + _blockSize.blockHeight ;
        }
        return _poObj;
    };

    //根据坐标渲染布局，这里需要接入以后的文字逻辑
    var randerLayout = function(){
        var sizeObj = getSizes();
        var positions = getBoxPostion(sizeObj);
        var gb = "";
        $.each(positions,function(i,v){
            gb += '<button data-boxid="'+i+'" class="g-block zh-yellow" style="width:'+sizeObj.blockWidth+'px;height:'+sizeObj.blockHeight+'px;top:'+v.y+'px;left:'+ v.x+'px">'+i+'</button>';
        });
        setWrapSize(sizeObj.wrapWidth,sizeObj.wrapHeight);
        $gWrap.empty().append(gb);
    };

    //填充数据到box
    var fillData = function(){
        var _data = gameModule.Data.newData();
        _.each(_data,function(v,i){
            var $box = $('[data-boxid="'+v.pos+'"]');
            $box.removeClass("zh-redColor");
            $box.html(v.char);
            if(_layoutConfig.debug && v.mark>0){
                $box.addClass("zh-redColor");
            }
        });
        if(_layoutConfig.debug){
            console.log(_data);
        }
    };
    my.getBoxPosition = function(){
        return getBoxPostion(getSizes());
    };
    my.update = function(layoutConfig){
        layoutConfig = layoutConfig || _layoutConfig;
        setlayoutConfig(layoutConfig);
        randerLayout();
        fillData();
        //gameModule.Logic.updateData();
    };
    my.updateData = function(){
        fillData();
    };
    my.init = function(layoutConfig){
        my.update(layoutConfig);
    };
    return my;
}(gameModule.Layout || {}));


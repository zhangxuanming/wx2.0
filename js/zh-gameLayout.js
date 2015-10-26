/**
 * 主模块
 */
var gameModule = (function(my){
    var _layoutConfig = {
        col : 6,
        row : 5,
        margin :3,
        debug:false
    };
    var _data = {};
    var startGame = function(layoutConfig){
        _data = gameModule.Data.getNewData();
        gameModule.Layout.init(layoutConfig,_data);
        gameModule.Logic.init(_data);
    };
    var nextQuest = function(layoutConfig){
        _data = gameModule.Data.getNewData();
        gameModule.Layout.init(layoutConfig,_data);
        gameModule.Logic.init(_data);
    };

    //暴露方法
    my.getCurrentData = function(){
        return _data;
    };
    my.getConfig = function(){
        return _layoutConfig;
    };
    my.refresh = function(){
        nextQuest(_layoutConfig);
    };
    my.init = function(layoutConfig){
        _layoutConfig = layoutConfig ? layoutConfig : _layoutConfig;
        startGame(layoutConfig);
    };
    return my;
}(gameModule || {}));

/*
 * 布局子模块
 */
gameModule.Layout = (function(my){
    var $gArea = $('.g-area')
        ,$gWrap = $('.g-wrap');
    var _SIZEOBJECT = {};
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
    var getScreenSize = function(){
        return {
            width:window.screen.width,
            height:window.screen.height
        }
    };
    //取得包围框的大小
    var getWrapSize = function(){
        var _w = getScreenSize().width;
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
        _SIZEOBJECT =  {
            wrapWidth : _w * _layoutConfig.col + _layoutConfig.margin*(_layoutConfig.col-1),
            wrapHeight : _h * _layoutConfig.row + _layoutConfig.margin * (_layoutConfig.row+1),
            blockWidth  :_w,
            blockHeight :_h
        };
        return _SIZEOBJECT;
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
    var _fillData = function(_data){
        //var _data = gameModule.Data.newData();
        _.each(_data.data,function(v,i){
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

    //暴露方法
    //my.getBoxPosition = function(){
    //    return getBoxPostion(getSizes());
    //};
    //取得SizeObject
    my.getSizeObject = function(){
        return _SIZEOBJECT;
    };
    my.randerLayout = function(layoutConfig){
        layoutConfig = layoutConfig || _layoutConfig;
        setlayoutConfig(layoutConfig);
        randerLayout();
    };
    my.loadData = function(dataObject){
        _fillData(dataObject);
    };
    my.init = function(layoutConfig,dataObject){
        my.randerLayout(layoutConfig);
        if(!dataObject){
            alert("data incorrect");
            return
        }
        _fillData(dataObject);
    };
    return my;
}(gameModule.Layout || {}));

/*
 * 内容模块
 */
gameModule.Data = (function(my){
    var _zhDicPool = '平易近人啊宽宏大度 冰清玉洁 持之以恒 锲而不舍 废寝忘食 临危不俱 光明磊落 不屈不挠 鞠躬尽瘁 死而后已 料事如神 足智多谋 融会贯通 学贯中西 博古通今 才华横溢 博大精深 集思广益 举一反三 憨态可掬 文质彬彬 风度翩翩 相貌堂堂 落落大方 斗志昂扬 大义凛然 出类拔萃 意气风发 威风凛凛 容光焕发 神采奕奕 悠然自得 眉飞色舞 喜笑颜开 神采奕奕 欣喜若狂 呆若木鸡 垂头丧气 无动于衷 勃然大怒 能说会道 巧舌如簧 能言善辩 滔滔不绝 伶牙俐齿 出口成章 娓娓而谈 妙语连珠 口若悬河 三顾茅庐 铁杵成针 望梅止渴 完璧归赵 四面楚歌 负荆请罪 手不释卷 悬梁刺股 凿壁偷光 走马观花 欢呼雀跃 扶老携幼 手舞足蹈 促膝谈心 前俯后仰 跋山涉水 前赴后继 张牙舞爪 恩重如山 深情厚谊 手足情深 形影不离 血浓于水 志同道合 赤诚相待 肝胆相照 生死相依 循序渐进 日积月累 温故知新 勤能补拙 笨鸟先飞 学无止境 滴水穿石 发奋图强 开卷有益 自相矛盾 滥竽充数 画龙点睛 刻舟求剑 守株待兔 叶公好龙 画蛇添足 掩耳盗铃 买椟还珠 无懈可击 锐不可当 雷厉风行 震耳欲聋 惊心动魄 铺天盖地 气贯长虹 万马奔腾 如履平地 春寒料峭 春意盎然 春暖花开 满园春色 春华秋实 春风化雨 暑气蒸人 烈日炎炎 秋风送爽 秋高气爽 秋色宜人 冰天雪地 寒冬腊月 济济一堂 热火朝天 门庭若市 万人空巷 座无虚席 高朋满座 蒸蒸日上 欣欣向荣 川流不息 美不胜收 蔚为壮观 富丽堂皇 金碧辉煌 玉宇琼楼 美妙绝伦 巧夺天工 锦上添花 粉妆玉砌 别有洞天 喜出望外 语惊四座 精忠报国 奔走相告 风雨同舟 学海无涯 亡羊补牢 势如破竹 骄阳似火 寒气袭人 如火如荼';

    var _wordsCount = 3;//设置取词多少
    var _restWordsCount = 10;
    var _currentData = null;
    var _correctCharsNumber = 0;
    var _chosenWordsInArr
        ,_chosenCharInArr
        ,_unChosenCharsInArr;

    var _dicArray = function(str){
        return _.words(str);
    };

    //预处理字符集
    var _prepareWords = function(n,n1){
        var _wordsArr = _dicArray(_zhDicPool);
        var _sw = _.sample(_wordsArr,n);
        var _swArr = [];
        _.each(_sw,function(v,i){
            _swArr.push(_.chars(v));
        });
        _chosenWordsInArr = _sw;
        _chosenCharInArr = _swArr;
        _unChosenCharsInArr = _.without(_.chars(_.sample(_.difference(_wordsArr,_sw),n*n1)),",");
        return {
            selectedWords : _sw,
            selectedArray : _swArr,
            restChars : _unChosenCharsInArr
        }
    };

    //计算周围的空格取得ID
    var _surroundNumber = function(center,matrix){
        var _ma = matrix;
        var _surrondBoxes = [];
        var mt = [];//设定box坐标
        var arr = [[-1,0],[-1,-1],[0,-1],[1,-1],[1,0],[1,1],[0,1],[-1,1]];
        var _n = 0;
        for(var y = 0; y < _ma.row; y++){
            for(var x = 0; x < _ma.col; x++){
                mt.push({
                    index:_n,x:x,y:y
                });
                _n++;
            }
        }
        _.each(arr,function(v,i){
            _.each(mt,function(v1,i1){
                if((v1.x === mt[center].x+v[0]) && (v1.y == mt[center].y + v[1])){
                    _surrondBoxes.push(v1.index);
                }
            });
        });
        return _surrondBoxes;
    };

    //计算文字布局数据，并给与位置返回
    var _calculateData = function(preparedWords){
        _correctCharsNumber = 0;
        var _layoutMatrix = gameModule.Layout.getConfig();
        var _matrix = {
            col:_layoutMatrix.col,
            row:_layoutMatrix.row,
            totalBox: _layoutMatrix.col * _layoutMatrix.row
        };
        var dataObj = {}
            ,sw = preparedWords.selectedWords
            ,cw = preparedWords.selectedArray
            ,rw = preparedWords.restChars
            ,totalBox = _matrix.totalBox
            ,usedBoxes = []
            ,emptyBoxes = _.range(totalBox);

        //初始化所有box数据
        for (var i = 0; i <_matrix.totalBox ;i++){
            dataObj[i] = {
                pos:i,
                ref:-1,
                reflen:-1,
                index:-1,
                from:-1,
                to:-1,
                char: _.sample(rw,1)[0],
                mark:-1,
                full:-1
            };
        }
        //计算空位
        for (var _i = 0; _i<preparedWords.selectedArray.length; _i++){
            var _pos = _.sample(_.difference(emptyBoxes,usedBoxes),1)[0];
            var _prebox = -1;
            var _temp = {};
            for(var _j = 0,_l = cw[_i].length;_j<_l;_j++){
                var freeBox = _surroundNumber(_pos,_matrix);
                usedBoxes.push(_pos);
                var _nextBox = _.sample(_.difference(freeBox,usedBoxes),1)[0];
                //如果下层没地方，整段重排
                if(!_nextBox && _j !== _l-1){
                    _i = _i-1;
                    usedBoxes = _.without(usedBoxes,_pos);
                    _temp = {};
                    break;
                }
                if(_j == _l-1){
                    _nextBox = _pos;
                }
                if(_j == 0){
                    _prebox = _pos;
                }
                _temp[_pos]={
                    index:_j,
                    pos:_pos,
                    len:_l,
                    char:cw[_i][_j],
                    from:_prebox,
                    to:_nextBox,
                    mark:1,
                    full:sw[_i]
                };
                _prebox = _pos;
                _pos = _nextBox;
            }
            //替换掉box的数据并替换reference
            if(_temp){
                _.each(_temp,function(v,i){
                    dataObj[v.pos].index = v.index;
                    dataObj[v.pos].ref = _i;
                    dataObj[v.pos].reflen = v.len;
                    dataObj[v.pos].char = v.char;
                    dataObj[v.pos].from = v.from;
                    dataObj[v.pos].to = v.to;
                    dataObj[v.pos].mark = v.mark;
                    dataObj[v.pos].full = v.full;
                    _correctCharsNumber+=1;
                });
            }
        }
        console.log(_correctCharsNumber);
        return dataObj;
    };
    var _setData = function(){
        //_currentData = _calculateData(_prepareWords(_wordsCount,_restWordsCount));
        _currentData = {
            data:_calculateData(_prepareWords(_wordsCount,_restWordsCount)),
            totalChosenCharCount:_correctCharsNumber,
            chosenWordsInArr:_chosenWordsInArr,
            chosenCharsInArr:_chosenCharInArr,
            unChosenCharsInArr:_unChosenCharsInArr,
            totalChosenWordsCount:_chosenWordsInArr.length
        };
        return _currentData;
    };
    my.getCurrentData = function(){
        return _currentData;
    };
    my.setWordsPool = function(wordsPool){
        _zhDicPool = wordsPool
    };
    my.getNewData = function(){
        return _setData();
    };
    my.getCorrectCount = function(){
        return _wordsCount;
    };
    my.getCorrectCharsNumber = function(){
        return _correctCharsNumber;
    };
    return my;
})(gameModule.Data || {});


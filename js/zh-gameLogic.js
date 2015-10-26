/**
 * Created by muyuruhai on 18/10/15.
 */

//内容加载
gameModule.Data = (function(my){
    var _zhDicPool = '平易近人 宽宏大度 冰清玉洁 持之以恒 锲而不舍 废寝忘食 临危不俱 光明磊落 不屈不挠 鞠躬尽瘁 死而后已 料事如神 足智多谋 融会贯通 学贯中西 博古通今 才华横溢 博大精深 集思广益 举一反三 憨态可掬 文质彬彬 风度翩翩 相貌堂堂 落落大方 斗志昂扬 大义凛然 出类拔萃 意气风发 威风凛凛 容光焕发 神采奕奕 悠然自得 眉飞色舞 喜笑颜开 神采奕奕 欣喜若狂 呆若木鸡 垂头丧气 无动于衷 勃然大怒 能说会道 巧舌如簧 能言善辩 滔滔不绝 伶牙俐齿 出口成章 娓娓而谈 妙语连珠 口若悬河 三顾茅庐 铁杵成针 望梅止渴 完璧归赵 四面楚歌 负荆请罪 手不释卷 悬梁刺股 凿壁偷光 走马观花 欢呼雀跃 扶老携幼 手舞足蹈 促膝谈心 前俯后仰 跋山涉水 前赴后继 张牙舞爪 恩重如山 深情厚谊 手足情深 形影不离 血浓于水 志同道合 赤诚相待 肝胆相照 生死相依 循序渐进 日积月累 温故知新 勤能补拙 笨鸟先飞 学无止境 滴水穿石 发奋图强 开卷有益 自相矛盾 滥竽充数 画龙点睛 刻舟求剑 守株待兔 叶公好龙 画蛇添足 掩耳盗铃 买椟还珠 无懈可击 锐不可当 雷厉风行 震耳欲聋 惊心动魄 铺天盖地 气贯长虹 万马奔腾 如履平地 春寒料峭 春意盎然 春暖花开 满园春色 春华秋实 春风化雨 暑气蒸人 烈日炎炎 秋风送爽 秋高气爽 秋色宜人 冰天雪地 寒冬腊月 济济一堂 热火朝天 门庭若市 万人空巷 座无虚席 高朋满座 蒸蒸日上 欣欣向荣 川流不息 美不胜收 蔚为壮观 富丽堂皇 金碧辉煌 玉宇琼楼 美妙绝伦 巧夺天工 锦上添花 粉妆玉砌 别有洞天 喜出望外 语惊四座 精忠报国 奔走相告 风雨同舟 学海无涯 亡羊补牢 势如破竹 骄阳似火 寒气袭人 如火如荼';
    var _wordsCount = 3;//设置取词多少
    var _restWordsCount = 10;
    var _currentData = null;
    var _correctCharsNumber = 0;

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
        return {
            selectedWords : _sw,
            selectedArray : _swArr,
            restChars : _.without(_.chars(_.sample(_.difference(_wordsArr,_sw),n*n1)),",")
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
        _currentData = _calculateData(_prepareWords(_wordsCount,_restWordsCount));
        return _currentData;
    };
    my.getCurrentData = function(){
        return _currentData;
    };
    my.setWordsPool = function(wordsPool){
        _zhDicPool = wordsPool
    };
    my.newData = function(){
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


/*
 *  游戏逻辑模块
 */
gameModule.Logic = (function(){
    var my = {}
        ,_data = null
        //,_doms = {
        //    box:".g-block",
        //    startBtn:".g-start"
        //}
        ,_selectedCss = "g-blockSelected"
        ,_victorCondition = 3;

    //设定数据
    var _loadData = function(){
        console.log("dateLoaded");
        _data = gameModule.Data.getCurrentData();
    };
    var _setVicCondition = function(){
        _victorCondition = gameModule.Data.getCorrectCount();
    };

    //过关判定
    var _checkVictor = function(){
        if(_victorRef.length >= _victorCondition){
            _victorRef = [];
            return true;
        }else{
            return false;
        }
    };

    var _selectedPos = []
        ,_selectedIndex = []
        ,_selectedRef = []
        ,_selectedObj = []
        ,_victorRef = []
        ,_collectedWords = []//收集过的
        ,_collectedWordsArr = {}//收集过的obj
        ,_totalCollected = {}
        ,_lastPos = [];//保留本次check链用于清空css
    var _resetArr = function(){
        _lastPos = _selectedPos; //记录上一次选择的结果
        _selectedPos = [];
        _selectedRef = [];
        _selectedIndex = [];
        _selectedObj = [];
    };
    var _resetAll = function(){
        _resetArr();
        _victorRef = [];
        _collectedWords=[];
        _collectedWordsArr = {};
        _lastPos = [];
    };

    var _restTotalCollected = function(){
        _totalCollected = [];
    };
    var _getCollectionBox = function(){
        return _collectedWordsArr;
    };

    var _checkNewCollection = function(){
        var nc = _.difference(_victorRef,_collectedWords);
        if(nc.length>0){
            _collectedWords.push(nc[0]);
            return nc
        }
        return false;
    };
    var _collectSucceedWord = function(boxObj){
        _victorRef.push(boxObj.ref);
        _collectedWordsArr[boxObj.ref] = _selectedObj;
        _totalCollected.push(boxObj.full);//总计收集的多少，游戏刷新时候不清楚，restart时候清除
        _lastPos = [];
        _setWordsCount();
    };
    var checkLogic = {
        _checkBox : function(boxObj){
            if(!boxObj){
                return false
            }
            var lastPos;
            var lastRef;
            var lastIndex;
            var lastObj;
            if(_selectedPos.length === 0){
                _selectedIndex.push(boxObj.index);
                _selectedPos.push(boxObj.pos);
                _selectedRef.push(boxObj.ref);
                _selectedObj.push(boxObj);
                return true;
            }
            lastObj = _.last(_selectedObj);
            if(lastObj.index<0){
                _resetArr();
                return false;
            }
            if (boxObj.from >=0 && boxObj.pos == lastObj.to){
                if(boxObj.index != _selectedObj.length){
                    _resetArr();
                    return false
                }
                _selectedIndex.push(boxObj.index);
                _selectedPos.push(boxObj.pos);
                _selectedRef.push(boxObj.ref);
                _selectedObj.push(boxObj);
                if(boxObj.pos == boxObj.to){
                    //_victorRef.push(boxObj.ref);
                    //_collectedWordsArr[boxObj.ref] = _selectedObj;
                    //_totalCollected.push(boxObj.full);//总计收集的多少，游戏刷新时候不清楚，restart时候清除
                    //_lastPos = [];
                    _collectSucceedWord(boxObj);
                    _resetArr();
                }
                return true;
            }else{
                _resetArr();
                return false;
            }
        },
        _checkBox1 : function(boxObj){
            if(!boxObj){
                return false;
            }
            var lastObj;
            lastObj = _.last(_selectedObj);
            _selectedIndex.push(boxObj.index);
            _selectedPos.push(boxObj.pos);
            _selectedRef.push(boxObj.ref);
            _selectedObj.push(boxObj);
            if(boxObj.ref<0 || (_selectedPos.length === 1 && boxObj.index!==0)){
                _resetArr();
                return false;
            }
            if(_selectedPos.length === 1 && boxObj.ref>=0 ){
                return true;
            }
            if(lastObj.index<0){
                _resetArr();
                return false;
            }
            if (boxObj.from >=0 && boxObj.pos == lastObj.to){
                if(boxObj.index != _selectedObj.length-1){
                    _resetArr();
                    return false
                }
                if(boxObj.pos == boxObj.to){
                    //_victorRef.push(boxObj.ref);
                    //_collectedWordsArr[boxObj.ref] = _selectedObj;
                    //_totalCollected.push(boxObj.full);//总计收集的多少，游戏刷新时候不清楚，restart时候清除
                    //_lastPos = [];
                    _collectSucceedWord(boxObj);
                    _resetArr();
                }
                return true;
            }else{
                _resetArr();
                return false;
            }
        }
    };

    var _clearClass = function(){
        _.each(_lastPos,function(v,i){
            $('[data-boxid="'+v+'"]').removeClass(_selectedCss);
        });
    };

    var getLastSuccessWordsRef = function(){
        return _.last(_victorRef);
    };

    var _correctCount = 0
        ,_wrongCount = 0
        ,_isPerfect = false
        ,_totalScore = 0
        ,_continueCount = 0;
    var _clearCorrectCount = function(){
        _correctCount = 0;
        _wrongCount = 0;
        _isPerfect = false;
    };
    //选择正确或者错误计数器
    var _setWordsCount = function(){
        _continueCount += 1;
        if(_continueCount!=1){
            _totalScore+=1000*(1+_continueCount/10);
        }else{
            _totalScore+=1000;
        }
    };
    var _setCharCount = function(check){
        if(check){
            _correctCount+=1;
            _totalScore += 100 *Math.pow(Math.E,(_correctCount/100 - 0.01));
            if(_correctCount == gameModule.Data.getCorrectCharsNumber()){
                _isPerfect = true;
                _totalScore+=5000;
            }
        }else{
            _correctCount = 0;
            _wrongCount+=1;
            _isPerfect = false;
        }
        console.log(_correctCount);
    };
    var _returnCount = function(){
        return {
            correct:_correctCount,
            wrong:_wrongCount
        }
    };
    //选择触发函数
    var _boxAction = function($box,callback){
        var _callBack = callback || {};
        var bid = $box.attr("data-boxid")
            ,boxObj = _data[bid]
            ,isBox = false
            ,isNewCollected = false
            ,isV = false;
        if(_.indexOf(_victorRef,boxObj.ref)>=0){
            return
        }
        isBox = checkLogic._checkBox1(boxObj);
        //正确或者不正确判定
        if(isBox){
            $box.addClass(_selectedCss);
        }else{
            _clearClass();
        }
        //记录选择器
        _setCharCount(isBox);
        //判定回调
        callback['stepfunc'](isBox);
        //收集回调
        isNewCollected = _checkNewCollection();
        if(!!isNewCollected){
            if(typeof(callback['collected']) == 'function'){
                callback['collected'](_collectedWordsArr[isNewCollected[0]]);
            }
        }
        console.log(_totalScore);
        //本局胜利判定
        isV = _checkVictor();
        if(isV){
            if(callback['victorfunc']){
                callback['victorfunc'](_collectedWordsArr);
            }
        }
    };

    //重玩
    var _restart = function(layoutConfig){
        gameModule.Layout.init(layoutConfig);
        _resetAll();
        _loadData();
        _setVicCondition();
        _clearCorrectCount();
        _totalCollected = [];//与refresh的区别
    };

    var _refreshMatrix = function(){
        gameModule.Layout.init();
        _resetAll();
        _loadData();
        _setVicCondition();
        _clearCorrectCount();
    };

    my.getCollectedBox = function(){
        return _collectedWordsArr;
    };
    my.getTotalCollectedBox = function(){
        return _totalCollected;
    };
    //传出box控制方法
    my.callBoxAction = function($box,callback){
        _boxAction($box,callback);
    };
    my.refresh = function(){
      _refreshMatrix();
    };
    my.init = function(layoutConfig){
        _restart(layoutConfig);
    };
    return my;
}());


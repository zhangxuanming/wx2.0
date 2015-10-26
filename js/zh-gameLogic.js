/**
 * Created by muyuruhai on 18/10/15.
 */
/*
 *  游戏逻辑模块
 */
gameModule.Logic = (function(){
    var my = {}
        ,_data = null
        ,_selectedCss = "g-blockSelected"
        ,_victorCondition = 3;

    //设定数据
    var _loadData = function(data){
        _data = data;
        console.log("dateLoaded");
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

    var _restart1 = function(){
        _resetAll();
        //_loadData();
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
    my.init = function(data){
        //_restart(layoutConfig);
        _loadData(data);
        _restart1();
    };
    return my;
}());


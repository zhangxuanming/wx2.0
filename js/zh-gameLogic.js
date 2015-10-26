/**
 * Created by muyuruhai on 18/10/15.
 */
/*
 *  游戏逻辑模块
 */
gameModule.Logic = (function(){
    const BONUSSCORE = 5000;
    var my = {}
        ,_dataObject = null
        ,_data = null
        ,_selectedCss = "g-blockSelected"
        ,_victorCondition = 3
        ,_totalChosenCharsCount = 12;

    //设定数据
    var _loadData = function(data){
        _dataObject = data;
        _data = data.data;
        _victorCondition = data.totalChosenWordsCount;
        _totalChosenCharsCount = data.totalChosenCharCount;
        console.log("dateLoaded");
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

    //主逻辑需求函数定义
    var _selectedPos = []
        ,_selectedIndex = []
        ,_selectedRef = []
        ,_selectedObj = []
        ,_victorRef = []
        ,_collectedWords = []//收集过的
        ,_collectedWordsArr = {}//收集过的obj
        ,_totalCollected = {} //总共收集的
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

    //主判定逻辑
    var checkLogic = {
        //选择第二个文字时判定
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
        //即时判定
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

    var getLastSuccessWordsRef = function(){
        return _.last(_victorRef);
    };

    //计数器定义
    var _correctCount = 0
        ,_wrongCount = 0
        ,_isPerfect = false
        ,_totalScore = 0
        ,_continueCount = 0;

    //重置计数器
    var _clearCorrectCount = function(){
        _correctCount = 0;
        _wrongCount = 0;
        _isPerfect = false;
    };

    //选择正确或者错误计数器
    var _setWordsCount = function(){
        _continueCount += 1;
        if(_continueCount != 1){
            _totalScore += 1000 * (1+_continueCount/10);
        }else{
            _totalScore+=1000;
        }
    };
    //选择连续正确字数的计数器
    var _setCharCount = function(check){
        if(check){
            _correctCount += 1;
            _totalScore += 100 * Math.pow(Math.E,(_correctCount/100 - 0.01));
            //连续通关奖金
            if(_correctCount == _totalChosenCharsCount){
                _isPerfect = true;
                _totalScore += BONUSSCORE;
            }
        }else{
            _correctCount = 0;
            _wrongCount += 1;
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

    //每次选择触发函数,选择，收集，胜利
    var _boxAction = function(bid,callback){
        var _callBack = callback || {};
        //var bid = $box.attr("data-boxid");
        var boxObj = _data[bid]
            ,isBox = false
            ,isBoxObject = {}
            ,isNewCollected = false
            ,isV = false;
        if(_.indexOf(_victorRef,boxObj.ref)>=0){
            return
        }

        //正确或者不正确判定
        isBox = checkLogic._checkBox1(boxObj);
        isBoxObject = {
            isBox:isBox,
            positionHistory:_lastPos
        };
        //记录选择器
        _setCharCount(isBox);

        //每次操作执行回调
        callback['stepfunc'](isBoxObject);

        //收集回调,查看是不是刚刚收集的
        isNewCollected = _checkNewCollection();
        if(!!isNewCollected){
            if(typeof(callback['collected']) == 'function'){
                callback['collected'](_collectedWordsArr[isNewCollected[0]]);
            }
        }

        //本局胜利判定
        isV = _checkVictor();
        if(isV){
            if(callback['victorfunc']){
                callback['victorfunc'](_collectedWordsArr);
            }
        }
    };

    //每次选择触发函数,选择，收集，胜利
    var _boxAction1 = function(bid){
        var boxObj = _data[bid]
            ,isBox = false
            ,isBoxObject = {}
            ,isNewCollected = false
            ,isV = false;
        if(_.indexOf(_victorRef,boxObj.ref)>=0){
            return
        }

        //正确或者不正确判定
        isBox = checkLogic._checkBox1(boxObj);
        isBoxObject = {
            isBox:isBox,
            positionHistory:_lastPos
        };
        //记录选择器
        _setCharCount(isBox);

        //收集回调,查看是不是刚刚收集的
        isNewCollected = _checkNewCollection();
        if(!!isNewCollected){
            isBoxObject.isNewCollected = _collectedWordsArr[isNewCollected[0]];
        }else{
            isBoxObject.isNewCollected = false;
        }

        //本局胜利判定
        isV = _checkVictor();
        if(isV){
            isBoxObject.isVictory = true;
            isBoxObject.totalCollectedWords = _collectedWordsArr;
        }else{
            isBoxObject.isVictory = false;
            isBoxObject.totalCollectedWords = _collectedWordsArr;
        }
        return isBoxObject;
    };

    //重玩
    var _restart = function(layoutConfig){
        gameModule.Layout.init(layoutConfig);
        _resetAll();
        //_loadData();
        _clearCorrectCount();
        _totalCollected = [];//与refresh的区别
    };

    var _restart1 = function(){
        _resetAll();
        //_loadData();
        //_setVicCondition();
        _clearCorrectCount();
        _totalCollected = [];//与refresh的区别
    };

    var _refreshMatrix = function(){
        gameModule.Layout.init();
        _resetAll();
        _loadData();
        //_setVicCondition();
        _clearCorrectCount();
    };

    my.getCollectedBox = function(){
        return _collectedWordsArr;
    };
    my.getTotalCollectedBox = function(){
        return _totalCollected;
    };
    //传出box控制方法
    my.callBoxAction = function(boxId,callback){
        _boxAction(boxId,callback);
    };
    my.test = function(boxId){
        return _boxAction1(boxId);
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


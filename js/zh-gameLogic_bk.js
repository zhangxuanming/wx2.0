/**
 * Created by muyuruhai on 18/10/15.
 */
/*
 *  游戏逻辑模块
 */
gameModule.Logic = (function(){
    const BONUSSCORE = 5000;
    var my = {};

    //初始化使用的
    var _dataObject = null
        ,_data = null
        ,_victorCondition = 3
        ,_totalChosenCharsCount = 12
        ,_level = 1; //正确单词数量

    //判定逻辑中需要用的每次选择时的信息
    var _selectedPos = []       //每次选择的索引坐标计入数组
        ,_selectedObj = []      //每次选择的Object记入数组
        ,_victorRef = []        //计数器数组，选对组词，则把相关ref推入数组
        ,_totalCollected = {}   //总共收集的
        ,_lastPos = [];         //保留本次check链用于清空css，记录以前每次的选择结果


    //记录游戏开始到结束总共的信息
    var _totalGameClickCount = 0 //记录一共选择多少次
        ,_totalRoundClickCountArray = []
        ,_eachRoundClickCount = 0
        ,_eachRoundTime = 0; //每局游戏时间

    var _continueSucceedWordsCount      //正确选对的次数
        ,_continueSucceedCharCount = 0  //记录连续选对的整个单词的次数
        ,_wrongCount = 0                //错误选对的次数
        ,_totalScore = 0                //总分
        ,_isPerfect = false             //完美标记 - 应该没用
        ,_collectedWords = []           //收集过的
        ,_collectedWordsArr = {};       //收集过的obj

    //初始化设定数据
    var _loadData = function(data){
        _dataObject = data; //装载数据
        _data = data.data;  //装载数据单词信息
        _victorCondition = data.totalChosenWordsCount;      //胜利判定词组数量
        _totalChosenCharsCount = data.totalChosenCharCount; //一共多少个正确的字
        console.log("dateLoaded");
    };

    //过关判定，词组数量相等则过关
    var _checkVictor = function(){
        if(_victorRef.length >= _victorCondition){
            _level += 1; //每局胜利 +1 计数
            _totalRoundClickCountArray.push(_eachRoundClickCount); //记录每局结束选择步数
            _victorRef = [];
            _eachRoundClickCount = 0; //每局清零
            return true;
        }else{
            return false;
        }
    };

    //从上一次正确选择到选择错误之间的选择序列
    var cachePositionHistory = function(){
        _lastPos = _selectedPos;
    };
    //重置
    var _resetArr = function(){
        cachePositionHistory(); //记录上一次选择的结果
        _selectedPos = [];
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
        _totalCollected.push(boxObj.full);//总计收集的多少，游戏刷新时候不清，restart时候清除
        _lastPos = [];
        _setWordsCount();
    };

    var levelUpdate = function(level){
        _level++;
    };
    //主判定逻辑
    var checkLogic = {
        //选择第二个文字时判定
        _checkBox : function(boxObj){
            if(!boxObj){
                return false
            }
            var lastObj;
            if(_selectedPos.length === 0){
                _selectedPos.push(boxObj.pos);
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
                _selectedPos.push(boxObj.pos);
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
            lastObj = _.last(_selectedObj); //上一次选择的结果数组
            _selectedPos.push(boxObj.pos);
            _selectedObj.push(boxObj);//记录本次选择的结果到数组
            //ref是-1，说明不是待选词 -> false
            //首次点击，但是index不是0，说明不是词语开头->false
            if(boxObj.ref<0 || (_selectedPos.length === 1 && boxObj.index !== 0)){
                _resetArr();
                return false;
            }
            //首次选择，是待选词 -> true
            if(_selectedPos.length === 1 && boxObj.ref >= 0 && boxObj.index == 0){
                return true;
            }

            //上次选择结果为空，错误
            if(lastObj.ref<0){
                _resetArr();
                return false;
            }

            //当前选择有from，当前选择位置等于上个字指向位置，说明是最后一个字
            if (boxObj.from >= 0 && boxObj.pos == lastObj.to){
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

    //重置计数器
    var _clearCorrectCount = function(){
        _continueSucceedWordsCount = 0;
        _wrongCount = 0;
        _isPerfect = false;
    };

    //选择正确或者错误计数器
    var _setWordsCount = function(){
        _continueSucceedCharCount += 1;
        if(_continueSucceedCharCount != 1){
            _totalScore += 1000 * (1+_continueSucceedCharCount/10);
        }else{
            _totalScore+=1000;
        }
    };

    //每次点击信息记录器
    var _setCounterOnClick = function(isBoxCheck){
        if(isBoxCheck){
            _continueSucceedWordsCount += 1; //本次选对，计数器+1
        }else{
            _continueSucceedWordsCount = 0;
        }
        _eachRoundClickCount += 1;
        _totalGameClickCount += 1; //每次点击记录一下，最后得出总点击数
    };
    //选择连续正确字数的计数器
    var _setScoreOnClick = function(check){
        if(check){
            _totalScore += 100 * Math.pow(Math.E,(_continueSucceedWordsCount/100 - 0.01)); //分数累加
            //连续所有单词都正确通关奖金5000
            if(_continueSucceedWordsCount == _totalChosenCharsCount){
                _isPerfect = true;
                _totalScore += BONUSSCORE;
            }
        }else{
            //错误计数器清零
            _wrongCount += 1;
            _isPerfect = false;
        }
    };

    var _returnCount = function(){
        return {
            correct:_continueSucceedWordsCount,
            wrong:_wrongCount
        }
    };

    //每次选择触发函数,选择，收集，胜利（暂时废弃）
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
        _setScoreOnClick(isBox);

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

    //每次选择触发循环 函数,选择，收集，胜利
    var _boxCheck = function(bid){
        var boxObj = _data[bid]
            ,isBox
            ,isBoxObject
            ,isNewCollected
            ,isV;

        var _currentBox
            ,_posHistory
            ,_isNewCollected
            ,_totalCollectedWords
            ,_totalCollectedChars
            ,_isVictory;

        if(_.indexOf(_victorRef,boxObj.ref)>=0){
            console.log("系统错误啦");
            return
        }

        _currentBox = _data[bid];
        _posHistory = _lastPos;

        //正确或者不正确判定
        isBox = checkLogic._checkBox1(boxObj);
        _setCounterOnClick(isBox);//计数器设定

        //收集回调,查看是不是刚刚收集的
        isNewCollected = _checkNewCollection();
        if(!!isNewCollected){
            _isNewCollected = _collectedWordsArr[isNewCollected[0]];
        }else{
            _isNewCollected = false;
        }
        //本局胜利判定
        isV = _checkVictor();
        if(isV){
            _isVictory = true;
            _totalCollectedWords = _collectedWordsArr;
        }else{
            _isVictory = false;
            _totalCollectedWords = _collectedWordsArr;
        }

        //设定每次选择积分记录
        _setScoreOnClick(isBox);
        isBoxObject = {
            currentBox:_currentBox,
            isBox:isBox,
            positionHistory:_posHistory,
            isNewCollected:_isNewCollected,
            isVictory:_isVictory,
            totalCollectedWords:_totalCollectedWords
        };
        return isBoxObject;
    };

    var _restartRound = function(){
        _resetAll();
        _clearCorrectCount();
        _totalCollected = [];//与refresh的区别
    };


    //每次点击文字调用判定，传入id，返回判定结果数组
    my.checkBoxOnClick = function(boxId){
        return _boxCheck(boxId);
    };
    my.getTotalScore = function(){
        return _totalScore;
    };
    my.init = function(data){
        //_restart(layoutConfig);
        _loadData(data); //加载数据
        _restartRound();
    };
    my.gameOver = function(){
        //重置所有计数器
        //返回游戏Summary
        return "gameOver 啦!";
    };
    my.getGameSummary = function(){
        //去的游戏总结
    };
    return my;
}());


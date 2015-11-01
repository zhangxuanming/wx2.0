/**
 * Created by muyuruhai on 18/10/15.
 */
/*
 *  游戏逻辑模块
 *  每次刷新游戏，每一局
 */
gameModule.Logic = (function(){
    const BONUSSCORE = 5000;
    var my = {};

    //初始化使用的
    var _dataObject = null
        ,_data = null
        ,_victorCondition = 3
        ,_totalChosenCharsCount = 12; //正确单词数量

    //贯穿游戏始终的计数器,整局结束后重置
    var _gameContinueCorrectClickCount = 0      //正确选对的次数
        ,_gameContinueCollectWordsCount = 0  //记录连续选对的整个单词的次数
        ,_totalScore = 0;                //总分


    //判定逻辑中需要用的每次选择时的信息,每局的持续信息
    var _selectedHistoryPositionList = []      //每次选择的索引坐标计入数组
        ,_selectedHistoryObjectList = []      //每次选择的Object记入数组
        ,_victorRef = []                    //计数器数组，选对组词，则把相关ref推入数组
        ,_positionHisotryList = []
        ,_objectHistoryList = [];         //保留本次check链用于清空css，记录以前每次的选择结果

    //每局收集的词语
    var _roundCollectedWordsRefList = []           //已经收集过的词Ref
        ,_roundCollectedWordsObjList = {};       //收集过的obj

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
            _victorRef = [];
            return true;
        }else{
            return false;
        }
    };

    //从上一次正确选择到选择错误之间的选择序列
    var _cachePositionHistory = function(){
        _positionHisotryList = _selectedHistoryPositionList;
        _objectHistoryList = _selectedHistoryObjectList;
    };
    //清除cache的选择记录
    var _clearPositionHistoryCache = function(){
        _positionHisotryList = [];
        _objectHistoryList = [];
    };
    //重置临时选择链记录
    var _clearTempSelectHistoryList = function(){
        _selectedHistoryPositionList = [];
        _selectedHistoryObjectList = [];
    };
    //清除整个游戏进度
    var _clearGlobalCounter = function(){
        _gameContinueCorrectClickCount = 0;      //正确选对的次数
        _gameContinueCollectWordsCount = 0;  //记录连续选对的整个单词的次数
        _totalScore = 0;
    };
    //清除本局变量
    var _clearAllVariableForRestartRound = function(){
        _victorRef = [];
        _roundCollectedWordsRefList=[];
        _roundCollectedWordsObjList = {};
        _clearTempSelectHistoryList();
        _clearPositionHistoryCache();
    };
    //重置所有游戏变量
    var _clearAllVariableForRestartGame = function(){
        _clearAllVariableForRestartRound();
        _clearGlobalCounter();
    };

    //主判定逻辑
    var checkLogic = {
        //即时判定
        _checkBoxB : function(boxObj){
            if(!boxObj){
                return false;
            }

            var lastSelectedObj;
            lastSelectedObj = _.last(_selectedHistoryObjectList); //上一次选择的结果数组
            _selectedHistoryPositionList.push(boxObj.pos);
            _selectedHistoryObjectList.push(boxObj);//记录本次选择的结果到数组
            _cachePositionHistory(); //记录上一次选择的结果

            //ref是-1，说明不是待选词 -> false
            //首次点击，但是index不是0，说明不是词语开头->false
            if(boxObj.ref<0 || (_selectedHistoryObjectList.length === 1 && boxObj.index !== 0)){
                return false;
            }

            //首次选择，是待选词 -> true
            if(_selectedHistoryObjectList.length === 1 && boxObj.ref >= 0 && boxObj.index == 0){
                return true;
            }

            //当前选择有from，当前选择位置等于上个字指向位置，说明是最后一个字
            if (boxObj.from >= 0 && boxObj.pos == lastSelectedObj.to && boxObj.ref == lastSelectedObj.ref){
                return true;
            }

            return false;
        }
    };

    var counter = {
        //每次点击信息记录器
        _updateCounterOnClick : function(isBoxCheck){
            if(isBoxCheck){
                _gameContinueCorrectClickCount += 1; //本次选对，计数器+1
            }else{
                _gameContinueCorrectClickCount = 0;
            }
        },
        //选择正确或者错误计数器
        _updateWordsCounterOnClick : function(){
            _gameContinueCollectWordsCount += 1;
        },
        _updateVictoryCounter : function(boxObj){
            _victorRef.push(boxObj.ref);
        }
    };


    //选择连续正确字数的计数器
    var scoreCalculator = {
        updateScoreForClickCorrect:function(isbox){
            if(!isbox){
                return;
            }
            _totalScore += 100 * Math.pow(Math.E,(_gameContinueCorrectClickCount/100 - 0.01)); //分数累加
        },
        updateScoreForCollectWords:function(){
            if(_gameContinueCollectWordsCount != 1){
                _totalScore += 1000 * (1+_gameContinueCollectWordsCount/10);
            }else{
                _totalScore += 1000;
            }
        },
        updateScoreForPassRound:function(){
            //通关奖励5000点
            _totalScore += BONUSSCORE;
        }
    };


    //查看是否为可以收集的新词
    var _checkNewCollection = function(){
        var nc = _.difference(_victorRef,_roundCollectedWordsRefList);
        if(nc.length>0){
            _roundCollectedWordsRefList.push(nc[0]);
            return nc
        }
        return false;
    };

    //收集成功的词语
    var _collectSucceedWord = function(boxObj){
        _roundCollectedWordsObjList[boxObj.ref] = _objectHistoryList;
        console.log("收集完毕");
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
            ,_isVictory;
        if(_.indexOf(_victorRef,boxObj.ref)>=0){
            console.log("选过了");
            return false;
        }

        //正确或者不正确判定
        isBox = checkLogic._checkBoxB(boxObj);
        //计数
        counter._updateCounterOnClick(isBox); //更新连续成功点中计数器
        //每次选择正确给积分
        scoreCalculator.updateScoreForClickCorrect(isBox);

        if(!isBox){
            _clearTempSelectHistoryList();
        }
        if(isBox){
            console.log("good chosen");
        }
        //是否整词选完，可以进行收集，最后一个词
        if(isBox && boxObj.pos == boxObj.to){
            //启动收集器
            _collectSucceedWord(boxObj);
            //更新词语收集计数器
            counter._updateWordsCounterOnClick();
            //更新判定胜利计数器
            counter._updateVictoryCounter(boxObj);
            //积分奖励
            scoreCalculator.updateScoreForCollectWords();
            console.log("一个词完成，可以收了");
            //取得本次收集的词语
            gameModule.Summary.updateTotalCollectedWords(boxObj.full);
            //清除cache
            _clearPositionHistoryCache();
            _clearTempSelectHistoryList();
        }

        //取得本次收集的词语
        isNewCollected = _checkNewCollection();
        if(!!isNewCollected){
            _isNewCollected = _roundCollectedWordsObjList[isNewCollected[0]];
        }else{
            _isNewCollected = false;
        }

        //本局胜利判定
        isV = _checkVictor();
        if(isV){
            _isVictory = true;
            scoreCalculator.updateScoreForPassRound();//过关奖励
            gameModule.Summary.updateVictoryRoundCount();
        }else{
            _isVictory = false;
        }

        //设定每次选择积分记录
        _currentBox = _data[bid];
        _posHistory = _positionHisotryList;
        isBoxObject = {
            currentBox:_currentBox,
            isBox:isBox,
            positionHistory:_posHistory,
            isNewCollected:_isNewCollected,
            isVictory:_isVictory
        };

        gameModule.Summary.updateTotalClickCount();
        gameModule.Summary.updateRoundClickCount(isBox);
        gameModule.Summary.updateTotalScore(_totalScore);
        gameModule.Summary.updateEachRoundScore(_totalScore);
        return isBoxObject;
    };



    var _restartRound = function(){
        _clearAllVariableForRestartRound();
    };

    //每次点击文字调用判定，传入id，返回判定结果数组
    my.checkBoxOnClick = function(boxId){
        return _boxCheck(boxId);
    };
    my.init = function(data,isNewGame){
        _loadData(data);    //加载数据
        _clearAllVariableForRestartRound(); //清除每局的信息
        if(isNewGame){
            //重置全部
            _clearGlobalCounter();
            console.log("新游戏");
        }

        gameModule.Summary.updateTotalRoundCount();
        gameModule.Summary.updateEachRoundScore(_totalScore);
    };
    my.gameOver = function(){
        //重置所有计数器
        //返回游戏Summary
        return "gameOver 啦!";
    };
    return my;
}());


//统计模块
gameModule.Summary = (function(my){

    var _summary = {};

    var  _totalClickCount = 0
        ,_totalCorrectClick = 0
        ,_totalWrongClick = 0
        ,_eachRoundClick = {} //每轮点击统计
        ,_totalScore = 0 //总分
        ,_totalRoundCount = 0
        ,_activeRoundCount = 0
        ,_victoryRoundCount = 0
        ,_eachRoundScore = {} //每轮积分
        ,_totalCollectedWords = []
        ,_eachRoundTime = []; //每轮时间
    my.reset = function(){
        _summary = {};
        _totalClickCount = 0;
        _totalCorrectClick = 0;
        _totalWrongClick = 0;
        _eachRoundClick = {};
        _totalScore = 0;
        _totalRoundCount = 0;
        _activeRoundCount = 0;
        _victoryRoundCount = 0;
        _eachRoundScore = {};
        _totalCollectedWords = [];
        _eachRoundTime = [];
    };

    //记录总点击数
    my.updateTotalClickCount = function(){
        _totalClickCount += 1;
    };
    //记录总局数
    my.updateTotalRoundCount = function(){
        _activeRoundCount = _totalRoundCount - _victoryRoundCount; //主动更新局数
        _totalRoundCount += 1; //总局数
        _eachRoundClick[_totalRoundCount] = _eachRoundClick[_totalRoundCount] || {
            correctClick : 0,
            wrongClick   : 0
        };
        _eachRoundScore[_totalRoundCount] = _eachRoundScore[_totalRoundCount] || {
            score : 0,
            totalScore : 0
        };
    };
    //记录胜利局数
    my.updateVictoryRoundCount = function(){
        _victoryRoundCount += 1;
    };
    //记录每局正确和错误点击数
    my.updateRoundClickCount = function(isBox){
        if(isBox){
            _totalCorrectClick += 1;
            _eachRoundClick[_totalRoundCount].correctClick += 1;
        }else{
            _totalWrongClick += 1;
            _eachRoundClick[_totalRoundCount].wrongClick += 1;
        }
    };
    //记录总分
    my.updateTotalScore = function(score){
        _totalScore = +score.toFixed(3);
    };
    //记录每局得分
    my.updateEachRoundScore = function(score){
        score = +score.toFixed(3);
        _eachRoundScore[_totalRoundCount].totalScore = score;
        _eachRoundScore[_totalRoundCount].score = +(score - (_eachRoundScore[_totalRoundCount-1] ? _eachRoundScore[_totalRoundCount-1].totalScore : 0)).toFixed(3);
    };
    //记录所有收集的词语
    my.updateTotalCollectedWords = function(words){
        _totalCollectedWords.push(words);
        _totalCollectedWords = _.uniq(_totalCollectedWords) ||  [];
    };
    my.updateTotalCollectedChars = function(){

    };


    my.get = function(){
        _summary =  {
            TotalClickCount     : _totalClickCount,
            TotalRoundCount    : _totalRoundCount,
            VictoryRoundCount : _victoryRoundCount,
            ActiveRoundCount : _activeRoundCount,
            TotalCorrectClick   : _totalCorrectClick,
            TotalWrongClick     : _totalWrongClick,
            EachRoundClick     : _eachRoundClick,
            TotalScore : _totalScore,
            EachRoundScore : _eachRoundScore,
            TotalCollectedWords : _totalCollectedWords
        };
        return _summary;
    };

    return my;
}(gameModule.Summary || {}));

/**
 * Created by muyuruhai on 16/10/15.
 */

var gameTimer = (function(my){

    var _n = 0;
    var isStop = true;
    var instance = null;
    var _maxTime = -1;
    var _delay = 1000/24;
    var _callback = {};

    my.isStopped = function(){
        return isStop;
    };
    my.getCount = function(){
        return _n;
    };
    my.setDelay = function(d){
        _delay = d;
    };
    my.getDelay = function(){
        return _delay;
    };
    my.setMaxtime = function(t){
        _maxTime = t;
    };
    my.getMaxtime = function(){
        return _maxTime;
    };
    my.getRunningSecond = function(){
        if(parseFloat(_n*_delay/1000).toFixed(3)>_maxTime){
            return _maxTime;
        }
        return parseFloat(_n*_delay/1000).toFixed(3);
    };
    my.changeRuningSecond = function(second){
        _n = (_n - second*1000/_delay)>0 ? _n - second*1000/_delay : 0;
    };
    my.updateCallback = function(callBack){
        _callback['update'] = callBack || function(){};
    };
    my.endCallback = function(callBack){
        _callback['end'] = callBack || function(){ console.log()};
    };
    var _checkShouldEnd = function(){
        return ((_n*_delay/1000 > _maxTime) && _maxTime>0);
    };

    //主函数 递归调用
    var setTime = function(){
        if(!my.updateCallback){
            console.log(_n);
            return;
        }
        if (_checkShouldEnd()){
            isStop = false;
            if(_callback['end']){
                _callback['end']();
            }
            _n = 0;
            return;
        }
        instance = window.setTimeout(function(){
            if (!isStop){
                if(_callback['update']){
                    _callback['update'](_n);
                }
                _n++;
                window.clearTimeout(instance);
                setTime();
            }
        },_delay);
    };

    my.start = function(){
        isStop = false;
        setTime();
    };
    my.stop = function(reset){
        _n = reset ? 0 : _n;
        isStop = true;
        window.clearTimeout(instance);
    };
    my.reset = function(n){
        isStop = true;
        _n = n || 0;
    };
    my.restart = function(){
        _n = 0;
        isStop = false;
    };
    return my;
}(gameTimer || {}));

//countDown 倒计时模块，需要new
gameTimer.cd = (function(d){
    var me = {};
    var queue = [];//验证是否有重复
    var _delay = d || 1000;
    var _callback = {};
    me.setDelay = function(delay){
        _delay = delay;
    };
    me.stepFunc = function(callback){
        _callback['step'] = callback;
    };
    me.start = function(callback,t){
        var i = 0;
        if (queue.length>0){
            return;
        }
        var a = function(){
            var	n = setTimeout(function(){
                i++;
                if(_callback['step']){
                    _callback['step'](i);
                }
                if(i<t){
                    clearTimeout(n);
                    a();
                }else{
                    var _s = setTimeout(function(){
                        callback();
                        queue = [];
                        clearTimeout(_s);
                    },1000);
                }
            },_delay);
        };
        a();
        queue.push(true);
    };
    return me;
});
/**
 * Created by muyuruhai on 16/10/15.
 */

var gameTimer = (function(my){
    var _n = 0;
    var onOff = false;
    var instance = null;
    var _maxTime = -1;
    var _delay = 100;
    var _callback = {};
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
        return parseFloat(_n*_delay/1000).toFixed(3);
    };
    my.updateCallback = function(callBack){
        _callback['update'] = callBack || function(){};
    };
    my.endCallback = function(callBack){
        _callback['end'] = callBack || function(){ console.log()};
    };
    //主函数 递归调用
    var setTime = function(){
        if(!my.updateCallback){
            return;
        }
        if ((_n*_delay/1000 > _maxTime) && _maxTime>0){
            onOff = false;
            if(_callback['end']){
                _callback['end']();
            }
            return;
        }
        instance = window.setTimeout(function(){
            if (!onOff){
                if(_callback['update']){
                    _callback['update'](_n);
                }
                _n++;
                window.clearTimeout(instance);
                setTime();
            }
        },_delay);
    };
    my.loopStart = function(){
        onOff  = false;
        setTime();
    };
    my.loopStop = function(){
        onOff  = true;
        window.clearTimeout(instance);
    };
    my.loopRestart = function(){
        _n = 0;
        onOff  = false;
        setTime();
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
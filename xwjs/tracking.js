/**
 * tracking
 * @authors xiaowei(619608182@qq.com)
 * @date    2014-04-21 12:39:26
 * @version 1.0
 */

/**
* tracking
*/
function trckingCode(code){
	$.getScript(code);
}

//临时方法 以后调用trckingCode
function trckingCodeWrap(code){
	trckingCode(code);
}

function trckingCodeDebug(code){
	// alert(code)
}


/**
* 从朋友圈点回数量
*/
function trcking_timeline(){
	trckingCode('http://t.l.qq.com/ping?t=m&cpid=641010718&url=http%3A//app_minisite_click_monitor/button64101071837&ref');
	trckingCodeDebug('从朋友圈点回数量');
}


/**
* Panorama 介绍页load开始人
*/
function trcking_loading(){
	trckingCode('http://t.l.qq.com/ping?t=m&cpid=641010718&url=http%3A//app_minisite_click_monitor/button64101071816&ref');
	trckingCodeDebug('Panorama 介绍页load开始人');
}

/**
* Panorama 介绍页load结束人数
*/
function trcking_loaded(){
	trckingCode('http://t.l.qq.com/ping?t=m&cpid=641010718&url=http%3A//app_minisite_click_monitor/button64101071817&ref');
	trckingCodeDebug('Panorama 介绍页load结束人数');
}

/**
* Panorama enter点击数
*/
function trcking_enter(){
	trckingCode('http://t.l.qq.com/ping?t=m&cpid=641010718&url=http%3A//app_minisite_click_monitor/button64101071818&ref');
	trckingCodeDebug('Panorama enter点击数');
}

/**
* Panorama end screen load开始人数
*/
function trcking_ending(){
	trckingCode('http://t.l.qq.com/ping?t=m&cpid=641010718&url=http%3A//app_minisite_click_monitor/button64101071827&ref');
	trckingCodeDebug('Panorama end screen load开始人数');
}

/**
* Panorama点击重新观看人数
*/
function trcking_ending_review(){
	trckingCode('http://t.l.qq.com/ping?t=m&cpid=641010718&url=http%3A//app_minisite_click_monitor/button64101071828&ref');
	trckingCodeDebug('Panorama点击重新观看人数');
}


function trcking_lv1(){
	trckingCode('http://t.l.qq.com/ping?t=m&cpid=641010718&url=http%3A//app_minisite_click_monitor/button64101071833&ref');
	trckingCodeDebug('lv1');
}
function trcking_lv2(){
	trckingCode('http://t.l.qq.com/ping?t=m&cpid=641010718&url=http%3A//app_minisite_click_monitor/button64101071834&ref');
	trckingCodeDebug('lv2');
}
function trcking_lv3(){
	trckingCode('http://t.l.qq.com/ping?t=m&cpid=641010718&url=http%3A//app_minisite_click_monitor/button64101071835&ref');
	trckingCodeDebug('lv3');
}
function trcking_lv4(){
	trckingCode('http://t.l.qq.com/ping?t=m&cpid=641010718&url=http%3A//app_minisite_click_monitor/button64101071835&ref');
	trckingCodeDebug('lv4');
}
function trcking_lv5(){
	trckingCode('http://t.l.qq.com/ping?t=m&cpid=641010718&url=http%3A//app_minisite_click_monitor/button64101071836&ref');
	trckingCodeDebug('lv5');
}
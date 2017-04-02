/**
 * common.js
 * @authors xiaowei(619608182@qq.com)
 * @date    2014-04-17 12:07:53
 * @version 1.0
 */

var chapterShare = {
	chapter: ""
};
var lv = null;
/**
 * 获取进入时默认的skin
 */
function getDefaultSkin() {
	//screen
	var hash = location.hash.replace('#', '');
	var skin = getQueryString("screen");
	for (var i = 0; i < sks.length; i++) {
		if (sks[i].chapter == skin) {
			break;
		}
		if (i == sks.length - 1) {
			skin = sks[0].chapter
		}
	}
	return skin;
}


/**
 * 获取QueryString
 */
function getQueryString(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
	var r = window.location.search.substr(1).match(reg);
	if (r != null) return unescape(r[2]);
	return null;
}

/**
 * 获取QueryString
 */
function getAllQueryString() {
	var url = location.search; //获取url中"?"符后的字串
	var theRequest = new Object();
	if (url.indexOf("?") != -1) {
		var str = url.substr(1);
		strs = str.split("&");
		for (var i = 0; i < strs.length; i++) {
			theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
		}
	}
	return theRequest;
}

/**
 * 获取css前缀
 */
function getPrefix() {

	var styles = window.getComputedStyle(document.documentElement, '');
	var pre = (Array.prototype.slice.call(styles).join('').match(/-(moz|webkit|ms)-/) || (styles.OLink === '' && ['', 'o']))[1];
	var dom = ('WebKit|Moz|MS|O').match(new RegExp('(' + pre + ')', 'i'))[1];

	return {
		dom: dom,
		lowercase: pre,
		css: '-' + pre + '-',
		js: pre == 'moz' ? dom : pre[0].toLowerCase() + pre.substr(1)
	}

}



/**
 * 获取进入时默认的skin
 */
function getLeave() {
	lv = 3;
	var supported = true;
	var prefix = getPrefix();
	if (true) {
		// if (prefix.js.toLowerCase() === 'ms') {
		//	Create test element
		var element = document.createElement('LINK');
		//	Append to DOM
		document.getElementsByTagName('HEAD')[0].insertBefore(element, null);
		//	Set test style
		element.style[prefix.js + 'TransformStyle'] = 'preserve-3d';
		//	Get the test elements computed styels
		var cs = window.getComputedStyle(element, null),
			//	Extract the transformStyle style
			transformStyle = cs.getPropertyValue(prefix.css + 'transform-style');
		//	Test its content
		supported = (transformStyle !== 'preserve-3d') ? false : true;
		//	Remove the test element
		element.parentNode.removeChild(element);
	}

	if (!supported) {
		lv = 5;
	} else {
		if (window.DeviceOrientationEvent) {
			lv = 1;
			lv = version.getLeave();
		} else {
			lv = 2;
			// lv = version.getLeave();
		}
	}

	if (getQueryString("level")) {
		lv = parseInt(getQueryString("level"));
	}
	return lv;
}

function route() {
	//获取leave
	var lv = getLeave();
	//leave对应的url
	var urls = ['coming.html', 'gyro.html', 'gyro.html', 'touch.html', 'touch.html', 'notsupported.html'];
	var pathname = window.location.pathname;
	var currentUrl = pathname.substring(pathname.lastIndexOf('/') + 1).toLowerCase();
	if (urls[lv] == currentUrl) {
		var scene = getQueryString("scene");
		if (scene == "2") {
			trcking_timeline();
		}
		switch (lv) {
			case 1:
				trcking_lv1();
				break;
			case 2:
				trcking_lv2();
				break;
			case 3:
				trcking_lv3();
				break;
			case 4:
				trcking_lv4();
				break;
			case 5:
				trcking_lv5();
				break;
		}
		return;
	}
	//获取所有querystring
	var allquerystring = getAllQueryString();
	var url = urls[lv] + "?user=xiaowei";
	for (var key in allquerystring) {
		if (key == "user") continue;
		url += "&" + key + "=" + allquerystring[key];
	}
	//window.location = url;
}

route();
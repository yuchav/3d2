(function() {
	if (document.addEventListener) {
		document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);
	} else if (document.attachEvent) {
		document.attachEvent('WeixinJSBridgeReady', onBridgeReady);
		document.attachEvent('onWeixinJSBridgeReady', onBridgeReady);
	}


	function onBridgeReady() {
		var img_url = "http://shp.qpic.cn/app_actsec/4376ae1e0cf0ccce3c76ed1237f64bc6ed27ecf3747de421afbef1a2acd7f4289c69c6b49f8e523544a06468c46ffd9cefcbd647f23021a1/0",
			url = window.location.href,
			title = "Burberry上海盛典全景",
			content = "探索London in Shanghai博柏利盛典，体验身临其境的震撼全景。";
			if(url.indexOf('?')<0){
				url = url + '?user=xiaowei';
			}
		// 发送给好友;
		WeixinJSBridge.on('menu:share:appmessage', function(argv) {
			WeixinJSBridge.invoke('sendAppMessage', {
				"img_url": img_url,
				"img_width": "640",
				"img_height": "640",
				"link": url + "&screen=" + chapterShare.chapter + "&source=friend",
				"desc": content,
				"title": title
			}, function(res) {

			});
		});

		// 分享到朋友圈;
		WeixinJSBridge.on('menu:share:timeline', function(argv) {
			WeixinJSBridge.invoke('shareTimeline', {
				"img_url": img_url,
				"img_width": "640",
				"img_height": "640",
				"link": url + "&screen=" + chapterShare.chapter + "&source=timeline",
				"desc": content,
				"title": title
			}, function(res) {

			});
		});

		// 分享到微博;
		var weiboContent = '';
		WeixinJSBridge.on('menu:share:weibo', function(argv) {
			WeixinJSBridge.invoke('shareWeibo', {
				"content": title,
				"url": url + "&screen=" + chapterShare.chapter
			}, function(res) {

			});
		});

		// 分享到Facebook
		WeixinJSBridge.on('menu:share:facebook', function(argv) {
			WeixinJSBridge.invoke('shareFB', {
				"img_url": img_url,
				"img_width": "640",
				"img_height": "640",
				"link": url + "&screen=" + chapterShare.chapter + "&source=facebook",
				"desc": title,
				"title": content
			}, function(res) {

			});
		});

		// 新的接口
		WeixinJSBridge.on('menu:general:share', function(argv) {
			var scene = 0;
			switch (argv.shareTo) {
				case 'friend':
					scene = 1;
					break;
				case 'timeline':
					scene = 2;
					break;
				case 'weibo':
					scene = 3;
					break;
			}
			argv.generalShare({
				"appid": "",
				"img_url": img_url,
				"img_width": "640",
				"img_height": "640",
				"link": url + "&screen=" + chapterShare.chapter + "&scene="+scene,
				"desc": content,
				"title": title
			}, function(res) {

			});
		});

		// get network type
		var nettype_map = {
			"network_type:fail": "fail",
			"network_type:edge": "2g",
			"network_type:wwan": "3g",
			"network_type:wifi": "wifi"
		};
		/*
		if (typeof WeixinJSBridge != "undefined" && WeixinJSBridge.invoke){
			WeixinJSBridge.invoke('getNetworkType',{}, function(res) {
				var networkType = nettype_map[res.err_msg];
				if(networkType=="2g"){
					alert("请使用3G或wifi浏览本网页。");
				}
			});
		}
		*/
	}
})();

var version = (function(){


	function Version(agentStr){
		this.agentStr = window.navigator.userAgent;

	}

	/**
	*获得等级
	*/

	Version.prototype.getLeave = function(){

		var sys = this._getSystem(),browser = this._getBrowser();



		//ios终端
		if(sys.ios){
			return 1;
		}

		if(sys.windowphone || browser.Firefox){
			return 5;
		}

		//已测
		if(sys.xiaomi2s){

			if(browser.UCBrowser || browser.Chrome){
				return 1;
			}else{
				return 3;
			}
		}

		//已测
		if(sys.LenovoA850){
			if(browser.Default || browser.MicroMessenger || browser.Chrome){
				return 2;
			}else{
				return 3;
			}
		}



		if(sys.SAMSUNGGTN7108){
			if(browser.Chrome || browser.MicroMessenger){
				return 2;
			}else {
				return 3;
			}
		}

		if(sys.HUAWEIP6U06){
			if(browser.MQQBrowser || browser.Default || browser.UCBrowser ||　browser.Chrome || browser.MicroMessenger){
				return 2;
			}else {
				return 3;
			}
		}


		if(sys.S4){
			if(this.agentStr.indexOf("Mozilla") >-1 && this.agentStr.indexOf("1.0 Chrome") >-1  ){
				return 3;
			}
			if(browser.UCBrowser || browser.MQQBrowser || browser.Chrome){
				return 1;
			}else{
				return 3;
			}
		}

		/*
		*新添加开始
		*/
		if(sys.GALAXYNOTE3){
			if(browser.MicroMessenger || browser.Native){
				return 2;
			}else{
				return 3;
			}
		}
		if(sys.GALAXYNOTE2){
			if(browser.MicroMessenger || browser.Chrome){
				return 2;
			}else{
				return 3;
			}
		}
		if(sys.XPERIARAY){
			if(browser.MicroMessenger){
				return 2;
			}else{
				return 3;
			}
		}
		if(sys.HTCONEX){
			if(browser.MicroMessenger || browser.Chrome){
				return 1;
			}else{
				return 3;
			}
		}
		if(sys.SAMSUNGGALAXYS3){
			if(browser.MicroMessenger){
				return 2;
			}else if(browser.Chrome){
				return 1;
			}else{
				return 3;
			}
		}
		if(sys.SAMSUNGGALAXYSII){
			if(browser.MicroMessenger){
				return 1;
			}else{
				return 3;
			}
		}
		if(sys.NULIONX403A){
			if(browser.MicroMessenger){
				return 1;
			}else{
				return 3;
			}
		}
		if(sys.SAMSUNGGALAXYS3MINI){
			if(browser.MicroMessenger){
				return 2;
			}else{
				return 3;
			}
		}
		if(sys.OPPOX909T){
			if(browser.MicroMessenger){
				return 3;
			}else{
				return 3;
			}
		}
		if(sys.MEIZUMX2M045){
			if(browser.MicroMessenger){
				return 1;
			}else{
				return 3;
			}
		}
		if(sys.MEIZUMX2M040){
			if(browser.MicroMessenger){
				return 1;
			}else{
				return 3;
			}
		}
		if(sys.HUAWEIC8812){
			if(browser.MicroMessenger){
				return 3;
			}
		}
		if(sys.Nexus5){
			if(browser.MicroMessenger){
				return 1;
			}else{
				return 3;
			}
		}
		if(sys.Nexus4){
			if(browser.MicroMessenger){
				return 1;
			}else{
				return 3;
			}
		}
		/*
		*新添加结束
		*/


		if(sys.ios || sys.iphone || sys.ipad || sys.android){}else{
			return 5;
		}


		var androidRegx = /Android [4-9].[1-9]/;
		if(androidRegx.exec(this.agentStr)){
			return 2;
		}

		return 3;


	}

	Version.prototype.getSystem = function(){
		var sys = this._getSystem();
		return sys;
	}
	Version.prototype.getBrowser = function(){
		var browser = this._getBrowser();
		return browser;
	}

	/*
	*获得浏览器
	*/
	Version.prototype._getBrowser = function(){

		return {
			Default: (this.agentStr.indexOf('Mozilla/') > -1 || this.agentStr.indexOf('Android') > -1 || this.agentStr.indexOf('Linux') > -1 || this.agentStr.indexOf('AppleWebKit534/') > -1 || this.agentStr.indexOf('Mobile Safari/') > -1) && this.agentStr.indexOf('MicroMessenger') <= -1 && this.agentStr.indexOf('UCBrowser') <= -1 && this.agentStr.indexOf('Chrome') <= -1 && this.agentStr.indexOf('Firefox') <= -1 && this.agentStr.indexOf('MQQBrowser') <= -1, //默认

			UCBrowser: this.agentStr.indexOf('UCBrowser') > -1,  //uc

			Chrome: this.agentStr.indexOf('Chrome') > -1, //谷歌

			Firefox: this.agentStr.indexOf('Firefox') > -1, //火狐

			MicroMessenger: this.agentStr.indexOf('MicroMessenger') > -1, // 微信

			MQQBrowser: this.agentStr.indexOf('MQQBrowser')>-1, //QQ

			Native: this.agentStr.indexOf('Mobile SAMSUNG')>-1, //
		};

	}

	/**
	*判断系统 机型
	*/
	Version.prototype._getSystem = function(){
		return {
			ios: !! this.agentStr.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
			iphone: this.agentStr.indexOf('iPhone') > -1, //是否为iPhone或者QQHD浏览器
			ipad: this.agentStr.indexOf('iPad') > -1, //是否iPad
			android:this.agentStr.indexOf('Android') > -1, // 是否是android
			windowphone:this.agentStr.indexOf('Windows Phone') > -1,
			//小米
			xiaomi2s: this.agentStr.indexOf('MI 2') > -1,
			LenovoA850: this.agentStr.indexOf('Lenovo') > -1 && this.agentStr.indexOf('A850') > -1,
			SAMSUNGGTN7108:this.agentStr.indexOf('N7108') > -1, //note 2
			HUAWEIP6U06:this.agentStr.indexOf('P6-U06') > -1,
			S4:this.agentStr.indexOf('GT') > -1 &&　this.agentStr.indexOf('I9500') > -1,

			//新添加机型判断
			//GALAXY NOTE 3
			GALAXYNOTE3:this.agentStr.indexOf('SM-N9009') > -1,
			//GALAXY NOTE 2
			GALAXYNOTE2:this.agentStr.indexOf('GT-N7102') > -1,
			//XPERIA Ray (ST18i)
			XPERIARAY:this.agentStr.indexOf('ST18i') > -1,
			//HTC One X
			HTCONEX:this.agentStr.indexOf('HTC One X') > -1,
			//Samsung Galaxy S3
			SAMSUNGGALAXYS3:this.agentStr.indexOf('GT-I9500') > -1,
			//Samsung Galaxy SII
			SAMSUNGGALAXYSII:this.agentStr.indexOf('GT-I9100G') > -1,
			//Nuoio nx403a
			NULIONX403A:this.agentStr.indexOf('NX403A') > -1,
			//Samsung Galaxy S3 Mini
			SAMSUNGGALAXYS3MINI:this.agentStr.indexOf('GT-I8190N') > -1,
			//Oppo X909T
			OPPOX909T:this.agentStr.indexOf('X909T') > -1,
			//MEIZU MX2 M045
			MEIZUMX2M045:this.agentStr.indexOf('M045') > -1,
			//MEIZU MX2 M040
			MEIZUMX2M040:this.agentStr.indexOf('M040') > -1,
			//Huawei C8812
			HUAWEIC8812:this.agentStr.indexOf('C8812') > -1,
			//Nexus 5
			Nexus5:this.agentStr.indexOf('Nexus 5') > -1,
			//Nexus 4
			Nexus4:this.agentStr.indexOf('Nexus 4') > -1
		};
	}
	return new Version();
})();
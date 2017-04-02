define([
	'pano.gyro',
	'pano.accelerometer',
	'pano.inertia',
	'pano.cube',
	'pano.userSupport',
	'pano.ui',
	'three.vector3',
	'pano.blocker',
	'utils.log',
	'utils.imageloader',

], function(Gyro, Accelerometer, Inertia, Cube, UserSupport, UI, Vector3, Blocker, log ,Imageloader) {
	/*
	 *
	 *	Setup
	 *
	 */
	var faces = ['PANO_north', 'PANO_east', 'PANO_south', 'PANO_west', 'PANO_up', 'PANO_down'];
	//
	var skins = sks; //	The panorama skins and chapter information
	/*
	 *
	 */
	var skin = getDefaultSkin(); //	Initial skin/chapter to welcome the user
	var user = new UserSupport(); //	Create new User for device/lang/prefix detection
	var cube = new Cube(skins, faces); //	Panoramic cube
	var UI = new UI(); //	User Interface
	var vec3 = new Vector3(); //	3D vector object
	var motion = null; //	Motion var to hold the motion type depending on user support (inertia, gyro)
	var inertia = null; //	Inertia container
	var gyro = null; //	Gyro container
	var initialised = false; //	Initiation boolean
	var useGyro = null; //	Should we use the gyro?
	var blocker = new Blocker(); //	Blocker to control the degree of the 360˚ view the user can access
	var range = null; //	The range on degrees the user can view before being blocked by the blocker
	var motionCancelled = false; //	Has the motion been cancelled. We should cancel the motion the save on CPU usage when viewing video etc
	var imageLoader = new Imageloader();
	/*
	 *
	 *	Support event
	 *
	 */
	var onSupportUpdate = function(e) {
		/*
		 *	Run or redirect
		 */
		if (e.supported) {
			/*
			 *	Update the UI user details
			 */
			UI.init(e, skins, skin);
			/*
			 *	Init the cube
			 */
			cube.init(e, skin);

		} else {
			log(['User unsupported']);
		}
		/*
		 *	Reset user
		 */
		user = e;
	}
	/*
	 *
	 *	Motion event
	 *
	 */
	var onMotion = function(e) {
		/*
		 *
		 */
		vec3.set(e.vec3.x, e.vec3.y, e.vec3.z);
		/*
		 *	If range, set blockers and filter signal
		 */
		if (range) vec3 = blocker.block(vec3);
		/*
		 *	Update cube
		 */
		cube.rotate(vec3);
		/*
		 *	Update UI
		 */
		UI.rotate(vec3);
	}
	/*
	 *
	 *	Block Motion event
	 *
	 */
	var onKillMotion = function() {

		if (!motionCancelled) {
			/*
			 *	Remove current motion event
			 */
			motion.removeEventListener('onMotionUpdate', onMotion);
			/*
			 *	Clear the motion variable
			 */
			motion = null;
			/*
			 *
			 */
			motionCancelled = true;
		} else {
			/*
			 *	Set the motion variable to its new type
			 */
			motion = (useGyro) ? gyro : inertia;
			/*
			 *	Listen to new motion type
			 */
			motion.addEventListener('onMotionUpdate', onMotion);
			/*
			 *
			 */
			motionCancelled = false;
		}
	}
	/*
	 *
	 *	Cube event
	 *
	 */
	var onLoaded = function(e) {
		if (!initialised) {
			/*
			 *	Setup gyro and inertia
			 */
			gyro = (user.gyro) ? new Gyro(user) : null;
			inertia = new Inertia('easeOutQuad', 29, 10);
			/*
			 *
			 */
			useGyro = (user.gyro && user.device.model.toLowerCase() !== 'android') ? true : false;
			/*
			 *	Add motion listener
			 */
			motion = (useGyro) ? gyro : inertia;
			motion.addEventListener('onMotionUpdate', onMotion);
			/*
			 *	Set initialised
			 */
			initialised = true;
		}
		/*
		 *	Set range
		 */
		range = e.range;
		/*
		 *	If range, set blockers
		 */
		if (range) blocker.set(e.range);
		/*
		 *
		 */
		if (!useGyro) {
			motion.reset();
			onMotion({
				vec3: motion.vec3
			})
		}
		/*
		 *	UI init load complete
		 */
		setTimeout(function() {
			UI.hideLoadScreen();
		}, 3000);
	}
	/*
	 *
	 *	Motion toggle event to turn the Gyro experience ON/OFF (if gyro exists)
	 *
	 */
	var onUpdateSkin = function(e) {
		/*
		 *	Update cube
		 */
		cube.loadSkin(e);
	}
	/*
	 *
	 *	Event listeners
	 *
	 */
	user.addEventListener('supportStatusUpdate', onSupportUpdate);
	cube.addEventListener('onLoaded', onLoaded);
	/*
	 *	UI Events
	 */
	UI.addEventListener('updateSkin', onUpdateSkin);
	UI.addEventListener('killMotion', onKillMotion);
	/*
	 *	Test user
	 */

	//添加其他loading的内容
	var preloadimgs = [
		"img/panorama/lujiazui/mobile_f.jpg", //intro背景
		"img/lv3/icon2.png", //滑动
		"img/lv3/icon3.png" //指点
	];

	for (var i = 0; i < skins.length; i++) {
		if(skins[i].hotSpots && skins[i].hotSpots.videos && skins[i].hotSpots.videos.length>0){
			preloadimgs.push(skins[i].hotSpots.videos[0].pic);
		}
	}

	//loading开始tracking
	trcking_loading();

	imageLoader.addEventListener('onLoad', function(){
		//Panorama 介绍页load结束人数
		trcking_loaded();
		user.test();
	});
	imageLoader.load(preloadimgs);
})
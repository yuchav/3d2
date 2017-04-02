define([

	'utils.imageloader',
	'three.vector3',
	'utils.log',
	'pano.ui.lightbox'
], function(ImageLoader, Vector3, log,lightBox) {
	/*
	 *
	 *	Cube
	 *
	 */
	function Cube(skins, faces) {

		this.lightbox = new lightBox();
		//	Media
		this.skins = skins;
		//	Face ID
		this.faces = faces;
		//	User
		this.user = null;
		//	Listener
		this.listeners = [];
		//
		this.prefix = '';
		//
		this.panorama = document.querySelector('#PANO');
		//
		this.scene = document.querySelector('#PANO_scene');
		//
		this.fov = ((2 * (Math.atan(0.5 * window.innerHeight / 20))) * 180 / Math.PI) + 300;
		//
		this.vec3 = new Vector3();
		//
		this.range = null;

	}

	Cube.prototype = {

		constructor: Cube,

		init: function(user, chapter) {

			this.user = user;
			//	Set prefix
			this.prefix = user.prefix.js;

		},

		post: function(type) {
			//	For each listener
			for (var i = 0; i < this.listeners.length; i++) {

				if (this.listeners[i].type === type) {

					switch (type) {
						case 'onLoaded':
							this.listeners[i].callback.call(this, {
								panorama: this.panorama,
								skins: this.skins,
								range: this.range
							});
							break;
						default:
							return false;
							break;
					}
				}
			}
		},

		addEventListener: function(type, callback) {
			//	Listener list
			this.listeners.push({
				type: type,
				callback: callback
			});
		},

		removeEventListener: function(type) {
			//	Listener list
			for (var i = 0; i < this.listeners.length; i++) {

				if (this.listeners[i].type === type) {

					this.listeners.splice(i, 1);

				}

			}

		},

		loadSkin: function(chapter) {
			var self = this;
			/*
			 *
			 */
			this.loadImages(chapter);
			/*
			 *
			 */

			for (var i = 0; i < this.skins.length; i++) {
				if (this.skins[i].chapter === chapter) {
					this.range = (this.skins[i].range) ? this.skins[i].range : null;
					//
					chapterShare = this.skins[i];

					//章节 loading 开始tracking
					trckingCodeWrap(this.skins[i].loadStartTracking);


					//load video
					var videoc = document.getElementById('PANO_lb_video_c');
					var captionEle = document.getElementById('PANO_lb_video_caption');
					if(this.skins[i].hotSpots && this.skins[i].hotSpots.videos && this.skins[i].hotSpots.videos.length>0){
						var src = this.skins[i].hotSpots.videos[0].media.mp4;
						var pic = this.skins[i].hotSpots.videos[0].pic;
						var caption = this.skins[i].hotSpots.videos[0].caption;
						captionEle.innerHTML ='<p>' + caption + '</p>';
						// videoc.innerHTML = '<video poster="'+ pic +'" id="PANO_lb_video_xiaowei" preload="auto" src="'+ src +'" controls="controls"></video><img class="xw_loading" src="img/ui/PANO_load.png">';

						//如果是安卓和微信浏览器 就删除controls
						if(false){
						// if(version.getSystem().android && version.getBrowser().MicroMessenger){
							$("#PANO_lb_video_c").html('<video id="PANO_lb_video_xiaowei" preload="auto" poster="'+ pic +'" src="'+ src +'"></video>');
						}
						else{
							$("#PANO_lb_video_c").html('<video id="PANO_lb_video_xiaowei" preload="auto" poster="'+ pic +'" src="'+ src +'" controls="controls"></video>');
						}

						//ios 用浮层的图
						if(version.getSystem().ios || version.getSystem().iphone || version.getSystem().ipad){
							$("#PANO_lb_video_c").append('<img src="'+ pic +'" id="PANO_lb_video_c_poster" />');
							$("#PANO_lb_video_c").append('<img src="img/ui/play.png" id="PANO_lb_video_c_play" />');
							//绑定点击
							document.getElementById('PANO_lb_video_c_play').onclick = function(){
								document.getElementById('PANO_lb_video_xiaowei').play();
							}
						}


						//如果是微信的安卓 就弄一个假的图标
						if(false){
						// if(version.getSystem().android && version.getBrowser().MicroMessenger){
							$("#PANO_lb_video_c").append('<img src="img/ui/play.png" id="PANO_lb_video_c_play" />');
							document.getElementById('PANO_lb_video_xiaowei').addEventListener('play', function(){
								document.getElementById('PANO_lb_video_c_play').style.display = 'none';
							}, false);
							document.getElementById('PANO_lb_video_xiaowei').addEventListener('pause', function(){
								document.getElementById('PANO_lb_video_c_play').style.display = 'block';
							}, false);
							document.getElementById('PANO_lb_video_c_play').onclick = function(){
								document.getElementById('PANO_lb_video_xiaowei').play();
							}
						}
						// var video = document.getElementById('PANO_lb_video_xiaowei');
						// PANO_lb_video_xiaowei.addEventListener('play', function(){
						// 	self.lightbox.exit("video");
						// }, false);
					}

					break;
				}
			}



		},

		loadImages: function(chapter) {

			var imageLoader = new ImageLoader();
			var self = this;
			var imgs = [];
			/*
			 *	Set imageLoaded callback function
			 */
			var imageLoaded = function(e) {
				/*
				 *
				 */
				var faceArray = [];
				/*
				 *	For all images loaded
				 */
				for (var i = 0; i < e.images.length; i++) {
					/*
					 *	Dont display
					 */
					e.images[i].style.display = 'none';
					/*
					 *	Append to body to cache
					 */
					document.body.appendChild(e.images[i]);
					/*
					 *	Face parent
					 */
					var faceParent = document.querySelector('#' + self.faces[i]);
					/*
					 *	Draw face container
					 */
					var face = self.drawFaces(i, e.images[i].src);
					/*
					 *
					 */
					faceArray.push(face);
					/*
					 *	Add to parent
					 */
					faceParent.appendChild(face);
					/*
					 *	If last, post all done!
					 */
					if (i === e.images.length - 1) self.post('onLoaded');


				};
				/*
				 *	For each skin
				 */
				for (var i = 0; i < self.skins.length; i++) {
					/*
					 *	If its the skin for chapter "X", set skin's loaded status to true
					 */
					if (self.skins[i].chapter === chapter) {
						self.skins[i].loaded = true;
						self.skins[i].faces = faceArray;

						//章节 loading 开始tracking
						trckingCodeWrap(self.skins[i].loadEndingTracking);
						break;
					}
				}
			}
			/*
			 *	Add listener
			 */
			imageLoader.addEventListener('onLoad', imageLoaded);
			/*
			 *	For each skin
			 */
			for (var i = 0; i < this.skins.length; i++) {
				/*
				 *	If its the skin for chapter "X"
				 */
				if (this.skins[i].chapter === chapter) {
					/*
					 *	If the chapter has been loaded already.
					 */
					if (this.skins[i].loaded) {
						/*
						 *	Show the cube's faces with the loaded images from chapter "X"
						 */
						self.showFaces(chapter);
						/*
						 *	And return
						 */
						return;
					}
					/*
					 *	Make an image array
					 */
					imgs = imgs.concat(this.skins[i].media);
					/*
					 *	Break the loop
					 */
					break;
				}
			};
			/*
			 *	Load the images
			 */
			imageLoader.load(imgs);
		},

		drawFaces: function(i, imageSrc) {
			/*
			 *	Create face
			 */
			var face = document.createElement('div');
			/*
			 *	Set class
			 */
			face.className = 'face_media';
			/*
			 *
			 */
			face.style.backgroundImage = 'url("' + imageSrc + '")';
			/*
			 *
			 */
			face.style.backgroundSize = '100% 100%';
			/*
			 *
			 */
			return face;

		},

		showFaces: function(chapter) {

			for (var i = 0; i < this.skins.length; i++) {

				if (this.skins[i].chapter === chapter) {

					this.range = (this.skins[i].range) ? this.skins[i].range : null;

					this.showHide(this.skins[i].faces, 1, 'block')

				} else {
					this.showHide(this.skins[i].faces, 0, 'none')
				}

				if (i === this.skins.length - 1) this.post('onLoaded');

			}

		},

		showHide: function(faces, opacity, d) {

			if (faces) {
				for (var i = 0; i < faces.length; i++) {
					faces[i].style.opacity = opacity;
					faces[i].style.display = d;
				}
			}

		},

		addListeners: function() {

		},

		rotate: function(e) {
			/*
			 *
			 */
			this.vec3.set(e.x, e.y, e.z);
			/*
			 *	Rotate cube
			 */
			this.panorama.style[this.prefix + 'Perspective'] = this.fov + 'px';
			this.panorama.style[this.prefix + 'TransformStyle'] = 'preserve-3d';
			/*
			 *	Transform
			 */
			//this.scene.style[this.prefix+'Transform'] = 'translate3d(0px, 0px, '+this.fov+'px)  rotateZ('+(this.vec3.z%3600000)*-1+'deg) rotateX(-90deg) rotateX('+this.vec3.y+'deg) rotateY('+(this.vec3.x*-1)+'deg) rotateY(0deg)';
			this.scene.style[this.prefix + 'Transform'] = 'translate3d(0px, 0px, ' + Math.round(this.fov) + 'px)  rotateZ(' + (this.vec3.z % 3600000) * -1 + 'deg) rotateX(-90deg) rotateX(' + this.vec3.y + 'deg) rotateY(' + (this.vec3.x * -1) + 'deg) rotateY(0deg)';
			/*
			 *
			 */
		}

	}

	return Cube;

});
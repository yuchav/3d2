define([

	'utils.imageloader',
	'pano.ui.view',
	'pano.ui.videoPlayer',
	'utils.log'

], function(Imageloader, View, VideoPlayer, log) {


	/*
	 *
	 *	UPDATE:
	 *	Images are loaded and destroyed when the lightbox is close. Recommend storing the image the data. This need implementing
	 *
	 */

	function LightBox() {

		this.view = document.getElementById('PANO_lightbox');
		// this.lightBoxBg = document.getElementById("PANO_lightbox_bg");
		/*
		 *
		 */
		this.stageImage = document.getElementById('PANO_lb_image_stage');
		this.stageVideo = document.getElementById('PANO_lb_video_stage');
		/*
		 *
		 */
		this.image = document.getElementById('PANO_lb_image');
		this.caption = document.getElementById('PANO_lb_caption');
		this.closeImage = document.getElementById('PANO_lb_image_close');
		this.closeVideo = document.getElementById('PANO_lb_video_close');
		this.tasks = {};
		this.task = null;

		/*
		 *
		 */
		this.isOpen = false;
		/*
		 *
		 */
		this.currentImage = null;
		this.imageCollection = {};
		/*
		 *
		 */
		this.imageLoader = new Imageloader();
		/*
		 *
		 */
		this.videoPlayer = new VideoPlayer();
		/*
		 *
		 */
		var self = this;
		this.closeImage.onclick = function(e) {
			self.exit('image');
			e.stopPropagation();
		}
		this.closeVideo.onclick = function(e) {
			self.exit('video');
			e.stopPropagation();
		}

	}

	LightBox.prototype = new View();

	LightBox.prototype.constructor = LightBox;

	LightBox.prototype.exit = function(type) {
		/*
		 *
		 */
		var self = this;
		/*
		 *
		 */
		self.post('exit', {
			event: 'exit'
		});
		/*
		 *
		 */
		this.isOpen = false;
		/*
		 *
		 */

		// self.lightBoxBg.style.opacity = "0";
		// window.setTimeout(function() {
		// 	self.lightBoxBg.style.zIndex = "-999";
		// }, 500);

		this.view.style.opacity = '0';
		/*
		 *
		 */
		if (type === "image") {
			self.tasks[self.task] = false;
		}
		setTimeout(function() {
			self.view.style.display = 'none';

			if (type === 'image') {
				self.stageImage.style.opacity = '0';
				self.stageImage.style.display = 'none';
			} else if (type === 'video') {
				self.stageVideo.style.opacity = '0';
				self.stageVideo.style.display = 'none';

				//如果是ios 这里就把以前的video删了 然后重新添加进来
				if(version.getSystem().ios || version.getSystem().iphone || version.getSystem().ipad){
					var video = document.getElementById("PANO_lb_video_xiaowei");
					var src = video.src;
					var pic = video.poster;
					$("#PANO_lb_video_xiaowei").remove();
					$("#PANO_lb_video_c").append('<video id="PANO_lb_video_xiaowei" preload="auto" poster="'+ pic +'" src="'+ src +'" controls="controls"></video>');
				}else{
					// if(version.getSystem().android && version.getBrowser().MicroMessenger){
					// 	document.getElementById('PANO_lb_video_c_play').style.display = 'block';
					// }
					var video = document.getElementById("PANO_lb_video_xiaowei");
					video.src = video.src + "?r="+Math.random();
					video.load();
				}

			}

		}, 500);

	}

	LightBox.prototype.open = function(e) {

		var self = this;
		/*
		 *
		 */
		self.post('open', {
			event: 'open'
		});
		/*
		 *
		 */
		this.isOpen = true;
		/*
		 *
		 */
		if (e.getAttribute('data-type') === 'image') {
			/*
			 *
			 */
			$("#PANO_lb_image_stage_img").remove();
			trckingCodeWrap(e.getAttribute('data-tracking'));

			//
			this.loadImage(e.getAttribute('data-media'), e.getAttribute('data-caption'), e.getAttribute('id'))
		} else if (e.getAttribute('data-type') === 'video') {
			trckingCodeWrap(e.getAttribute('data-tracking'));

			this.stageVideo.style.display = 'block';
			//
			this.loadVideo(e.getAttribute('data-media'))
		}
		/*
		 *
		 */
		this.view.style.display = 'table';
		/*
		 *
		 */
		setTimeout(function() {
			self.view.style.opacity = '1';
		}, 50);

	}


	LightBox.prototype.loadImage = function(src, caption, id) {

		var self = this;
		var task = parseInt(Math.random() * 1000000);
		self.task = task;
		self.tasks[self.task] = true;


		self.stageImage.style.display = 'block';
		// self.lightBoxBg.style.zIndex = "9";
		window.setTimeout(function() {
			// self.lightBoxBg.style.opacity = "1";
			self.stageImage.style.opacity = '1';
		}, 50);
		/*
		 *
		 */
		self.caption.innerHTML = '<p>' + caption + '</p>';
		var imageLoaded = function(e) {
			window.setTimeout(function() {
				if (self.tasks[task]) {
					/*
					 *
					 */
					self.currentImage = e.images[0];

					var newimage = e.images[0];
					newimage.className = 'PANO_lb_image_stage_img';
					newimage.id = 'PANO_lb_image_stage_img';
					/*
					 *
					 */
					self.image.appendChild(newimage);
					newimage.style.opacity = '1';
				}

			}, 50);



			/*
			*	Image collection to reuse images instead of loading everytime (Incomplete)
			*
			self.imageCollection[id] = {
				i:e.images[0],
				c:caption
			}
			*/
		}
		/*
		*	Image collection to reuse images instead of loading everytime (Incomplete)
		*
		for(key in self.imageCollection)
		{
			if(key === id){

			}
		}
		/*
		*	Add listener
		*/
		this.imageLoader.removeEventListener('onLoad');
		this.imageLoader.addEventListener('onLoad', imageLoaded);
		this.imageLoader.load([src]);

	}

	LightBox.prototype.loadVideo = function(src) {

		var self = this;
		// self.lightBoxBg.style.zIndex = "9";
		this.stageVideo.style.display = 'block';
		window.setTimeout(function() {
			self.stageVideo.style.opacity = '1';
			// self.lightBoxBg.style.opacity = "1";
		}, 50)

	}
	return LightBox;

});
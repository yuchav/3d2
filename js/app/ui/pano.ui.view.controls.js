define([

	'pano.ui.view',
	'pano.accelerometer',
	'utils.fullBleed',
	'utils.imageloader',
	'utils.log'

],function(View, Accelerometer, FullBleed, Imageloader, log){

	function Controls(user, skins, chapter){

		this.showEnding = false;
		this.user = user;
		this.skins = skins;
		this.prefix = user.prefix.js;
		this.chapter = chapter;
		this.chapters = this.getChapters();
		this.completeChapters = {};
		//
		this.fullBleed = new FullBleed();
		this.imageLoader = new Imageloader();
		this.ending = {};
		//
		this.count = 0;
		this.replayWrap = document.getElementById('PANO_c_replay') || null;
		this.replay = false;
		//
		this.countOutput = document.getElementById('PANO_controls_count') || null;
		this.chapterOutput = document.getElementById('PANO_controls_chapter') || null;
		//
		this.entranceBkgWrap = document.getElementById('PANO_ee_bkg_wrap') || null;
		this.entranceBkg = document.getElementById('PANO_ee_bkg') || null;
		this.replayBkgWrap = document.getElementById('PANO_c_replay_bkg_wrap') || null;
		this.replayBkg = document.getElementById('PANO_c_replay_bkg') || null;
		this.entrenceContent = document.getElementById('PANO_ee_content_wrap_id') || null;
		/*
		*	Control Buttons
		*/
		this.nextChapter = document.getElementById('PANO_c_n') || null;
		this.prevChapter = document.getElementById('PANO_c_p') || null;
		this.replayChapter = document.getElementById('PANO_c_replay_button') || null;
		this.entrance = document.getElementById('PANO_experience_entrance') || null;
		this.entranceBtn = document.getElementById('PANO_experience_entrance_btn') || null;

	}

	Controls.prototype = new View();

	Controls.prototype.constructor = Controls;

	Controls.prototype.init = function(){

		var self = this;
		/*
		*	Make the control background images fullscreen
		*/
		//this.fullBleed.makeFullscreen(this.entranceBkgWrap);
		//this.fullBleed.makeFullscreen(this.entranceBkg);
		//
		//this.fullBleed.makeFullscreen(this.replayBkgWrap);
		//this.fullBleed.makeFullscreen(this.replayBkg);
		/*
		*
		*/
		var imageLoaded = function(e){
			/*
			*	Cache image to body
			*/
			e.images[0].style.display = 'none';
			document.body.appendChild(e.images[0]);
			/*
			*	Set as backgrounds
			*/
			self.entranceBkg.style.backgroundImage = 'url("'+e.images[0].src+'")';
			self.entranceBkg.style.backgroundSize = 'auto 100%';
			self.entranceBkg.style.backgroundPosition = 'center center';
			//
			self.replayBkg.style.backgroundImage = 'url("'+e.images[1].src+'")';
			self.replayBkg.style.backgroundSize = 'auto 100%';
			self.replayBkg.style.backgroundPosition = 'center center';
			/*
			*	Show the entrance button
			*/
			self.entrance.style.opacity = 1;
			/*
			*	Update the chapter control
			*/
			self.update(1, self.chapter, true);
			/*
			*	Add listeners
			*/
			self.addListeners();


			/*
			*
			*	Paralax (Buggy on when applied to replay background)
			*
			*/
			var onMotion = function(e){
				if(lv==1){
					if(self.entranceBkgWrap) self.entranceBkgWrap.style[self.prefix+'Transform'] = 'translateX('+((e.vec3.x*2.5)*-1)+'px) translateY('+(e.vec3.y*2.5)+'px)';
				}
				//if(self.entranceBkgWrap) self.entranceBkgWrap.style[self.prefix+'Transform'] = 'translateX('+((e.vec3.x*2)*-1)+'px) translateY('+(e.vec3.y*2)+'px)';
				//if(self.replayBkgWrap) self.replayBkgWrap.style[self.prefix+'Transform'] = 'translateX('+((e.vec3.x*2)*-1)+'px) translateY('+(e.vec3.y*2)+'px)';

			}
			/*
			*
			*/
			var accelerometer = new Accelerometer(this.user);
			accelerometer.addEventListener('onMotionUpdate', onMotion);


		}
		/*
		*	Add listener
		*/
		this.imageLoader.addEventListener('onLoad', imageLoaded);
		this.imageLoader.load(['img/panorama/lujiazui/mobile_f.jpg','img/panorama/lujiazui/mobile_f.jpg']);

	}



	Controls.prototype.getChapters = function(){

		var c = [];

		for (var i = 0; i < this.skins.length; i++) {
			c.push(this.skins[i].chapter);
		}

		return c;

	}

	Controls.prototype.addListeners = function(){

		var self = this;

		if(this.nextChapter)
		{
			this.nextChapter.onclick = function(e)
			{
				self.update(1, this.getAttribute('data-chapter'));
			}
		}

		if(this.prevChapter)
		{
			this.prevChapter.onclick = function(e)
			{
				self.update(0, this.getAttribute('data-chapter'));
			}
		}

		if(this.replayChapter)
		{
			this.replayChapter.onclick = function(e)
			{

				//tracking
				trcking_ending_review();

				// self.replayBkg.style[self.prefix+'Transform'] = 'scale(1.5, 1.5)';

				self.hideReplay();
				self.initiated = false;
				self.chapter = self.ending;
				self.update(1, self.ending);
			}
		}

		if(this.entranceBtn)
		{
			this.entranceBtn.onclick = function(e)
			{
				// Panorama enter点击数
				trcking_enter();
				/*
				*	Set this as target
				*/
				var target = self.entrance;

				/*
				*	Scale background up
				*/
				// self.entranceBkg.style[self.prefix+'Transform'] = 'scale(1.6, 1.6)';

				window.setTimeout(function(){
					target.style.opacity = '0';
					/*
					*	Post to update the chapter to begin the experience
					*/
					self.post('updateChapter', {chapter:self.chapter, showIntro:self.replay});
				},1400)

				self.entrenceContent.className = self.entrenceContent.className + " intro_content_fadeout";
				self.entranceBkg.className = self.entranceBkg.className + " intro_bg_animate";
				// self.entrenceContent.style.display = "none";
				// self.entrenceContent.style.display = "none";
				/*
				*
				*/
				setTimeout(function(){

					/*
					*	Destroy this
					*/
					document.body.removeChild(target);


				},5000);
			}
		}
	}



	Controls.prototype.showReplay = function(){

		var self = this;

		this.replay = true;

		this.replayWrap.style.display = 'block';

		trcking_ending();

		setTimeout(function(){self.replayWrap.style.opacity = 1}, 100)

	}

	Controls.prototype.hideReplay = function(){

		var self = this;

		self.replayWrap.style.opacity = 0;

		setTimeout(function(){self.replayWrap.style.display = 'none'}, 1000);

	}

	Controls.prototype.updateOutputs = function(){
		/*
		*	Update control output information (section 1/4 and chapter title)
		*/
		for (var i = 0; i < this.chapters.length; i++)
		{
			if(this.chapters[i]===this.chapter)
			{
				this.countOutput.innerHTML = (i+1)+'/'+this.chapters.length
				this.chapterOutput.innerHTML = this.skins[i].details.h;
			}
		}
	}

	Controls.prototype.update = function(next, chapter, noCall){
		/*
		*	Set current chapter
		*/
		if(this.initiated){
			for (var i = 0; i < this.chapters.length; i++) {
				if(this.chapters[i]===this.chapter){
					if(!this.completeChapters[this.chapters[i]]) this.completeChapters[this.chapters[i]] = {};
					this.chapter = (next) ? (this.chapters[i+1] || this.chapters[0]) : (this.chapters[i-1] || this.chapters[this.chapters.length-1])
					break;
				}
			}
		}
		else
		{
			this.initiated = true;
		}

		this.ending = chapter;

		/*
		*	Set control buttons onclick links
		*/
		for (var i = 0; i < this.chapters.length; i++) {
			if(this.chapters[i]===chapter){
				this.count = i+1;
				this.nextChapter.setAttribute('data-chapter', this.chapters[i+1] || this.chapters[0])
				this.prevChapter.setAttribute('data-chapter', this.chapters[i-1] || this.chapters[this.chapters.length-1])
				break;
			}
		}

		/*
		*
		*/
		this.count = 0;
		/*
		*
		*/
		for(key in this.completeChapters)
		{
			this.count++
		}
		/*
		*
		*/
		if(this.count === this.chapters.length && this.showEnding == false)
		{
			this.completeChapters = {};
			//this.replayBkg.style[this.prefix+'Transform'] = 'scale(1, 1)';
			this.showReplay();
			this.showEnding = true;
		}
		else
		{
			if(!noCall) this.post('updateChapter', {chapter:chapter, showIntro:this.replay});
			this.replay = false;
		}

	}


	return Controls

})
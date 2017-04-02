define([

	'pano.ui.view',
	'utils.imageloader',
	'utils.fullBleed',
	'utils.log'

],function(View, Imageloader, FullBleed, log){

	function LoadScreen(user, skins, chapter){

		this.user = user;
		this.skins = skins;
		this.covers = {};
		this.view = document.getElementById('PANO_load');
		this.fullBleed = new FullBleed();
		this.imageLoader = new Imageloader();
		/*
		*	Children
		*/
		this.loadWrap = this.view.querySelector('#PANO_loader');
		this.loadIntro = document.querySelector('#PANO_load_intro');
		this.spinner = this.view.querySelector('.PANO_spinner');
		this.details = this.view.querySelector('.PANO_chapter_details');
		/*
		*	Initiate
		*/
		this.move = false;
		/*
		*
		*/
		this.init();

	}

	LoadScreen.prototype = new View();

	LoadScreen.prototype.constructor = LoadScreen;

	LoadScreen.prototype.init = function(){

		var self = this;
		var images = [];
		/*
		*	Get all cover images and push to the 'images' array
		*/
		for (var i = 0; i < this.skins.length; i++) {
			images.push(this.skins[i].loadingMedia);
		};

		/*
		*	Image loader callback
		*/
		var imageLoaded = function(e){

			for (var i = 0; i < e.images.length; i++) {
				/*
				*	Hide image
				*/
				e.images[i].style.display = 'none';
				/*
				*	Cache image to body
				*/
				document.body.appendChild(e.images[i]);
				/*
				*	Create cover container
				*/
				var cover_container = document.createElement('DIV');
				cover_container.className = 'PANO_LOADING_BG';
				var cover = document.createElement('DIV');
				//	Set the cover's containers dimensions
				self.fullBleed.makeFullscreen(cover);
				//	Set the cover's class name
				cover.className = 'PANO_load_cover';
				//	Apply this image to this cover's background
				cover.style.backgroundImage = 'url("'+e.images[i].src+'")';
				cover.style.backgroundSize = 'auto 100%';
				cover.style.backgroundPosition = 'center center';
				cover_container.style.display = 'none';
				//	Append the cover to this view
				cover_container.appendChild(cover);
				self.view.appendChild(cover_container);
				//	Store the cover in the covers object with a key of this chapter so it's easy to find
				self.covers[self.skins[i].chapter] = cover_container;
			};
			/*
			*	Post that the this class has initialised
			*/
			self.post('initialised', {event:'initialised'});

		}
		/*
		*	Add listener
		*/
		this.imageLoader.addEventListener('onLoad', imageLoaded);
		this.imageLoader.load(images);

	}

	LoadScreen.prototype.hide = function(){
		/*
		*	Set this
		*/
		var self = this;
		/*
		*
		*/
		self.loadIntro.style.display = 'none';
		/*
		*	On animation end event
		*/
		var animationEnd = function(e){
			/*
			*
			*/
			self.move = false;
			//self.view.style.zIndex = '1';
			/*
			*	Tell anyone listening
			*/
			self.post('hideLoad', {event:'hide'});
		}
		/*
		*	Listen to for animation end event
		*/
		this.animationListener(self.view, 'AnimationEnd', animationEnd, self.user.prefix.js);
		/*
		*	Delay introduction
		*/
		setTimeout(function(){
			self.view.className = 'PANO_killLoad';
		}, 1000);

	}

	LoadScreen.prototype.show = function(e){
		/*
		*	Set this
		*/
		var self = this;
		/*
		*	Display the correct cover for this chapter
		*/
		for (var i = 0; i < this.skins.length; i++)
		{
			if(this.skins[i].chapter === e.chapter)
			{
				this.covers[this.skins[i].chapter].style.display = 'block';
			}
			else
			{
				this.covers[this.skins[i].chapter].style.display = 'none';
			}
		}
		/*
		*
		*/
		if(e.showIntro) self.loadIntro.style.display = 'block';
		/*
		*	Bring screen to the front
		*/
		self.view.style.zIndex = '98';
		/*
		*	Update the screen
		*/
		self.updateDetails(e.chapter);
		/*
		*
		*/
		this.move = true;
		/*
		*	On animation end event
		*/
		var animationEnd = function(e){
			/*
			*	Tell anyone listening
			*/
			self.post('showLoad', {event:'show'});
		}
		/*
		*	Listen to for animation end event
		*/
		this.animationListener(self.view, 'AnimationEnd', animationEnd, self.user.prefix.js);
		/*
		*	Delay introduction
		*/
		self.view.className = 'PANO_showLoad';

	}

	LoadScreen.prototype.updateDetails = function(chapter){

		for (var i = 0; i < this.skins.length; i++) {

			if(this.skins[i].chapter === chapter){

				this.details.innerHTML = ''
				this.details.innerHTML += '<h2>'+this.skins[i].details.h+'</h2>';
				this.details.innerHTML += '<div class="line"></div>';
				this.details.innerHTML += '<p>'+this.skins[i].details.p+'</p>';

				break;

			}
		}
	}

	LoadScreen.prototype.update = function(vec3){



	}

	return LoadScreen

})
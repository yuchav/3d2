define([

	'pano.ui.view',
	'pano.ui.lightbox',
	'three.vector3',
	'utils.log'

],function(View, Lightbox, Vector3, log){

	function HotSpots(user, skins, chapter){

		//	User details
		this.user = user;
		//	Skins
		this.skins = skins;
		//	Current Chapter
		this.chapter = chapter;
		//	Faces
		this.faces = {
			n:document.querySelector('#PANO_hs_north'),
			e:document.querySelector('#PANO_hs_east'),
			s:document.querySelector('#PANO_hs_south'),
			w:document.querySelector('#PANO_hs_west'),
			u:document.querySelector('#PANO_hs_up'),
			d:document.querySelector('#PANO_hs_down')
		}
		//	Spot object
		this.spots = {};
		//	Set prefix
		this.prefix = user.prefix.js;
		//
		this.panorama = document.querySelector('#PANO_hot_spots');
		//
		this.scene = document.querySelector('#PANO_hs_scene');
		//
		this.vec3 = new Vector3();
		//
		this.lightbox = new Lightbox();
		//
		this.canClick = false;
		//
		this.addListeners();

	}

	HotSpots.prototype = new View();

	HotSpots.prototype.constructor = HotSpots;

	HotSpots.prototype.hideAll = function(){

		for(key in this.spots){

			for(type in this.spots[key]){

				for (var i = 0; i < this.spots[key][type].length; i++) {
					/*
					*
					*	BUG:
					*	# Some devices refused to render 0 opacity / display none / visibility hidden.
					*	# This may be due to the deveice's memory (?) / CSS bug (?).
					*	# Setting opacity to 0.00001 fixed the issue of being able to hide 3D transform hotSpot content.
					*
					*/
					this.spots[key][type][i].style.opacity = '0.00001';

				}
			}
		}
	}

	HotSpots.prototype.addListeners = function(){

		var self = this;
		var touchPoints = null;
		var r = 30; 	//	range
		var ex = 0;		//	element x
		var ey = 0;		//	element y
		var tx = 0;		//	touched x
		var ty = 0;		//	touched y
		var px = 0;		//	squared x
		var py = 0;		//	squared y
		var h = 99999;	//	hypotenuse

		var eventCatcher = function (e){
			// event.preventDefault();
			if(version.getSystem().ios || version.getSystem().iphone || version.getSystem().ipad){
				// e.preventDefault;
			}else{
				// event.preventDefault();
			}
			//log([e.srcElement.nodeName, e.toElement.getAttribute('id'), e.toElement.getAttribute('class')])

			if(e.type.match(/down|start|click|end/i)){

				if(!self.lightbox.isOpen && self.canClick)
				{
					/*
					*
					*/
					touchPoints = (typeof e.changedTouches !== 'undefined') ? e.changedTouches : [e];
					/*
					*	Get the TAP XY
					*/
					tx = parseInt(touchPoints[0].clientX);
					ty = parseInt(touchPoints[0].clientY);
					/*
					*
					*/
					for(key in self.spots){

						if(key === self.chapter){

							for(type in self.spots[key]){

								for (var i = 0; i < self.spots[key][type].length; i++) {

									if(self.spots[key][type][i].getClientRects()['0'])
									{
										/*
										*	Get the spots XY
										*/
										ex = self.spots[key][type][i].getClientRects()['0'].left;
										ey = self.spots[key][type][i].getClientRects()['0'].top;
										/*
										*	Create box side lengths
										*/
										px = ((ex-tx) < 0) ? (ex-tx)*-1 : (ex-tx);
										py = ((ey-ty) < 0) ? (ey-ty)*-1 : (ey-ty);
										/*
										*	Work out the hypotenuse between the users TAP XY and the current XY position of spot within the window
										*/
										h = Math.sqrt((px*px)+(py*py));
										/*
										*	If the hypotenuse is within the range, trigger this hot spot
										*/
										if(h < r)
										{
											/*
											*	Open the lightbox
											*/
											if(type=="videos"){
												if(false){
												// if(version.getSystem().ios || version.getSystem().iphone || version.getSystem().ipad){
													self.lightbox.openVideo(self.spots[key][type][i].lastChild);
												}else{
													self.lightbox.isOpen = true;
													self.lightbox.open(self.spots[key][type][i].lastChild);
													/*
													*	Reset the hypotenuse to 99999 so it is well out of range
													*/
													h = 99999;
												}
											}else{
												self.lightbox.isOpen = true;
												self.lightbox.open(self.spots[key][type][i].lastChild);
												/*
												*	Reset the hypotenuse to 99999 so it is well out of range
												*/
												h = 99999;
											}

										}
									}
								}
							}
						}
					}
				}
				else
				{
					return false;
				}
			}
			e.stopPropagation();
		}


		if(version.getSystem().ios || version.getSystem().iphone || version.getSystem().ipad){
			window.addEventListener('touchend', eventCatcher, false);
		}else{
			window.addEventListener("click", eventCatcher, false);
		}




		/*
		*
		*/
		var onKillMotion = function(e){
			self.post('killMotion', e);
		}
		/*
		*
		*/
		this.lightbox.addEventListener('exit', onKillMotion)
		this.lightbox.addEventListener('open', onKillMotion)

	}

	HotSpots.prototype.update = function(chapter){
		/*
		*	Hide all spots
		*/
		this.hideAll();
		/*
		*	Hide all spots
		*/
		this.chapter = chapter;
		/*
		*	Check to see if this chapter has spots already
		*/
		if(this.spots[chapter])
		{

			if(this.spots[chapter].images){
				/*
				*	If chapter has spots
				*/
				for (var i = 0; i < this.spots[chapter].images.length; i++) {

					this.spots[chapter].images[i].style.opacity = '1';

				};
			}

			if(this.spots[chapter].videos){
				/*
				*	If chapter has spots
				*/
				for (var i = 0; i < this.spots[chapter].videos.length; i++) {

					this.spots[chapter].videos[i].style.opacity = '1';

				};
			}

		}
		else
		{

			var self = this;

			for (var i = 0; i < this.skins.length; i++)
			{
				if(this.skins[i].chapter === chapter && this.skins[i].hotSpots)
				{
					if(this.skins[i].hotSpots.images){
						/*
						*	Create spots chapter
						*/
						if(!this.spots[chapter]) this.spots[chapter] = {images:[]}
						/*
						*
						*/
						for (var j = 0; j < this.skins[i].hotSpots.images.length; j++) {
							/*
							*
							*/
							var	hs = document.createElement('DIV');
							var	hsr = document.createElement('SPAN');
							var	hsi = document.createElement('SPAN');
							var	hit = document.createElement('A');
							/*
							*	Set id
							*/
							hs.setAttribute('id', this.skins[i].hotSpots.images[j].face+'_image_'+i+''+j);
							/*
							*	Set class
							*/
							hsr.appendChild(hsi);
							hs.appendChild(hsr);
							hs.appendChild(hit);
							/*
							*	Set class
							*/
							hs.className = 'spot_i';
							hsr.className = 'ring_i';
							hsi.className = 'inner_i';
							hit.className = 'hit_i';
							/*
							*
							*/
							hit.setAttribute('id', 'spot'+i+''+j)
							/*
							*	Set position
							*/
							hs.style.left = this.skins[i].hotSpots.images[j].x;
							hs.style.top = this.skins[i].hotSpots.images[j].y;
							/*
							*	Set attribute
							*/
							hit.setAttribute('data-media', this.skins[i].hotSpots.images[j].media)
							hit.setAttribute('data-caption', this.skins[i].hotSpots.images[j].caption)
							hit.setAttribute('data-tracking', this.skins[i].hotSpots.images[j].tracking)
							hit.setAttribute('data-type', 'image')
							/*
							*	Append to parent
							*/
							this.faces[this.skins[i].hotSpots.images[j].face].appendChild(hs);
							/*
							*	Add to spot object
							*/
							this.spots[chapter].images.push(hs);

						}
					}

					if(this.skins[i].hotSpots.videos){
						/*
						*	Create spots chapter
						*/
						if(!this.spots[chapter])
						{
							this.spots[chapter] = {videos:[]}
						}
						else if(!this.spots[chapter].videos)
						{
							this.spots[chapter]['videos'] = [];
						}
						/*
						*
						*/
						for (var j = 0; j < this.skins[i].hotSpots.videos.length; j++) {
							/*
							*
							*/
							var	hs = document.createElement('DIV');
							var	hsr = document.createElement('SPAN');
							var	hsi = document.createElement('SPAN');
							var	hit = document.createElement('A');
							/*
							*	Set id
							*/
							hs.setAttribute('id', this.skins[i].hotSpots.videos[j].face+'_video_'+i+''+j);
							/*
							*	Set class
							*/
							hsr.appendChild(hsi);
							hs.appendChild(hsr);
							hs.appendChild(hit);
							/*
							*	Set class
							*/
							hs.className = 'spot_v';
							hsr.className = 'ring_v';
							hsi.className = 'inner_v';
							hit.className = 'hit_v';
							/*
							*
							*/
							hit.setAttribute('id', 'spot'+i+''+j)
							/*
							*	Set position
							*/
							hs.style.left = this.skins[i].hotSpots.videos[j].x;
							hs.style.top = this.skins[i].hotSpots.videos[j].y;
							/*
							*	Set attribute
							*/
							hit.setAttribute('data-media', this.skins[i].hotSpots.videos[j].media.mp4);
							hit.setAttribute('data-pic', this.skins[i].hotSpots.videos[j].pic);
							hit.setAttribute('data-caption', this.skins[i].hotSpots.videos[j].caption);
							hit.setAttribute('data-tracking', this.skins[i].hotSpots.videos[j].tracking)
							hit.setAttribute('data-type', 'video')
							/*
							*	Append to parent
							*/
							this.faces[this.skins[i].hotSpots.videos[j].face].appendChild(hs);
							/*
							*
							*/
							this.spots[chapter].videos.push(hs);

						}
					}

					break;
				}
			}
		}
	}

	HotSpots.prototype.rotate = function(e){

		/*
		*
		*/
		this.vec3.set(e.x,e.y,e.z);
		/*
		*	Rotate cube
		*/
		this.panorama.style[this.prefix+'Perspective'] = '5000px';
		this.panorama.style[this.prefix+'TransformStyle'] = 'flat';
		/*
		*	Transform
		*/
		this.scene.style[this.prefix+'Transform'] = 'translate3d(0px, 0px, 0px)  rotateZ('+(this.vec3.z%3600000)*-1+'deg) rotateX(-90deg) rotateX('+this.vec3.y+'deg) rotateY('+(this.vec3.x*-1)+'deg) rotateY(0deg)';
		/*
		*
		*/

	}

	return HotSpots

});
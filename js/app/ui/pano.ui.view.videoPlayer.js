define([

	'pano.ui.view',
	'utils.log'

],function(View, log){

	function VideoPlayer(){
		
		this.view = document.getElementById('PANO_video') || null
		this.video = document.getElementById('PANO_video_player') || null

	}

	VideoPlayer.prototype = new View();

	VideoPlayer.prototype.constructor = VideoPlayer;

	VideoPlayer.prototype.addListeners = function(){

		var self = this;

		if(this.video)
		{
			
			var beginFullScreen = function(e){

				log(['beginFullScreen',e])

				//this.post('onVPUpdate', {type:'open'})
				
			}

			var endFullScreen = function(e){

				log(['endFullScreen',e])

				//this.post('onVPUpdate', {type:'close'})
			}

			this.video.addEventListener('webkitbeginfullscreen', beginFullScreen, false);
			this.video.addEventListener('webkitendfullscreen', endFullScreen, false);
		}

	}

	VideoPlayer.prototype.play = function(videoURL){

		var self = this;
		
		this.view.style.display = 'block';

		this.video.setAttribute("src", videoURL);
		this.video.play();
		
		this.video.addEventListener('ended', function()
		{
			self.view.style.display = 'none';
		});

		console.log(videoURL);


	}

	return VideoPlayer;

})



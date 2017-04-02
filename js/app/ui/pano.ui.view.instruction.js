define([

	'pano.ui.view',
	'utils.log'

],function(View, log){

	function InstructionScreen(user){

		this.user = user;
		this.useGyro = null;
		this.view = document.getElementById('PANO_instructions');
		this.viewChildren = {
			gyro:document.getElementById('PANO_instruct_gyro'),
			inertia:document.getElementById('PANO_instruct_inertia'),
			hotspot:document.getElementById('PANO_instruct_hotspot')

		}
	}

	InstructionScreen.prototype = new View();

	InstructionScreen.prototype.constructor = InstructionScreen;

	InstructionScreen.prototype.init = function(useGyro){

		this.view.className = "PANO_instructions_animate";
		/*
		*	What instructions to give
		*/
		this.instructMotion(this.user.gyro && useGyro ? 'gyro': 'inertia')
		/*
		*	Display this view
		*/
		this.view.style.display = 'table';

	}

	InstructionScreen.prototype.instructMotion = function(type){
		/*
		*	Set this
		*/
		var self = this;
		/*
		*	On animation end event
		*/
		var animationEnd = function(e){

			var target = e.target || e.srcElement;

			target.style.display = 'none';

			// self.view.style.display = 'none';

			self.post('hideInstruct', {event:'hide'});

		}
		/*
		*
		*/
		for(key in this.viewChildren){

			if(key===type){
				self.post('showInstruct', {event:'show'});
				this.viewChildren[key].style.display = 'table-cell';
				this.viewChildren[key].className = 'PANO_instructOn';
				this.animationListener(this.viewChildren[key], 'AnimationEnd', animationEnd, this.user.prefix.js);
			}else{
				/*
				*	Hide old
				*/
				this.viewChildren[key].style.display = 'none';
			}
		}
	}

	InstructionScreen.prototype.updateMotion = function(useGyro){
		/*
		*	Update which instructions to give
		*/
		this.instructMotion(useGyro ? 'gyro' : 'inertia');
	}

	return InstructionScreen

})
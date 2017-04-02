define([

	'three.vector3'

],function(Vector3){

	function Accelerometer(){


		//	Vec3
		this.vec3Acc = new Vector3();
		this.vec3AccGrav = new Vector3();
		this.vec3Rotation = new Vector3();
		this.vec3LowPass = new Vector3();
		//
		this.listeners = [];
		//
		this.init();
	}

	Accelerometer.prototype = {
		
		//	Constructor
		constructor: Accelerometer,
		
		//	Initiate
		init: function(){

			var self = this;
			var tc = 0.5;			//	Time delta constant
			var ox = 0;				//	Old X position
			var oy = 0;				//	Old Y position
			var sm = 15;			//	Smoothing
			var x = 0;
			var y = 0;


			var onMotion = function(e){

				self.vec3Acc = (e.acceleration) ? e.acceleration : 0;
				self.vec3AccGrav = (e.accelerationIncludingGravity) ? e.accelerationIncludingGravity : 0;

				if(e.rotationRate){
					self.vec3Rotation.x = e.rotationRate.alpha;
					self.vec3Rotation.y = e.rotationRate.beta;
					self.vec3Rotation.z = e.rotationRate.gamma;
				}else{
					self.vec3Rotation = 0;
				}

				x = self.vec3AccGrav.x;
				y = self.vec3AccGrav.y;

				/*
				*	Low pass filter X
				*/				
				x = ox + (x - ox) / (sm / tc);
				ox = x;
				/*
				*	Low pass filter Y
				*/				
				y = oy + (y - oy) / (sm / tc);
				oy = y;

				self.vec3LowPass.x = x;
				self.vec3LowPass.y = y;


				self.post('onMotionUpdate');

			}
			/*
			*
			*/
			if (window.DeviceMotionEvent) 
			{
  				window.addEventListener('devicemotion', onMotion, false);
  			}
  			else
  			{
  				return false;
  			}

		},

		post:function(type){
			//	For each listener
			for(var i = 0; i < this.listeners.length; i++){

				if(this.listeners[i].type===type){

					switch(type){
						case 'onMotionUpdate':
							this.listeners[i].callback.call(this, {vec3:this.vec3AccGrav});
							break;
						default:
							return false;
							break;
					}
				}
			}
		},

		addEventListener:function(type, callback){
			//	Listener list
			this.listeners.push({
				type:type,
				callback:callback
			});
		},

		removeEventListener:function(type){

			for (var i = 0; i < this.listeners.length; i++) {
				if(this.listeners[i].type===type){
					this.listeners.splice(i,1);
				}
			};
			
		}

	}

	return Accelerometer;

})






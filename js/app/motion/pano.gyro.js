define([

	'three.quaternion',
	'three.matrix4',
	'three.vector3',
	'pano.accelerometer',
	'sylvester',
	'utils.log'

],function(Quarternion, Matrix4, Vector3, Accelerometer, Sylvester, log){

	function toRad(deg){ var radian = (deg*Math.PI) / 180; return radian;}
	function toDeg(rad){ var degree = (rad*180) / Math.PI; return degree;}

	function Gyro(user){

		//	3D Sample
		this.s = document.createElement('DIV');
		//	Sample Matrix
		this.matrix = new Matrix4();
		//	Set co-ords
		this.vec3 = new Vector3();
		//	Orientation
		this.orientation = 0;
		//	Mozilla invert
		this.invert = 1;
		//	Prefix
		this.prefix = user.prefix;
		//
		this.listeners = []
		//	Initiate
		this.init();

	}
	
	Gyro.prototype = {
		
		//	Constructor
		constructor: Gyro,
		
		//	Initiate
		init: function(){

			//	Append the sample to the body
			document.body.appendChild(this.s);
			//	Set the orientation
			this.updateOrientation(null);
			//	Invert mozilla signal
			this.invert = (this.prefix.js.toLowerCase()==='moz') ? -1 : 1;
			//	Start degree check
			this.degree();

		},

		post:function(type){
			//	For each listener
			for(var i = 0; i < this.listeners.length; i++){

				if(this.listeners[i].type===type){

					switch(type){
						case 'onMotionUpdate':
							this.listeners[i].callback.call(this, {orientation:this.orientation, vec3:this.vec3});
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
			
		},

		degree:function(){
			/*
			*
			*/
			var self = this;
			var x = 0;				//	X co-ordinate
			var y = 0;				//	Y co-ordinate
			var z = 0;				//	Z co-ordinate
			var q = {};				//	Quarternion object
			var s = self.s;			//	3D sample
			var lx = 0;				//	Last X
			var rx = 0;				//	Rotations around X
			var tc = 0.5;			//	Time delta constant
			var ox = 0;				//	Old X position
			var oy = 0;				//	Old Y position
			var oz = 0;				//	Old Z position
			var sm = 0;				//	Smoothing
			var ts = [];			//	Timestamp Array
			var td = 0;				//	Timestamp delta
			var ds = [];			//	Timestamp delta list
			var fr = 0;				//	Fail Rate
			var sl = 50;			//	Sampling length
			/*
			*
			*	
			*
			*/
			var updateDegree = function(e){

				//	Set the orientation
				self.updateOrientation(null);

				if(self.orientation==90 || self.orientation==-90){

					self.vec3.set(e.alpha*self.invert, ((e.gamma)*(self.orientation/90)*-1)*self.invert, (e.beta*((self.orientation/90)))*self.invert);

				}else{

					//	Update sample
					s.style[self.prefix.js+'Transform'] = "rotateY(" + -e.gamma + "deg) rotateX(" + e.beta + "deg) rotateZ(" + e.alpha + "deg)";
					//	Get the sample's styles
					var cs = window.getComputedStyle(s, null);
					//	Retrieve matrix3d and split out the individual nodes
					var n = cs.getPropertyValue(self.prefix.css + 'transform').split('(')[1].split(')')[0].split(',');
					//	Update matrix
					self.matrix.set(n[0],n[1],n[2],n[3],n[4],n[5],n[6],n[7],n[8],n[9],n[10],n[11],n[12],n[13],n[14],n[15])
					//	Decompose matrix to get quarternion
					q = self.matrix.decompose()[1];
					//	Set atanX
					var atanX = q.w*q.w - q.x*q.x - q.y*q.y + q.z*q.z
					//	Set pitch from quarternions
					var pitch = Math.atan2(2*(q.y*q.z + q.w*q.x), atanX);
					//	Set X portait
					x = (self.orientation==180) ? e.alpha + -e.gamma : e.alpha + e.gamma
					y = (toDeg(pitch) < 0) ? toDeg(pitch)*-1 : toDeg(pitch)
					z = (toDeg(Math.asin(-2*(q.x*q.z - q.w*q.y))))
					/*
					*	Put X on a linear measurement instead of cirular (e.g. -Infinite <> Infinite and not 0 <> 360):
					*/
					if((lx-x) < -180) // If the lastX - x (current X) is less than -180 (e.g. lastX = 10˚ and x = 350˚)
					{	
						/*
						*	This means that the user if moving to the RIGHT past 2πr
						*/
						rx--;
					}
					else if((lx-x) > 180) // If the lastX - x (current X) is greater than 180 (e.g. lastX = 350˚ and x = 10˚)
					{
						/*
						*	This means that the user if moving to the LEFT past 2πr
						*/
						rx++;
					}
					/*
					*	Delcare previous X before updating
					*/
					lx = x
					/*
					*	Update the X position to x (current X) + (rotationsX * 360)
					*/
					x += (rx*360);
					/*
					*
					*/
					if(sl > 0){
						/*
						*	Collect time stamp
						*/
						ts.unshift(Date.now()/1000);
						/*
						*	If the time stamp list is over the history length, reduce
						*/
						while(ts.length > 5){ ts.pop() }
						/*
						*	Get the time delta 
						*/
						td = (((ts[0]%60) - (ts[ts.length-1]%60))*100).toFixed(1);
						/*
						*	If the time delta is less than 15 (aka more gyro samples per second means the device has an erratic signal), fail the sample data, else success (good signal). Then add result to delta sample.
						*/
						ds.unshift((td <  15) ? 0 : 1);
						/*
						*	If time delta sample (Fail) list is greater than history, reduce
						*/
						while(ds.length > 20){ ds.pop() }
						/*
						*	Reset the fail rate
						*/
						fr = 0;
						/*
						*	Sum up the list
						*/
						for(var i = 0; i < ds.length; i++){
							fr += ds[i];
						}
						/*
						*	If the sum is less than the delta sample length, it need more smoothing as the device has an erratic signal, else the signal is fine to use.
						*/
						((fr/ds.length-1) <  0) ? sm = 25 : sm = 3;
						/*
						*	Reduce sample length. By "sl = 0" the device should be calibrated.
						*/
						sl--;
					}
					/*
					*	Apply Low pass filter X
					*/				
					x = ox + (x - ox) / (sm / tc);
					ox = x;
					/*
					*	Apply Low pass filter Y
					*/				
					y = oy + (y - oy) / (sm / tc);
					oy = y;
					/*
					*	Apply Low pass filter Z
					*/				
					z = oz + (z - oz) / (sm / tc);
					oz = z;
					/*
					*
					*/
					self.vec3.set(x*self.invert, y*self.invert, z*self.invert);

				}
				/*
				*
				*/
				self.post('onMotionUpdate');

			}

			window.addEventListener('deviceorientation', updateDegree, false);

		},

		updateOrientation:function(e){
			//
			var self = this;
			//	Get orientation
			switch(window.orientation) 
			{  
				case -90: 	//	Landscape
					//	Set orientation
					self.orientation = window.orientation;
				break; 
				case 0: 	//	Portrait
					//	Set orientation
					self.orientation = window.orientation;
				break;
				case 90: 	//	Landscape
					//	Set orientation
					self.orientation = window.orientation;
				break;
				case 180: 	//	Portrait
					//	Set orientation
					self.orientation = window.orientation;
				break;
			}
		}
	}

	return Gyro;

})






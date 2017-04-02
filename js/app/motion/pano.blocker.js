define([

	'three.vector3',
	'utils.log'

],function(Vector3, log){

	function Blocker(){

		this.vec3 = new Vector3();
		/*
		*	Ranges LEFT, RIGHT, UP, DOWN
		*/
		this.range = {};
		/*
		*
		*/
		this.rangeSpanX = 80;
		this.rangeSpanY = 180;
		/*
		*
		*/
		this.rangeL = (this.rangeSpanX/2);
		this.rangeR = -(this.rangeSpanX/2);
		/*
		*
		*/
		this.rangeU = 180;
		this.rangeD = 0;
		/*
		*	Range offSets
		*/
		this.offsetX = 0;
		// this.offsetY = 0;
		/*
		*	Previous measurements
		*/
		this.lastX = 0;
		this.lastY = 0;
		/*
		*	Rotations
		*/
		this.rotationsX = 0;
		this.rotationsY = 0;

	}

	Blocker.prototype = {

		constructor: Blocker,

		set:function(e){

			this.rangeSpanX = e.x;
			this.rangeSpanY = e.y;
			//
			this.rangeL = (this.rangeSpanX/2);
			this.rangeR = -(this.rangeSpanX/2);

		},

		block:function (e){
			/*
			*	Put X on a linear measurement instead of cirular (e.g. -Infinite <> Infinite and not 0 <> 360):
			*/
			if((this.lastX-e.x) < -180) // If the lastX - e.x (current X) is less than -180 (e.g. lastX = 10˚ and e.x = 350˚)
			{
				/*
				*	This means that the user if moving to the RIGHT past 2πr
				*/
				this.rotationsX--;
			}
			else if((this.lastX-e.x) > 180) // If the lastX - e.x (current X) is greater than 180 (e.g. lastX = 350˚ and e.x = 10˚)
			{
				/*
				*	This means that the user if moving to the LEFT past 2πr
				*/
				this.rotationsX++;
			}
			/*
			*	Set the new X position to e.x (current X) + (rotationsX * 360)
			*/
			var x = e.x+(this.rotationsX*360)
			/*
			*
			*/
			if(x > this.rangeL){	//	If X is greater than its LEFT range
				/*
				*	Catch offset
				*/
				this.offsetX = x - (this.rangeSpanX/2);
				/*
				*	Update ranges
				*/
				this.rangeL = x;
				this.rangeR = x - this.rangeSpanX;
			}
			else if(x < this.rangeR) { 	//	Else if X is less than its RIGHT range
				/*
				*	Catch offset
				*/
				this.offsetX = x + (this.rangeSpanX/2);
				/*
				*	Update ranges
				*/
				this.rangeL = x + this.rangeSpanX;
				this.rangeR = x;
			}
			/*
			*	Update X
			*/
			x -= this.offsetX;
			/*
			*	Set lastX
			*/
			this.lastX = e.x;
			/*
			*	Put Y on a linear measurement instead of cirular (e.g. -Infinite <> Infinite and not 0 <> 360):
			*/
			if((this.lastY-e.y) < -180) // If the lastY - e.y (current Y) is less than -180 (e.g. lastY = 10˚ and e.y = 350˚)
			{
				/*
				*	This means that the user if moving to the RIGHT past 2πr
				*/
				this.rotationsY--;
			}
			else if((this.lastY-e.y) > 180) // If the lastY - e.y (current Y) is greater than 180 (e.g. lastY = 350˚ and e.y = 10˚)
			{
				/*
				*	This means that the user if moving to the LEFT past 2πr
				*/
				this.rotationsY++;
			}
			/*
			*	Set the new Y position to e.y (current Y) + (rotationsY * 360)
			*/
			var y = e.y+(this.rotationsY*360)
			/*
			*
			*/
			if(y > this.rangeU){	//	If Y is greater than its LEFT range
				/*
				*	Catch offset
				*/
				// this.offsetY = y + 180;
				/*
				*	Update ranges
				*/
				this.rangeU = y;
				this.rangeD = y - this.rangeSpanY;
			}
			else if(y < this.rangeD) { 	//	Else if Y is less than its RIGHT range
				/*
				*	Catch offset
				*/
				// this.offsetY = y;
				/*
				*	Update ranges
				*/
				this.rangeU = y + this.rangeSpanY;
				this.rangeD = y;
			}
			/*
			*
			*/
			// y -= this.offsetY;
			/*
			*	Set lastY
			*/
			if(e.y <= 0) {
				e.y = 0;
			}
			else if(e.y >= 180) {
				e.y = 180;
			}
			this.lastY = e.y;
			/*
			*
			*/
			this.vec3.set(x,y,e.z);
			/*
			*
			*/
			return this.vec3;
		}
	}

	return Blocker;

});



define([


], function(){


	function FullBleed(){

	}

	FullBleed.prototype.constructor = FullBleed;

	FullBleed.prototype.getFullscreen = function(){
		/*
		*	Background image size ratios
		*	@ 	This is not dynamic, update if the background image changes size
		*/
		var ratioW = 1025/740;
		var ratioH = 740/1024;
		//
		var offset = 40;
		var w = 0;
		var h = 0;
		/*
		*
		*/
		if(window.innerWidth*ratioW < window.innerHeight)
		{
			h = window.innerHeight+offset;
			w = (window.innerHeight*ratioH)+offset;
		}
		else
		{
			h = (window.innerWidth*ratioW)+offset;
			w = window.innerWidth+offset;
		}
		/*
		*	Return fullscreen dimensions
		*/
		return {
			w:w,
			h:h
		}
	}

	FullBleed.prototype.makeFullscreen = function(t){
		/*
		*	Get dimensions
		*/
		var fs = this.getFullscreen();
		/*
		*	Apply dimensions
		*/
		t.style.width = fs.w+'px';
		t.style.height = fs.h+'px';
		t.style.marginLeft = -(fs.w/2)+'px';
		t.style.marginTop = -(fs.h/2)+'px';

	}

	return FullBleed;


})



/**
 * lv1
 * @authors xiaowei(619608182@qq.com)
 * @date    2014-04-16 18:04:57
 * @version 1.0
 */


window.onload = function(){
	orientationchange();
	window.onorientationchange = function(){
		orientationchange();
	}
}
function orientationchange(){
	if(window.orientation==0 || window.orientation==180){
		//竖屏
		document.getElementById("horizontal").style.display = 'none';
	}else{
		//横屏
		document.getElementById("horizontal").style.display = 'block';
	}
}



$(function() {
	// if(getLeave()==1){
	// 	slightMovement.initSlightMovement();
	// }

	(function() {
		//设置icon
		var setInt;
		var x = y = y2 = 0;
		setInt = setInterval(function() {
			if (x >= 6) {
				x = 0;
				y = y >= 6 ? 0 : y += 1;
				y2 = y2 >= 10 ? 0 : y2 += 1;
			}
			$("#gory_icon").css("background-position", (-x * 120) + "px " + (-y2 * 120) + "px");
			$("#inertia_icon").css("background-position", (-x * 121) + "px " + (-y * 120) + "px");
			$("#tap_icon").css("background-position", (-x * 120) + "px " + (-y * 120) + "px");
			x++;
		}, 38);
	})();

	setInterval(function() {
		$("#PANO_hot_spots .spot_i SPAN.ring_i,#PANO_hot_spots .spot_v SPAN.ring_v").stop().animate({
			opacity: 0.2
		}, 1000, function() {
			$("#PANO_hot_spots .spot_i SPAN.ring_i,#PANO_hot_spots .spot_v SPAN.ring_v").stop().animate({
				opacity: .9
			}, 1000)
		});
	}, 2000);
});
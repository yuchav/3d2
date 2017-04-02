require.config({

	deps: ['app/pano.index'],

	paths:{
		/*
		*	Library
		*/
		'handlebars':'lib/handlebars-v1.3.0',
		'three.matrix4':'lib/three.matrix4',
		'three.vector3':'lib/three.vector3',
		'three.quaternion':'lib/three.quaternion',
		'sylvester': 'lib/sylvester.src',
		/*
		*	Utilities
		*/
		'utils.imageloader':'utils/utils.imageLoader',
		'utils.log':'utils/utils.logger',
		'utils.requestAnimation':'utils/utils.requestAnimation',
		'utils.animationListener':'utils/utils.animationListener',
		'utils.eventListener':'utils/utils.eventListener',
		'utils.fullBleed':'utils/utils.fullBleed',
		/*
		*	Motion workers
		*/
		'pano.gyro':'app/motion/pano.gyro',
		'pano.accelerometer':'app/motion/pano.accelerometer',
		'pano.inertia':'app/motion/pano.inertia',
		'pano.blocker':'app/motion/pano.blocker',
		/*
		*	Config
		*/
		/*
		*	Panoramic
		*/
		'pano.cube':'app/pano.cube',
		/*
		*	UI
		*/
		'pano.ui':'app/ui/pano.ui',
		'pano.ui.view':'app/ui/pano.ui.view',
		'pano.ui.load':'app/ui/pano.ui.view.load',
		'pano.ui.instructions':'app/ui/pano.ui.view.instruction',
		'pano.ui.hotspots':'app/ui/pano.ui.view.hotspots',
		'pano.ui.videoPlayer':'app/ui/pano.ui.view.videoPlayer',
		'pano.ui.controls':'app/ui/pano.ui.view.controls',
		'pano.ui.lightbox':'app/ui/pano.ui.view.lightbox',
		/*
		*	Tracking
		*/
		'pano.track':'app/tracking/pano.track',
		/*
		*	User support/language/prefix/device detection
		*/
		'pano.userSupport':'app/device/pano.userSupport',
		'pano.language':'app/device/pano.language',
		'pano.deviceDetect':'app/device/pano.deviceDetect',
		'pano.prefix':'app/device/pano.prefix'

	},

	shim: {
		handlebars: {
			exports: 'Handlebars'
		}
	}

})
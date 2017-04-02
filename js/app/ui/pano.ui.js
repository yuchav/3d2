define([

    'pano.ui.view',
    'pano.ui.load',
    'pano.ui.instructions',
    'pano.ui.hotspots',
    'pano.ui.controls',
    'utils.requestAnimation',
    'utils.log'

], function(View, LoadScreen, InstructionScreen, HotSpots, Controls, RequestAnimation, log) {

    function UI() {

        this.user = {};
        this.vec3 = {};
        this.listeners = [];
        this.useGyro = true;
        this.initInstructions = false;
        this.currentSkin = null;

    }

    UI.prototype = new View();

    UI.prototype.constructor = UI;

    UI.prototype.init = function(user, skins, chapter) {
        /*
         *	Set user details
         */
        this.user = user;
        /*
         *
         */
        this.currentChapter = chapter;
        /*
         *	Set views user details
         */
        this.loadScreen = new LoadScreen(user, skins, chapter);
        this.instructionScreen = new InstructionScreen(user);
        this.controls = new Controls(user, skins, chapter);
        this.hotSpots = new HotSpots(user, skins, chapter);
        /*
         *	Is the application using a gyro for motion
         */
        this.useGyro = (user.device.model.toLowerCase() === 'android') ? false : true;
        /*
         *
         */
        if (!user.gyro) document.body.className = 'inertia';
        /*
         *
         */
        this.addListeners();
    }

    UI.prototype.addListeners = function() {
        /*
         *	Set self
         */
        var self = this;
        /*
         *
         */
        var onUpdateChapter = function(e) {
                /*
                 *	Cache skin update
                 */
                self.currentChapter = e.chapter;
                /*
                 *	Prepare load screen
                 */
                self.loadScreen.show(e);
            }
            /*
             *	Add listener
             */
        self.controls.addEventListener('updateChapter', onUpdateChapter);
        /*
         *
         */
        var onShowLoader = function(e) {
            /*
             *	Update hotspots
             */
            self.hotSpots.update(self.currentChapter);
            /*
             *
             */
            self.controls.updateOutputs();
            /*
             *	Post load content
             */
            self.post('updateSkin', self.currentChapter);

        }
        var onHideLoader = function(e) {
            /*
             *
             */
            if (!self.initInstructions) {

                self.instructionScreen.init(self.useGyro);
                self.initInstructions = true;
                window.setTimeout(function() {
                    //第一个图标显示时间,跟css同步
                    self.instructionScreen.instructMotion("hotspot");
                    window.setTimeout(function() {
                        //第二个图标显示时间
                        document.getElementById("PANO_controls").style.opacity = "1";
                        document.getElementById("PANO_hot_spots").style.opacity = "1";
                        document.getElementById("PANO_trackWrap").style.opacity = "1";

                        document.getElementById("PANO_instructions").style.opacity = "0";
                        //X秒后去掉锁屏()正好第二个结束
                        window.setTimeout(function() {
                            document.getElementById("PANO_instructions").style.zIndex = "-10";
                        }, 2000);
                    }, 3200); //debug
                }, 3200); //debug
            }
        }
        var onInitialised = function(e) {

                self.controls.init();

            }
            /*
             *	Add listener
             */
        this.loadScreen.addEventListener('hideLoad', onHideLoader);
        this.loadScreen.addEventListener('showLoad', onShowLoader);
        this.loadScreen.addEventListener('initialised', onInitialised);
        /*
         *
         */
        var onInstructed = function() {
            self.hotSpots.canClick = true;
        }
        self.instructionScreen.addEventListener('hideInstruct', onInstructed);
        /*
         *
         */
        var onKillMotion = function(e) {
                self.post('killMotion', e);
            }
            /*
             *	Add listener
             */
        this.hotSpots.addEventListener('killMotion', onKillMotion);
        this.controls.addEventListener('replayUpdate', onKillMotion);

    }

    UI.prototype.hideLoadScreen = function() {
        this.loadScreen.hide();
    }

    UI.prototype.rotate = function(e) {
        //	Set vec3
        this.vec3 = e;
        //	Update UI track
        document.querySelector('#PANO_track').style[this.user.prefix.js + 'Transform'] = 'rotateX(' + (this.vec3.y - 30) + 'deg) rotate(' + (this.vec3.x % 360) * -1 + 'deg)';
        //	update UI message
        this.loadScreen.update(this.vec3);
        //	update UI hotspots
        this.hotSpots.rotate(this.vec3);
    }

    return UI

})
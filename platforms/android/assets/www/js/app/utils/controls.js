define(function (require) {
    'use strict';

    return (function () {
        var $settings       = $('#settings'),
            $controls       = $('#controls'),
            $playBtn        = $('#play'),
            $incrementBtn   = $('#increment'),
            $decrementBtn   = $('#decrement'),
            $value          = $('#value'),

            maxSpeed        = 10,
            minSpeed        = 1,
            speed,
            timeout,

            showControls = function () {
                $settings.removeClass('d-none');
            },

            initPlayBtnHandler = function () {
                $playBtn.on('click', function () {
                    $playBtn.hasClass('paused') ?
                        Backbone.trigger('play', speed) :
                        Backbone.trigger('stop');
                });
            },

            incrementSpeed = function () {
                if (speed !== maxSpeed) {
                    speed += 0.5;
                    Backbone.trigger('speedChanged', speed);
                }
                clearTimeout(timeout);
                timeout = setTimeout(hideSpeed, 500);
                showSpeed(speed.toFixed(1));
            },

            decrementSpeed = function () {
                if (speed !== minSpeed) {
                    speed -= 0.5;
                    Backbone.trigger('speedChanged', speed);
                }
                clearTimeout(timeout);
                timeout = setTimeout(hideSpeed, 500);
                showSpeed(speed.toFixed(1));
            },

            showSpeed = function (value) {
                $value.addClass('shown');
                $value.find('span').text(value);
            },

            hideSpeed = function (value) {
                $value.removeClass('shown');
            },

            initSpeedHandler = function () {
                $incrementBtn.on('click', incrementSpeed);
                $decrementBtn.on('click', decrementSpeed);
            },

            init = function (options) {
                speed = options.speed;

                initPlayBtnHandler();
                initSpeedHandler();
                showControls();
            };

        return {
            init: init
        }
    })();
});
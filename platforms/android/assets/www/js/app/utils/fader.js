define(function (require) {

    'use strict';

    return (function () {
        var startY      = 0,
            step        = 0,
            value       = 3,
            minVal      = 1,
            maxVal      = 5,

            getStep = function () {
                var windowHeight = window.innerHeight;
                return ((windowHeight - windowHeight * 0.5) / maxVal);
            },

            touchStartHandler = function (e) {
                e.preventDefault();
                startY = e.touches[0].pageY;
                step = getStep();
                value = Number($(this).attr('data-value')) || 3;
                $('#fader-value')
                    .text(value)
                    .show();
            },

            touchMoveHandler = function (e) {
                var y   = e.touches[0].pageY,
                    dl  = startY - y;

                e.preventDefault();

                if (Math.abs(dl) >= step) {
                    if (dl < 0) {
                        if (value === minVal) return;
                        value -= 1;
                    } else {
                        if (value === maxVal) return;
                        value += 1;
                    }
                    startY = y;
                    Backbone.trigger('faderChange', value);
                }
            },

            touchEndHandler = function (e) {
                $('#fader-value').hide();
                this.setAttribute('data-value', value);
            },

            init = function (el) {
                el.addEventListener('touchstart', touchStartHandler);
                el.addEventListener('touchmove', touchMoveHandler);
                el.addEventListener('touchend', touchEndHandler);
            };

        return {
            init: init
        };
    })();
});
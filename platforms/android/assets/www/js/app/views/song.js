define(function (require) {

    'use strict';

    var $                   = require('jquery'),
        _                   = require('underscore'),
        Backbone            = require('backbone'),
        logError            = require('app/utils/error'),
        SongTpl             = require('text!tpl/song.html'),
        Controls            = require('app/utils/controls'),
        Fader               = require('app/utils/fader'),

        $songWrap           = $('#song'),
        $settings           = $('#settings'),
        $controls           = $('#controls'),
        $playBtn            = $('#play'),
        $incrementBtn       = $('#increment'),
        $decrementBtn       = $('#decrement'),
        $fontSizeEl         = $('#font-size'),

        songTpl             = _.template(SongTpl),
        options             = {speed: 1},

        songWrapHeight, $song, songHeight, deltaHeight, playTick, delayedStop;

    var play = function () {
        var that        = this,
            scrollTop   = $songWrap.scrollTop(),
            speed       = options.speed;

        if (scrollTop < deltaHeight) {
            if (delayedStop) clearTimeout(delayedStop);
            $songWrap.scrollTop(scrollTop + 1);
            playTick = setTimeout(function () { play(); }, 180 / speed);
        } else {
            Backbone.trigger('stop');
        }
    },

    stop = function () {
        clearTimeout(playTick);
    },

    calcSongHeight = function () {
        songWrapHeight  = songWrapHeight ? songWrapHeight : $songWrap.height();
        $song           = $song ? $song : $songWrap.find('pre');
        songHeight      = songHeight ? songHeight : $song.height();
        deltaHeight     = songHeight - songWrapHeight;
    };

    Controls.init(options);
    Fader.init($fontSizeEl[0]);

    Backbone.on('faderChange', function (value) {
        $songWrap[0].className = 'fontSize' + value;
    });

    Backbone.on('drawFile', function (that) {
        calcSongHeight();
    });

    Backbone.on('play', function (speed) {
        $playBtn.removeClass('paused');
        options.speed = speed;
        play();
    });

    Backbone.on('stop', function () {
        $playBtn.addClass('paused');
        stop();
    });

    document.addEventListener("pause", function () {
        Backbone.trigger('stop');
    }, false);

    Backbone.on('speedChanged', function (speed) {
        options.speed = speed;
    });

    return Backbone.View.extend({
        initialize: function (item) {
            var that        = this,
                rootPath    = Backbone.app.rootPath,
                item        = item || {},
                path        = item.path ? (rootPath + item.path) : rootPath;

            path = path.replace(/\|/g, '/');

            this.render(path);
        },

        drawFile: function (entry) {
            var that = this;

            entry.file(function (file) {
                var reader = new FileReader();

                reader.onloadend = function (e) {
                    $songWrap.html(songTpl({
                        song: {
                            text: e.target.result
                        }
                    }));
                    Backbone.trigger('drawFile', that);
                }
                reader.readAsText(file);
            }, logError);
        },

        render: function (path) {
            var that = this;

            window.resolveLocalFileSystemURL(path, function (entry) {
                that.drawFile(entry);
            }, logError);
        }
    });
});
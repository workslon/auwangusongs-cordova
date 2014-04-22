define(function (require) {

    'use strict';

    var $                   = require('jquery'),
        _                   = require('underscore'),
        Backbone            = require('backbone'),
        logError            = require('app/utils/error'),
        SongTpl             = require('text!tpl/song.html'),
        SettingsTpl         = require('text!tpl/controls.html'),
        Fader               = require('app/utils/fader'),

        songTpl             = _.template(SongTpl),
        settingsTpl         = _.template(SettingsTpl),

        $songWrap           = $('#song'),
        $controls           = $('#controls'),

        songWrapHeight, $song, songHeight, deltaHeight,
        playTick, delayedStop, $playBtn,
        speed = 3;

    $controls.html(settingsTpl());

    //Fader.init(document.getElementById('font-size-fader'));
    //Fader.init(document.getElementById('speed-fader'));

    Backbone.on('faderChange', function (args) {
        document.getElementById('fader-value').innerHTML = args[0];
        if (args[1] === 'fontSize') {
            document.getElementById('song').className = 'fontSize' + args[0];
        } else {
            speed = args[0];
        }
    });

    Backbone.on('drawFile', function (that) {
        that.drawFileHandler();
    });

    Backbone.on('play', function (that) {
        $playBtn.removeClass('paused');
        that.play();
    });

    Backbone.on('stop', function (that) {
        $playBtn.addClass('paused');
        that.stop();
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

        play: function () {
            var that        = this,
                scrollTop   = $songWrap.scrollTop();

            if (scrollTop < deltaHeight) {
                if (delayedStop) clearTimeout(delayedStop);
                $songWrap.scrollTop(scrollTop + 1);
                playTick = setTimeout(this.play.bind(this), 180 / speed);
            } else {
                Backbone.trigger('stop', that);
            }
        },

        stop: function () {
            clearTimeout(playTick);
        },

        songClickHandler: function () {
            $playBtn.hasClass('paused') ?
                Backbone.trigger('play', this) :
                Backbone.trigger('stop', this);
        },

        drawFileHandler: function () {
            var that = this;

            songWrapHeight  = songWrapHeight ? songWrapHeight : $songWrap.height();
            $song           = $song ? $song : $songWrap.find('pre');
            songHeight      = songHeight ? songHeight : $song.height();
            deltaHeight     = songHeight - songWrapHeight;
            $playBtn        = $playBtn ? $playBtn : $('#play');

            $playBtn.off('click');
            $playBtn.on('click', function () {
                that.songClickHandler();
            });
        },

        showSettings: function (callback) {
            $('#settings').fadeIn();
        },

        hideSettings: function (callback) {
            $('#settings').fadeOut();
        },

        render: function (path) {
            var that = this;

            window.resolveLocalFileSystemURL(path, function (entry) {
                that.drawFile(entry);
            }, logError);
        }
    });
});
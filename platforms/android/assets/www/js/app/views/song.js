define(function (require) {

    'use strict';

    var $                   = require('jquery'),
        _                   = require('underscore'),
        Backbone            = require('backbone'),
        logError            = require('app/utils/error'),
        SongTpl             = require('text!tpl/song.html'),
        SettingsTpl         = require('text!tpl/settings.html'),
        Fader               = require('app/utils/fader'),

        songTpl             = _.template(SongTpl),
        settingsTpl         = _.template(SettingsTpl),

        $songWrap           = $('#song'),
        $settings           = $('#settings'),

        songWrapHeight, $song, songHeight, deltaHeight,
        playTick, delayedStop,
        fontSize = 1,
        speed = 1;

    $('#settings').html(settingsTpl());
    Fader.init(document.getElementById('font-size-fader'));
    Fader.init(document.getElementById('speed-fader'));

    Backbone.on('faderChange', function (value) {
        $('#fader-value').html(value);
    });

    Backbone.on('drawFile', function (that) {
        that.drawFileHandler();
    });

    Backbone.on('play', function (that) {
        $songWrap.addClass('plays');
        that.hideSettings();
        that.play();
    });

    Backbone.on('stop', function (that) {
        $songWrap.removeClass('plays');
        that.showSettings();
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
                playTick = setTimeout(this.play.bind(this), 100);
            } else {
                Backbone.trigger('stop', that);
            }
        },

        stop: function () {
            clearTimeout(playTick);
        },

        songClickHandler: function () {
            $songWrap.hasClass('plays') ?
                Backbone.trigger('stop', this) :
                Backbone.trigger('play', this);
        },

        drawFileHandler: function () {
            var that = this;

            songWrapHeight  = songWrapHeight ? songWrapHeight : $songWrap.height();
            $song           = $song ? $song : $songWrap.find('pre');
            songHeight      = songHeight ? songHeight : $song.height();
            deltaHeight     = songHeight - songWrapHeight;

            $songWrap.on('click', function () {
                that.songClickHandler();
            });
        },

        showSettings: function (callback) {
            callback = callback && typeof callback === 'function' ?
                        callback :
                        function () {};

            $('#settings').fadeIn('slow', callback);
        },

        hideSettings: function (callback) {
            callback = callback && typeof callback === 'function' ?
                        callback :
                        function () {};

            $('#settings').fadeOut('slow', callback);
        },

        render: function (path) {
            var that = this;

            window.resolveLocalFileSystemURL(path, function (entry) {
                that.drawFile(entry);
            }, logError);
        }
    });
});
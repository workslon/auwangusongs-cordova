define(function (require) {

    'use strict';

    var $                   = require('jquery'),
        _                   = require('underscore'),
        Backbone            = require('backbone'),
        logError            = require('app/utils/error'),
        SongTpl             = require('text!tpl/song.html'),
        SettingsTpl         = require('text!tpl/settings.html'),

        songTpl             = _.template(SongTpl),
        settingsTpl         = _.template(SettingsTpl),

        $songWrap           = $('#song'),
        $settings           = $('#settings'),

        songWrapHeight, $song, songHeight, deltaHeight,
        playTick, delayedStop;

    return Backbone.View.extend({

        $settingsEl: $('#settings'),

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
                    Backbone.trigger('drawFile');
                }
                reader.readAsText(file);
            }, logError);
        },

        addSettings: function () {
            $settings.find('ul').html(settingsTpl());
        },

        play: function () {
            var that        = this,
                scrollTop   = $songWrap.scrollTop();

            if (scrollTop < deltaHeight) {
                if (delayedStop) clearTimeout(delayedStop);
                $songWrap.scrollTop(scrollTop + 1);
                playTick = setTimeout(this.play.bind(this), 100);
            }
        },

        pause: function () {
            clearTimeout(playTick);
        },

        render: function (path) {
            var that = this;

            window.resolveLocalFileSystemURL(path, function (entry) {
                that.drawFile(entry);
                that.addSettings();

                Backbone.on('drawFile', function () {
                    songWrapHeight  = songWrapHeight ? songWrapHeight : $songWrap.height();
                    $song           = $song ? $song : $songWrap.find('pre');
                    songHeight      = songHeight ? songHeight : $song.height();
                    deltaHeight     = songHeight - songWrapHeight;

                    $song.on('click', function (){
                        var $t = $(this);

                        if ($t.hasClass('plays')) {
                            that.pause();
                            $t.removeClass('plays');
                        } else {
                            that.play();
                            $t.addClass('plays');
                        }
                    });
                });

            }, logError);
        }
    });
});
define(function (require) {

    'use strict';

    var $                   = require('jquery'),
        _                   = require('underscore'),
        Backbone            = require('backbone'),
        logError            = require('app/utils/error'),
        SongTpl             = require('text!tpl/song.html'),
        SettingsTpl         = require('text!tpl/settings.html'),

        songTpl             = _.template(SongTpl),
        settingsTpl         = _.template(SettingsTpl);

    return Backbone.View.extend({
        $songEl: $('#song'),

        $settingsEl: $('#settings'),

        initialize: function (item) {

            console.log('!!!');


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
                    console.log(e.target.result);

                    that.$songEl.html(songTpl({
                        song: {
                            text: e.target.result
                        }
                    }));
                }
                reader.readAsText(file);
            }, logError);
        },

        render: function (path) {
            var that = this;

            console.log(path)

            window.resolveLocalFileSystemURL(path, function (entry) {
                console.log(entry);
                window.entry = entry;
                that.drawFile(entry);
            }, logError);
        }
    });
});
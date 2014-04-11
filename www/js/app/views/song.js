define(function (require) {

    'use strict';

    var $                   = require('jquery'),
        _                   = require('underscore'),
        Backbone            = require('backbone'),
        SongTpl             = require('text!tpl/song.html'),
        SettingsTpl         = require('text!tpl/settings.html'),

        songTpl             = _.template(SongTpl),
        settingsTpl         = _.template(SettingsTpl);

    return Backbone.View.extend({
        $songEl: $('#song'),

        $settingsEl: $('#settings'),

        initialize: function (fileName) {
            console.log('fileName', fileName.fileName);
            this.render();
        },

        render: function () {
            console.log('currentDir', currentDir);
        }
    });
});
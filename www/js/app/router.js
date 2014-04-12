define(function (require) {

    'use strict';

    var $           = require('jquery'),
        Backbone    = require('backbone');

    return Backbone.Router.extend({

        routes: {
            '': 'home',
            'library': 'library',
            'directories/:path': 'playlist',
            'files/:path': 'song'
        },

        // start screen
        // * library generated and opened
        // * no song, no settings
        home: function () {
            require(['app/views/library'], function (Library) {
                return new Library();
            });
        },

        library: function () {
            require(['app/views/library'], function (Library) {
                return new Library();
            });
        },

        // * library view updated
        // * song view - not
        playlist: function (path) {
            require(['app/views/library'], function (Library) {
                return new Library({path: path});
            });
        },

        // * song updated
        // * library view - not
        song: function (path) {
            require(['app/views/song'], function (Song) {
                return new Song({path: path});
            });
        }

    });
});
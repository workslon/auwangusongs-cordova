define(function (require) {

    'use strict';

    var $           = require('jquery'),
        Backbone    = require('backbone');

    return Backbone.Router.extend({

        routes: {
            '': 'home',
            'library': 'library',
            'directories/:id': 'playlist',
            'files/:id': 'song'
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

            console.log(123);

            require(['app/views/library'], function (Library) {
                return new Library({dirName: ''});
            });
        },

        // * library view updated
        // * song view - not
        playlist: function (id) {
            require(['app/views/library'], function (Library) {
                return new Library({dirName: id});
            });
        },

        // * song updated
        // * library view - not
        song: function () {

        }

    });
});
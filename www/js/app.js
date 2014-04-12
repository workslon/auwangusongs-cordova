require.config({

    baseUrl: 'js/lib',

    paths: {
        app: '../app',
        tpl: '../tpl'
    },

    shim: {
        'backbone': {
            deps: ['underscore', 'jquery'],
            exports: 'Backbone'
        },
        'underscore': {
            exports: '_'
        }
    }
});

require(['jquery', 'backbone', 'app/router'], function ($, Backbone, Router) {
    var router = new Router();

    Backbone.app = { rootPath: 'file:///storage/emulated/0/AuWanGuSongs/' };
    Backbone.history.start();
    keepScreenOn.KeepScreenOn();
    FastClick.attach(document.body);

    $('#list-btn').click(function () { $('#library').toggleClass('visible'); });
    $('#settings-btn').click(function () { $('#settings').toggleClass('visible'); });
    $('#song').click(function () { $('.visible').toggleClass('visible'); });
    $('#song').on('swipeleft', function () { console.log('left ') });
    $('#song').on('swiperight', function () { console.log('right') });
    $('#library').on('click', 'li.file a', function () { $('.visible').toggleClass('visible'); });
});
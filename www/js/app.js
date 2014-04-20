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
    $('#library').on('click', 'li.file a', function () { $('.visible').toggleClass('visible'); });

    // $(document).on('touchmove', function (e) {
    //     var pageY = e.touches[0].pageY;
    //     if () {}
    //     e.preventDefault();
    // });

    // document.addEventListener("touchmove", function (e) {
    //     e.preventDefault();

    //     // if (y === 0) {
    //     //     y = e.touches[0].pageY;
    //     // } else {
    //     //     if ()
    //     // }

    //     // if (y < e.touches[0].pageY) {

    //     // }
    //     // y = e.touches[0].pageY;

    //     console.log(e.touches[0].pageY);
    // }, false);
});
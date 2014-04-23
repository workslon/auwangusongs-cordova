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
    var router      = new Router(),

        listBtn     = document.getElementById('list-btn'),
        $library    = $('#library'),
        $song       = $('#song'),

        hideSidebar = function () {
            $('.visible').toggleClass('visible');
        },

        showSidebar = function () {
            $library.addClass('visible');
        };

    listBtn.addEventListener('touchmove', showSidebar);
    $song.on('click touchmove', hideSidebar);
    $library.on('click', 'li.file a', hideSidebar);

    Backbone.app = { rootPath: 'file:///storage/emulated/0/AuWanGuSongs/' };
    Backbone.history.start();
    keepScreenOn.KeepScreenOn();
    FastClick.attach(document.body);
});
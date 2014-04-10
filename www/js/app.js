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
    Backbone.history.start();

    FastClick.attach(document.body);

    $('#list-btn').click(function () {
        $('#library').toggleClass('visible');
    });

    $('#song').click(function () {
        $('.visible').toggleClass('visible');
    });
});
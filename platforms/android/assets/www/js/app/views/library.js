define(function (require) {

    'use strict';

    var $                   = require('jquery'),
        _                   = require('underscore'),
        Backbone            = require('backbone'),
        logError            = require('app/utils/error'),
        tpl                 = require('text!tpl/library.html'),

        template            = _.template(tpl),
        rootPath            = Backbone.app.rootPath,
        resolveURL          = window.resolveLocalFileSystemURL,
        root, currentDir;

    (function () {
        var onFSSucces  = function (fileSystem) {
            fileSystem.root.getDirectory('AuWanguSongs', {create: true},
            function (directory) {
                root = directory;
                Backbone.trigger('onFSSucces', directory);
            }, logError);
        };

        window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, onFSSucces, logError);
    })();

    return Backbone.View.extend({

        el: document.getElementById('library'),

        initialize: function (item) {
            var that        = this,
                rootPath    = Backbone.app.rootPath,
                item        = item || {},
                path        = item.path ? (rootPath + item.path) : rootPath;

            if (root) {
                that.render(root, path);
            } else {
                Backbone.on('onFSSucces', function (root) {
                    that.render(root, path);
                });
            }
        },

        getDirectory: function (path) {
            resolveURL(path, function (dir) {
                Backbone.trigger('getDirectory', dir);
            });
        },

        getEntries: function (root, dir) {
            root.createReader.call(dir).readEntries(function (entries) {
                Backbone.trigger('getEntries', entries);
            }, logError);
        },

        readEntries: function (entries) {
            var directories = [],
                files       = [],
                items       = [];

            _.each(entries, function (entry) {
                var isDirectory = entry.isDirectory,
                    name        = entry.name[0];

                if (isDirectory && name != '.') {
                    directories.push(entry);
                } else if (name != '.') {
                    files.push(entry);
                }
            });

            items = directories.concat(files);

            this.drawEntries(items);
        },

        drawEntries: function (entries) {
            this.$el.html(template({
                items: entries
            }));
        },

        render: function (root, path) {
            var that = this;

            this.getDirectory(path);

            Backbone.on('getDirectory', function (directory) {
                that.getEntries(root, directory);
            });
            Backbone.on('getEntries', that.readEntries.bind(that));
        }
    });
});
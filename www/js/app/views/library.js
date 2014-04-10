define(function (require) {

    'use strict';

    var $                   = require('jquery'),
        _                   = require('underscore'),
        Backbone            = require('backbone'),
        tpl                 = require('text!tpl/library.html'),

        template            = _.template(tpl),

        root, currentDir;

    (function () {
        var onFSSucces  = function (fileSystem) { console.log(arguments);$(window).trigger('onFSSucces', fileSystem.root); },
            onFSFail    = function () { console.log(arguments);$(window).trigger('onFSFail', arguments); };

        window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, onFSSucces, onFSFail);
    })();

    return Backbone.View.extend({

        el: document.getElementById('library'),

        initialize: function (dirName) {
            var that = this;

            if (typeof dirName !== 'undefined') {

                if (dirName.dirName === '') {
                    currentDir = undefined;
                }

                that.render(root, dirName.dirName);
            } else {
                $(window).bind('onFSSucces', function (e, systemRoot) {
                    that.render(systemRoot, dirName);
                });
            }
        },

        onFSError: function (error) { console.log(error); },

        getDirectory: function (root, dir, targetDirName) {
            root.getDirectory.call(dir, targetDirName, null,
                function () { $(window).trigger('getDir', arguments); },
                function (error) { console.log(error); });
        },

        getParent: function (root, dir) {
            var that = this;
            root.getParent.call(dir,
                function () { $(window).trigger('getParent', arguments); },
                that.onFSError);
        },

        getEntries: function (root, dir) {
            var that = this;
            root.createReader.call(dir).readEntries(function () {
                $(window).trigger('getEntries', arguments);
            }, that.onFSError);
        },

        readEntries: function (e, entries) {
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

        render: function (systemRoot, dirName) {
            var that = this,
                dir;

            root        = systemRoot;
            dir         = currentDir || root;
            dirName     = dirName || 'AuWanGuSongs';

            that.getDirectory(root, dir, dirName);

            $(window).bind('getDir', function (e, dir) {
                currentDir = dir;
                that.getEntries(root, dir);
            });

            $(window).bind('getEntries', that.readEntries.bind(that));
        }
    });
});
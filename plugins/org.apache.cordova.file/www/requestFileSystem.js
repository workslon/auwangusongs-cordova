/*
 *
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 *
*/

var argscheck   = require('cordova/argscheck'),
    FileError   = require('./FileError'),
    FileSystem  = require('./FileSystem'),
    exec        = require('cordova/exec');

/**
 * Request a file system in which to store application data.
 * @param type  local file system type
 * @param size  indicates how much storage space, in bytes, the application expects to need
 * @param successCallback  invoked with a FileSystem object
 * @param errorCallback  invoked if error occurs retrieving file system
 */
var requestFileSystem = function(type, size, successCallback, errorCallback) {
    var fail = function(code) {
        (errorCallback && typeof errorCallback === 'function') && errorCallback(new FileError(code));
    },
    success = function(file_system) {
        if (file_system) {
            if (successCallback && typeof successCallback === 'function') {
                var result = new FileSystem(file_system.name, file_system.root);
                successCallback(result);
            }
        } else {
            fail(FileError.NOT_FOUND_ERR);
        }
    };

    argscheck.checkArgs('nnFF', 'requestFileSystem', arguments);

    if (type < 0) {
        fail(FileError.SYNTAX_ERR);
    } else {
        exec(success, fail, "File", "requestFileSystem", [type, size]);
    }
};

module.exports = requestFileSystem;
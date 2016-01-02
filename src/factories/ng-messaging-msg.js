/**
 * Manages all notification systems.
 */
angular.module('ngMessaging').factory('NgMessagingMessage', [
    function () {
        'use strict';
        
        var ids = [], Message;

        Message = function (args) {
            if (angular.isString(args)) {
                args = {
                    msg: args
                };
            }
            
            this.id = args.id || this.createId();
            this.msg = args.msg;
            this.time = args.time || Date.now();
        };
        
        Message.prototype.createId = function () {
            var id = 0;
            
            while (ids.indexOf(id) !== -1) {
                id += 1;
            }
            
            ids.push(id);
            return id;
        };
        
        return Message;
    }
]);

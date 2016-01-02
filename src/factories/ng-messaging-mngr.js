/**
 * Manages all notification systems.
 */
angular.module('ngMessaging').factory('ngMessagingManager', [
    'ngMessaging',
    'NgMessagingMessage',
    function (ngMessaging, NgMessagingMessage) {
        'use strict';

        var mngr = {},
            channels = {};
        
        function channelExists(id) {
            return (channels[id] !== undefined);
        }
        
        mngr.addChannel = function (id) {
            if (!channelExists(id)) {
                channels[id] = [];
            }
        };
        
        mngr.addMsg = function (args) {
            if (args && args.channel && channelExists(args.channel)) {
                ngMessaging(args).then(function (data) {
                    console.log(data);
                    //channels[id].push(new NgMessagingMessage(data));
                }, function (error) {
                    console.log('bad');
                });
                
                return true;
            }
            
            return false;
        };
        
        return mngr;
    }
]);

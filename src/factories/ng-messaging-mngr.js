/**
 * Manages all notification systems.
 */
angular.module('ngMessaging').factory('ngMessagingManager', [
    'NgMessagingMessage',
    '$q',
    function (NgMessagingMessage, $q) {
        'use strict';

        var mngr = {},
            channels = {},
            messageHandler = function (args) {
                return $q.reject("Message handler not set up.");
            };
        
        function channelExists(id) {
            return (channels[id] !== undefined);
        }
        
        mngr.addChannel = function (id) {
            if (!channelExists(id)) {
                channels[id] = [];
            }
        };
        
        mngr.getChannelMsgs = function (id) {
            if (channelExists(id)) {
                return channels[id];
            }
            
            return [];
        };
        
        mngr.addMsg = function (args) {
            if (args && args.channel && channelExists(args.channel)) {
                var deferred = messageHandler(args).then(function (data) {
                    channels[args.channel].push(new NgMessagingMessage(data));
                });
                
                return deferred;
            }
            
            return $q.reject("Channel does not exist.");
        };
        
        mngr.setMessageHandler = function (newHandler) {
            messageHandler = newHandler;
        };
        
        return mngr;
    }
]);

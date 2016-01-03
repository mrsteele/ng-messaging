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
            },
            syncHandler = function (args) {
                return $q.reject("Sync handler not set up.");
            };
        
        mngr.setMessageHandler = function (newHandler) {
            messageHandler = newHandler;
        };
        
        mngr.setSyncHandler = function (newHandler) {
            syncHandler = newHandler;
        };
        
        function channelExists(id) {
            return (channels[id] !== undefined);
        }
        
        mngr.addChannel = function (id) {
            if (!channelExists(id)) {
                channels[id] = [];
                return mngr.syncChannel(id);
            }
            
            return $q.resolve(channels[id]);
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
        
        mngr.syncChannel = function (channel) {
            var i, ret;
            
            if (channel) {
                if (!channelExists(channel)) {
                    mngr.addChannel(channel);
                }
                ret = syncHandler(channel).then(function (data) {
                    channels[channel] = [];
                    if (data && data.length > 0) {
                        for (i = 0; i < data.length; i += 1) {
                            channels[channel].push(new NgMessagingMessage(data[i]));
                        }
                        return channels[channel];
                    }
                });

                return ret;
            } else {
                ret = [];
                for (i in channels) {
                    if (channels.hasOwnProperty(i)) {
                        ret.push(mngr.syncChannel(i));
                    }
                }
                
                return ret;
            }
        };
        
        return mngr;
    }
]);

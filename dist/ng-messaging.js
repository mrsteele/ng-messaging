/*! ng-messaging 2016-01-02 */
angular.module('ngMessaging', ['ui.bootstrap']);

/**
 * Shows a simple alert total.
 * @param {Bool=} badge - To show the number as a badge.
 * @param {Bool=} hide-empty - To not display anything if the number is 0.
 */
angular.module('ngMessaging').directive('ngMessagingArea', [
    'ngMessagingManager',
    function (
        ngMessagingManager
    ) {
        'use strict';
    
        return {
            replace: true,
            transclude: true,
            scope: {
                channel: '@'
            },
            templateUrl: 'template/ng-messaging/messaging-area.html',
            link: function ($scope, $element, $attrs) {
                
                $scope.closeError = function () {
                    $scope.error = "";
                };
                
                $scope.submit = function () {
                    $scope.error = "";
                    $scope.submitting = true;
                    var deferred = ngMessagingManager.addMsg($scope);
                    deferred.then(function () {
                        $scope.msg = "";
                    }, function (error) {
                        $scope.error = error;
                    }).then(function () {
                        $scope.submitting = false;
                    });
                };
            }
        };
    }
]);

/**
 * Shows a simple alert total.
 * @param {Bool=} badge - To show the number as a badge.
 * @param {Bool=} hide-empty - To not display anything if the number is 0.
 */
angular.module('ngMessaging').directive('ngMessagingList', [
    'ngMessagingManager',
    function (
        ngMessagingManager
    ) {
        'use strict';
    
        return {
            replace: true,
            transclude: true,
            scope: {
                title: '@',
                channel: '@'
            },
            templateUrl: 'template/ng-messaging/messaging-list.html',
            link: function ($scope, $element, $attrs) {
                
                ngMessagingManager.addChannel($attrs.channel).then(function (data) {
                    $scope.msgs = data;
                }, function (error) {
                    console.log(error);
                });
                
                $scope.getTime = function (time) {
                    var d = new Date(time);
                    
                    // @TODO: Make this a provider!!!
                    return (d.getMonth() + 1) + '/' + d.getDate() + '/' + d.getFullYear();
                };
                
                $scope.$watch(function () {
                    return ngMessagingManager.getChannelMsgs($attrs.channel);
                }, function (data) {
                    $scope.msgs = data;
                });
            }
        };
    }
]);

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
angular.module('ngMessaging').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('template/ng-messaging/messaging-area.html',
    "<form ng-class=\"{'has-error': error.length}\">\r" +
    "\n" +
    "    <textarea ng-model=\"msg\" class=\"ng-messaging-area form-control\" ng-disabled=\"submitting\"></textarea>\r" +
    "\n" +
    "    <div class=\"help-block\" ng-show=\"error.length\">{{error}}</div>\r" +
    "\n" +
    "    <button class=\"btn\" ng-click=\"submit()\" ng-disabled=\"submitting\">Submit</button>\r" +
    "\n" +
    "</form>\r" +
    "\n"
  );


  $templateCache.put('template/ng-messaging/messaging-list.html',
    "<table class=\"table table-bordered messaging-list messaging-list-{{channel}}\">\r" +
    "\n" +
    "    <thead ng-show=\"title\">\r" +
    "\n" +
    "        <tr>\r" +
    "\n" +
    "            <th>{{title}}</th>\r" +
    "\n" +
    "        </tr>\r" +
    "\n" +
    "    </thead>\r" +
    "\n" +
    "    <tbody ng-show=\"msgs.length > 0\">\r" +
    "\n" +
    "        <tr ng-repeat=\"msg in msgs\">\r" +
    "\n" +
    "            <td>\r" +
    "\n" +
    "                {{msg.msg}}\r" +
    "\n" +
    "                <br clear=\"all\" />\r" +
    "\n" +
    "                <small class=\"text-muted pull-right\">\r" +
    "\n" +
    "                    Posted at {{getTime(msg.time)}}\r" +
    "\n" +
    "                </small>\r" +
    "\n" +
    "            </td>\r" +
    "\n" +
    "        </tr>\r" +
    "\n" +
    "    </tbody>\r" +
    "\n" +
    "    <tbody ng-show=\"msgs.length === 0\">\r" +
    "\n" +
    "        <tr>\r" +
    "\n" +
    "            <td class=\"text-muted\">\r" +
    "\n" +
    "               No messages.\r" +
    "\n" +
    "            </td>\r" +
    "\n" +
    "        </tr>\r" +
    "\n" +
    "    </tbody>\r" +
    "\n" +
    "</table>"
  );

}]);

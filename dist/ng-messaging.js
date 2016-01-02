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
            templateUrl: 'template/ng-messaging/messaging-area.html',
            link: function ($scope, $element, $attrs) {
                
                $scope.channel = $attrs.channel;
                
                $scope.closeError = function () {
                    $scope.error = "";
                };
                
                $scope.submit = function () {
                    $scope.error = "";
                    var deferred = ngMessagingManager.addMsg($scope);
                    deferred.then(function () {
                        $scope.msg = "";
                    }, function (error) {
                        $scope.error = error;
                    });
                };
//                
//                ngMessagingManager.addArea($scope);
//                $scope.$on('$destroy', function () {
//                    ngMessagingManager.removeArea($scope);
//                });
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
            templateUrl: 'template/ng-messaging/messaging-list.html',
            link: function ($scope, $element, $attrs) {
                ngMessagingManager.addChannel($attrs.channel);
                
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
    "<div ng-class=\"{'has-error': error.length}\">\r" +
    "\n" +
    "    <textarea ng-model=\"msg\" class=\"ng-messaging-area form-control\"></textarea>\r" +
    "\n" +
    "    <div class=\"help-block\" ng-show=\"error.length\">{{error}}</div>\r" +
    "\n" +
    "    <button class=\"btn\" ng-click=\"submit()\">Submit</button>\r" +
    "\n" +
    "</div>\r" +
    "\n"
  );


  $templateCache.put('template/ng-messaging/messaging-list.html',
    "<ul>\r" +
    "\n" +
    "    <li ng-repeat=\"msg in msgs\">{{msg}}</li>\r" +
    "\n" +
    "</ul>"
  );

}]);

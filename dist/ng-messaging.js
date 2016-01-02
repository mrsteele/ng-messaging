/*! ng-messaging 2016-01-02 */
angular.module('ngMessaging', ['ui.bootstrap'])

    .provider('ngMessaging', function () {
        'use strict';
    
        var ret;

        this.setMessageHandler = function (newHandler) {
            ret = newHandler;
        };

        this.$get = [
            '$q',
            '$timeout',
            function ($q, $timeout) {
                if (ret) {
                    return ret;
                } else {
                    return function (args) {
                        var defferred = $q.defer();
                        $timeout(function () {
                            defferred.resolve({
                                msg: args.msg
                            });
                        })
                        return defferred.promise;
                    };
                }
            }
        ];
    });

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
                $scope.submit = function () {
                    ngMessagingManager.addMsg($scope);
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
            
            return id;
        };
        
        return Message;
    }
]);
angular.module('ngMessaging').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('template/ng-messaging/messaging-area.html',
    "<div>\r" +
    "\n" +
    "    <textarea ng-model=\"msg\" class=\"ng-messaging-area form-control\"></textarea>\r" +
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

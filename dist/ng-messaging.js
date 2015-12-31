/*! ng-messaging 2015-12-31 */
angular.module('ngMessaging', []);

/**
 * Shows a simple alert total.
 * @param {Bool=} badge - To show the number as a badge.
 * @param {Bool=} hide-empty - To not display anything if the number is 0.
 */
angular.module('ngMessaging').directive('ngMessagingArea', [
    function () {
        'use strict';
    
        return {
            replace: true,
            transclude: true,
            templateUrl: 'template/ng-messaging/messaging-area.html',
            link: function ($scope, $element, $attrs) {
                
            }
        };
    }
]);
angular.module('ngMessaging').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('template/ng-messaging/messaging-area.html',
    "<textarea class=\"ng-messaging-area form-control\"></textarea>\r" +
    "\n"
  );

}]);

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

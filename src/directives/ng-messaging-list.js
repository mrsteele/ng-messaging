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
                ngMessagingManager.addChannel($attrs.channel).then(function (data) {
                    $scope.msgs = data;
                }, function (error) {
                    console.log(error);
                });
                
                $scope.$watch(function () {
                    return ngMessagingManager.getChannelMsgs($attrs.channel);
                }, function (data) {
                    $scope.msgs = data;
                });
            }
        };
    }
]);

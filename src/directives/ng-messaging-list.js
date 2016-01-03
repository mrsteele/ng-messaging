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

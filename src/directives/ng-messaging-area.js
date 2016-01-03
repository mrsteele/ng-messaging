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
//                
//                ngMessagingManager.addArea($scope);
//                $scope.$on('$destroy', function () {
//                    ngMessagingManager.removeArea($scope);
//                });
            }
        };
    }
]);

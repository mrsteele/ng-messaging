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
                        });
                        return defferred.promise;
                    };
                }
            }
        ];
    });

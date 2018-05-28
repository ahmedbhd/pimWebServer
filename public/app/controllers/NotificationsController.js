
window.angular.module('NotificationsController', [
    'angular-web-notification'
]).controller('NotificationsController', ['$scope', function ($scope) {
    'use strict';

    $scope.title = 'Activate Abonnement';
    $scope.text = 'Please I want to suscribe to silver Package';
}]).directive('showButton', ['webNotification', function (webNotification) {
    'use strict';

    return {
        restrict: 'C',
        scope: {
            notificationTitle: '=',
            notificationText: '='
        },
        link: function (scope, element) {
            element.on('click', function onClick() {
              
            });
        }
    };
}]);

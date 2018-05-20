angular.module('userApp', ['btford.socket-io','appRoutes', 'userControllers', 'userServices', 'ngAnimate', 'mainController', 'authServices', 'emailController', 'managementController', 'abonnementController', 'managementeController', 'abonnementServices', 'chaineServices', 'ng-fusioncharts', 'historyServices', 'historyController'])


.config(function($httpProvider) {
    $httpProvider.interceptors.push('AuthInterceptors');
});

angular.module('angularTable', ['angularUtils.directives.dirPagination']);



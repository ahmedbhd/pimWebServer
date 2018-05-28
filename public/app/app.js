angular.module('userApp', ['appRoutes', 'userControllers', 'userServices', 'ngAnimate', 'mainController', 'authServices', 'emailController', 'managementController', 'abonnementController', 'managementeController', 'abonnementServices', 'chaineServices', 'historyServices', 'historyController', 'ui.bootstrap', 'NotificationsController', 'recepteurController', 'recepteurServices'])


.config(function($httpProvider) {
    $httpProvider.interceptors.push('AuthInterceptors');
});

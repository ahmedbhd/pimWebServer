angular.module('abonnementServices', [])
.factory('Abonnement', function($http) {
    var abonnementFactory = {};

     abonnementFactory.getAbonnements = function() {
        return $http.get('/api/managementabonnement/');
    };

    return abonnementFactory;

 });

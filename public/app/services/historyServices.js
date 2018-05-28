angular.module('historyServices', [])
.factory('History', function($http) {
    var historyFactory = {};

     historyFactory.getHistorys = function() {
        return $http.get('/api/h/');
    };

    return historyFactory;

 });

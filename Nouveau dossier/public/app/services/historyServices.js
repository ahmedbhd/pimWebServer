angular.module('historyServices', [])
/* .factory('History', function($http) {
    var historyFactory = {};

     historyFactory.getHistory = function() {
        return $http.get('/api/managementhistory/');
    };

    return historyFactory;

 });
 */

.factory('History', ['socketFactory',function(socketFactory){
    return socketFactory();
}])
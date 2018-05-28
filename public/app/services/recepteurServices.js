angular.module('recepteurServices', [])
.factory('Recepteur', function($http) {
    var recepteurFactory = {};

     recepteurFactory.getRecepteurs = function() {
        return $http.get('/api/managementrecepteur/');
    };

    recepteurFactory.getChaine = function(id) {
    	return $http.get('/api/editRecepteur/' + id);
    }
     
    recepteurFactory.deleteChaine = function(recepteur) {
        return $http.delete('/api/managementrecepteur/' + recepteur);
    };
    
    recepteurFactory.getStat = function(){
       return $http.get('/api/managementrecepteur/');
    };
    
    recepteurFactory.create = function(){
        return $http.post('/api/recepteurs/');
    }

    return recepteurFactory;

 });



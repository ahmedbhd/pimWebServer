angular.module('chaineServices', [])
.factory('Chaine', function($http) {
    var chaineFactory = {};

     chaineFactory.getChaines = function() {
        return $http.get('/api/managemente/');
    };

    chaineFactory.getChaine = function(id) {
    	return $http.get('/api/editChaine/' + id);
    }
     
    chaineFactory.deleteChaine = function(nomchaine) {
        return $http.delete('/api/managemente/' + nomchaine);
    };
    
    chaineFactory.getStat = function(){
       return $http.get('/api/managemente/');
    };


    return chaineFactory;

 });

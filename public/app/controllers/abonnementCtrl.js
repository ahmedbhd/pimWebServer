angular.module('abonnementController', [])
.controller('abonnementCtrl', function(Abonnement, User) {
   var app = this;
   
  
  
  

   function getAbonnements(){


   Abonnement.getAbonnements().then(function(data) {
      
      if (data.data.success) {
        app.abonnements = data.data.abonnements;
       
       
      }else {
                app.errorMsg = data.data.message; // Set error message
                
           
            }
       
        
        
        //common error function
    
    
   });
    }

    getAbonnements();
  

    app.showMore = function(number) {
        app.showMoreError = false; // Clear error message
        // Run functio only if a valid number above zero
        if (number > 0) {
            app.limit = number; // Change ng-repeat filter to number requested by user
        } else {
            app.showMoreError = 'Please enter a valid number'; // Return error if number not valid
        }
    };

    // Function: Show all results on page
    app.showAll = function() {
        app.limit = undefined; // Clear ng-repeat searchLimit
        app.showMoreError = false; // Clear error message
    };




});


  var abonnementCtrl = function ($scope, $http){
	var onError = function (error) {
            $scope.error = error.data;
        };
        //end error function

        //get all persone
    	var onAbonnementGetCompleted = function(response){
    		$scope.abonnements = response.data;
            console.log($scope.abonnements);
    	}
    	
    	 var refresh = function(){
        	$http.get('/managementabonnement')
        		.then(onAbonnementGetCompleted, onError);
        	console.log('Response received...');
        }

        refresh();

     
         var onGetByIdCompleted = function(response){
            $scope.abonnement = response.data;
            console.log(response.data);
        };

        $scope.searchAbonnement = function(id){
            $http.get('/abonnement/' + id)
                    .then(onGetByIdCompleted, onError);
            console.log(id);
        };

        var onAddAbonnementCompleted = function(response){
            $scope.abonnement = response.data;
            console.log(response.data);
            refresh();
        };
        $scope.addAbonnement = function(abonnement){
            $http.post('/addAbonnement', abonnement)
                    .then(onAddAbonnementCompleted, onError);
            console.log(abonnement);
        };

        
        //end delete person

        //update person
        $scope.updateAbonnement = function(abonnement){
            $http.put("/updateAbonnement", abonnement)
                .then(onUpdateAbonnementCompleted, onError);
                    console.log(abonnement);
        };

        var onUpdateAbonnementCompleted = function(response){
            $scope.abonnement = null;//response.data;
            console.log(response.data);
            refresh();
        };

        }
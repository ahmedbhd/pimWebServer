angular.module('managementeController', ['angularUtils.directives.dirPagination', 'ui.bootstrap', 'ui-notification'])

.controller('managementeCtrl',  function(Chaine, User, $scope, $window, $filter, $http, uploadFile, $timeout, $uibModal, $log, Notification, $interval) {

    var app = this;
    //var modalInstance = null;
     $scope.chaines = []; 
    $scope.labels = ["Agree", "Disagree"];
    $scope.data = [];
    $scope.file = {};

    $scope.Submit = function(){
     
     uploadFile.upload($scope.file).then(function(data) {
       if (data.data.success){
           $scope.file = {};
       } else {
        $scope.file = {};
       }
     });
    };

    $scope.photoChanged = function(files, index) {
        if (files.length > 0 && files[0].name.match(/\.(png|jpeg|jpg)$/)) {
            $scope.uploading = true;
            var file = files[0];
            var index = this.$index;
            var fileReader = new FileReader();
            fileReader.readAsDataURL(file);
            fileReader.onload = function(e) {
                $timeout(function() {
                    $scope.thumbnail = {};
                    $scope.thumbnail[index] = {dataUrl: e.target.result};
                    $scope.uploading = false;
                    $scope.message = false;
                });
            };
        } else {
            $scope.thumbnail = {};
            $scope.message = false;
        }
    }


    $scope.sort = function(keyname){
      $scope.sortKey = keyname;
      $scope.reverse = !$scope.reverse;
    };    

    app.buildPager = buildPager;
    app.figureOutItemsToDisplay = figureOutItemsToDisplay;
    app.pageChanged = pageChanged;
    // Start loading icon on page load
    app.accessDenied = true; // Hide table while loading
    app.errorMsg = false; // Clear any error messages
    app.editAccess = false; // Clear access on load
    app.deleteAccess = false; // CLear access on load
    app.limit = 5; // Set a default limit to ng-repeat
    app.searchLimit = 0; // Set the default search page results limit to zero

    function buildPager() {
      app.pagedItems = [];
      app.currentPage = 1;
      app.figureOutItemsToDisplay();
    }
      


    function figureOutItemsToDisplay() {
      app.filteredItems = $filter('filter')(app.chaines, {
        $: app.test
      });
      app.filterLength = app.filteredItems.length;
      var begin = ((app.currentPage - 1) * app.itemsPerPage);
      var end = begin + app.itemsPerPage;
      app.pagedItems = app.filteredItems.slice(begin, end);
    }

    function pageChanged() {
      app.figureOutItemsToDisplay();
    } 



    function getStat(){
      Chaine.getStat().then(function(data, res){

      

   
     $scope.chaines = res.chaines;

     // populate post.data
     $scope.chaines.forEach(function(chaine) {
        chaine.data = [chaine.nomchaine, chaine.nb_tele];
     });
      });
   }
  
  function getChaines() {
  

      Chaine.getChaines().then(function(data) {
       
   
       
        // Check if able to get data from database
            if (data.data.success ) {
                           app.chaines = data.data.chaines;
                           console.log(data);
         
      app.buildPager();
                
            } else {
                app.errorMsg = data.data.message; // Set error message
                 // Stop loading icon
           
            }
        });

 }
 getChaines();

    $scope.loadData = function () {
      getChaines();
  };
    
    this.modalUpdate = function(size, selectedChaine) {
      var uibModalInstance = $uibModal.open({
        templateUrl: 'app/views/pages/managemente/seuilChaine.html',
        controller : function($scope, $uibModalInstance, chaine) {
          $scope.chaine = chaine;

          $scope.ok = function() {
            $uibModalInstance.close($scope.chaine);
          };

          $scope.cancel = function() {
            $uibModalInstance.dismiss('Cancel');
          };
        },
        size : size,
        resolve : {
          chaine: function() {
            return selectedChaine;
          }
        }
      });

      uibModalInstance.result.then(function (selectedItem) {
        $scope.selected = selectedItem;
      }, function() {
        $log.info('Modal dismissed at : ' + new newDate());
      });
    };

     this.modalSeuil = function(size, selectedChaine) {
      var uibModalInstance = $uibModal.open({
        templateUrl: 'app/views/pages/managemente/activerSeuil.html',
        controller : function($scope, $uibModalInstance, chaine) {
          $scope.chaine = chaine;

          $scope.ok = function() {
            $uibModalInstance.close($scope.chaine);
          };

          $scope.cancel = function() {
            $uibModalInstance.dismiss('Cancel');
          };

          $scope.activer = function(recepteur) {
         
              if($scope.seuil >= 2000){
                Notification.success({message: 'Channel atteint' + ' ' + $scope.seuil + ' ' + 'Vues'});
              }$interval(function() {
                 Notification.success({message: 'Channel atteint' + ' ' + $scope.seuil + ' ' + 'Vues'});
            }, 9000);

          };
          
        
          $scope.desactiver = function() {
             Notification.error({message: 'Seuil Desactive', delay: 8000});
          };
        },
        size : size,
        resolve : {
          chaine: function() {
            return selectedChaine;
          }
        }
      });

      uibModalInstance.result.then(function (selectedItem) {
        $scope.selected = selectedItem;
      }, function() {
        $log.info('Modal dismissed at : ' + new newDate());
      });
    };

     // Function: Show more results on page
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
        app.showMoreError = false; 

    };
   

    app.Create = function () {
      Chaine.create().then(function(data) {
    
            // Check if able to delete user
            if (data.data.success) {
                getChaines(); // Reset users on page
              console.log(data);
            } else {
                app.showMoreError = data.data.message;
            // Set error message
            }
          
        });
     
 };

     app.deleteChaine = function(nomchaine) {
        // Run function to delete a user
        Chaine.deleteChaine(nomchaine).then(function(data) {
    
            // Check if able to delete user
            if (data.data.success) {
                getChaines(); // Reset users on page
               

            } else {
                app.showMoreError = data.data.message;
            // Set error message
            }
          
        });

    };

     app.search = function(searchKeyword, number) {
        // Check if a search keyword was provided
        if (searchKeyword) {
            // Check if the search keyword actually exists
            if (searchKeyword.length > 0) {
                app.limit = 0; // Reset the limit number while processing
                $scope.searchFilter = searchKeyword; // Set the search filter to the word provided by the user
                app.limit = number; // Set the number displayed to the number entered by the user
            } else {
                $scope.searchFilter = undefined; // Remove any keywords from filter
                app.limit = 0; // Reset search limit
            }
        } else {
            $scope.searchFilter = undefined; // Reset search limit
            app.limit = 0; // Set search limit to zero
        }
    };

     app.clear = function() {
        $scope.number = 'Clear'; // Set the filter box to 'Clear'
        app.limit = 0; // Clear all results
        $scope.searchKeyword = undefined; // Clear the search word
        $scope.searchFilter = undefined; // Clear the search filter
        app.showMoreError = false; // Clear any errors
    };
     // Function: Perform an advanced, criteria-based search
    app.advancedSearch = function(searchByNomchaine, searchByBouquet) {
        // Ensure only to perform advanced search if one of the fields was submitted
        if (searchByNomchaine || searchByBouquet) {
            $scope.advancedSearchFilter = {}; // Create the filter object
            if (searchByNomchaine) {
                $scope.advancedSearchFilter.nomchaine = searchByNomchaine; // If username keyword was provided, search by username
            }
            if (searchByBouquet) {
                $scope.advancedSearchFilter.bouquet = searchByBouquet; // If email keyword was provided, search by email
            }
           
            app.searchLimit = undefined; // Clear limit on search results
        }
    };

    // Function: Set sort order of results
    app.sortOrder = function(order) {
        app.sort = order; // Assign sort order variable requested by user
    };
   
   
   $scope.working = 'Angular is Working';
        function onError () {


      app.onError = function (error) {
            $scope.error = error.data;
        };
        };
        //end error function

        //get all persone
      app.onChainesGetCompleted = function(response){
        $scope.chaines = response.data;
            console.log($scope.chaines);
      }
      
      
        
        
      //end get all persons

        function onGetByIdCompleted(){


        app.onGetByIdCompleted = function(response){
            $scope.chaine = response.data;
            console.log(response.data);
        };
        };
        $scope.searchChaine = function(id){
            $http.get('/api/chaine/' + id)
                    .then(onGetByIdCompleted, onError);
            console.log(id);
        };
        

        $scope.addChaine = function(chaine){
            $http.post('/api/addChaine/', chaine)
                    .then(onAddChaineCompleted, onError);
            console.log(chaine);
        };
        
        function onAddChaineCompleted () {


        app.onAddChaineCompleted = function(response){
            $scope.chaine = response.data;
            console.log(response.data);
            refresh();
        };
         };
        //end add new person

      
        //end delete person

        //update person
        $scope.updateChaine= function(chaine){
            $http.put('/api/updateChaine/', chaine)
                .then(onUpdateChaineCompleted, onError);
                    console.log(chaine);
        };
        
        function onUpdateChaineCompleted(){


        app.onUpdateChaineCompleted = function(response){
            $scope.chaine = response.data;//response.data;
            console.log(response.data);
            refresh();
        };
      };
       function refresh() {


      app.refresh = function(){
          $http.get('/api/managemente/')
            .then(onChainesGetCompleted, onError);
          console.log('Response received...');
        }
      };

})
.controller('editeCtrl', function($scope, chaines) {
       




  
  this.update = function(updatedChaine, $http) {
    var chaine = updatedChaine;

    chaine.$update(function(chaine) {
       $location.path('managemente/'+ chaine.nomchaine);

    }, function(errorResponse) {
      $scope.error = errorResponse.data.message;
    });
  };
});







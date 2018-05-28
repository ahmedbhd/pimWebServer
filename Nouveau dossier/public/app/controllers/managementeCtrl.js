angular.module('managementeController', [])

.controller('managementeCtrl', function(Chaine, User, $scope, $window, $filter) {
 
    var app = this;
     $scope.chaines = [];
    $scope.labels = ["Agree", "Disagree"];
    $scope.data = [];


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
      app.itemsPerPage = 15;
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
         
      app.buildPager();
                
            } else {
                app.errorMsg = data.data.message; // Set error message
                 // Stop loading icon
           
            }
        });

 }
 getChaines();
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
        app.showMoreError = false; // Clear error message
    };


     app.deleteChaine = function(nomchaine) {
        // Run function to delete a user
        Chaine.deleteChaine(nomchaine).then(function(data) {
           if ($window.confirm('Are you sure you want to delete this user?')) {
            // Check if able to delete user
            if (data.data.success) {
                getChaines(); // Reset users on page
                         $window.success('User deleted successfully!');

            } else {
                app.showMoreError = data.data.message;
            // Set error message
            }
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


})

.controller('editeCtrl', function($scope, $routeParams, Chaine) {
   var app = this;
   app.phase11 = true;

   Chaine.getChaine($routeParams.id).then(function(data) {
         if (data.data.success) {
          $scope.newChaine = data.data.chaine.nomchaine;
          console.log(data);
         } else {
           app.errorMsg = data.data.message;
         }
       });

   app.chainePhase = function(){
     app.phase11 = true;
   };


   app.updateChaine = function(newChaine, valid) {
        app.errorMsg = false; // Clear any error messages
       

        if (valid) {

        } else {
          app.errorMsg  = 'Please';
                  }
   };


})


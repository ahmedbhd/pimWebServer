angular.module('recepteurController', ['angularUtils.directives.dirPagination', 'fileModelDirective', 'uploadFileService'])

.controller('recepteurCtrl',  function(Recepteur, User, $scope, $window, $filter, $http, uploadFile, $timeout) {

    var app = this;
    var modalInstance = null;
     $scope.recepteurs = [];
    $scope.labels = ["Agree", "Disagree"];
    $scope.data = [];
    $scope.file = {};



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



    
  
  function getRecepteurs() {
  

      Recepteur.getRecepteurs().then(function(data) {
       
   
       
        // Check if able to get data from database
            if (data.data.success ) {
                    app.recepteurs = data.data.recepteurs;
                        console.log(data);
         
      app.buildPager();
                
            } else {
                app.errorMsg = data.data.message; // Set error message
                 // Stop loading icon
           
            }
        });

 }
 getRecepteurs();
    
     $scope.loadData = function () {
      getRecepteurs();
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
      Recepteur.create().then(function(data) {
    
            // Check if able to delete user
            if (data.data.success) {
                getRecepteurs(); // Reset users on page
              console.log(data);
            } else {
                app.showMoreError = data.data.message;
            // Set error message
            }
          
        });
     
 };

     app.deleteRecepteur = function(recepteur) {
        // Run function to delete a user
        Recepteur.deleteRecepteur(recepteur).then(function(data) {
    
            // Check if able to delete user
            if (data.data.success) {
                getRecepteurs(); // Reset users on page
               

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
    app.advancedSearch = function(searchByRecepteur, searchByAge) {
        // Ensure only to perform advanced search if one of the fields was submitted
        if (searchByRecepteur || searchByAge) {
            $scope.advancedSearchFilter = {}; // Create the filter object
            if (searchByRecepteur) {
                $scope.advancedSearchFilter.recepteur = searchByRecepteur; // If username keyword was provided, search by username
            }
            if (searchByAge) {
                $scope.advancedSearchFilter.age = searchByAge; // If email keyword was provided, search by email
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
      app.onRecepteursGetCompleted = function(response){
        $scope.recepteurs = response.data;
            console.log($scope.recepteurs);
      }
      
       function refresh() {


      app.refresh = function(){
          $http.get('/api/managemente/')
            .then(onRecepteursGetCompleted, onError);
          console.log('Response received...');
        }
      };
        
        
      //end get all persons

        function onGetByIdCompleted(){


        app.onGetByIdCompleted = function(response){
            $scope.recepteur = response.data;
            console.log(response.data);
        };
        };
        $scope.searchByRecepteur = function(id){
            $http.get('/api/recepteur/' + id)
                    .then(onGetByIdCompleted, onError);
            console.log(id);
        };
        

        function onAddRecepteurCompleted () {


        app.onAddRecepteurCompleted = function(response){
            $scope.id_rec = response.data;
            console.log(response.data);
            refresh();
        };
         };
        $scope.addRecepteur = function(id_rec){
            $http.post('/api/addRecepteur/', id_rec)
                    .then(onAddRecepteurCompleted, onError);
            console.log(id_rec);
        };
        //end add new person

      
        //end delete person

        //update person
        $scope.updateRecepteur= function(recepteur){
            $http.put('/api/updateRecepteur/', recepteur)
                .then(onUpdateRecepteurCompleted, onError);
                    console.log(chaine);
        };
        
        function onUpdateRecepteurCompleted(){


        app.onUpdateRecepteurCompleted = function(response){
            $scope.recepteur = response.data;//response.data;
            console.log(response.data);
            refresh();
        };
      };

});







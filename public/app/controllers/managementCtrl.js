angular.module('managementController', ['ui-notification'])
.config(function(NotificationProvider) {
        NotificationProvider.setOptions({
            delay: 10000,
            startTop: 20,
            startRight: 10,
            verticalSpacing: 20,
            horizontalSpacing: 20,
            positionX: 'left',
            positionY: 'bottom'
        });
})
// Controller: User to control the management page and managing of user accounts
.controller('managementCtrl', function(User, Chaine, $scope, $http, Notification) {
    var app = this;
 app.username = undefined;
     // Start loading icon on page load
    app.accessDenied = true; // Hide table while loading
    app.errorMsg = false; // Clear any error messages
    app.editAccess = false; // Clear access on load
    app.deleteAccess = false; // CLear access on load
    
    app.limit = 5; // Set a default limit to ng-repeat
    app.searchLimit = 0; // Set the default search page results limit to zero
    


    app.createUser = function(username){
        console.log("this is creating the user ", username);
        $rootScope.$emit('new-user', username);
      }
    // Function: get all the users from database
    function getUsers() {

          


        // Runs function to get all the users from database
        User.getUsers().then(function(data) {
             
           


            
        
            // Check if able to get data from database
            if (data.data.success) {
                // Check which permissions the logged in user has
                if (data.data.permission === 'admin' || data.data.permission === 'client') {
                    app.users = data.data.users;
                 
                    Notification.success({message: 'Success notification<br>Some other <b>content</b><br><a href="https://github.com/alexcrack/angular-ui-notification">This is a link</a><br><img src="https://angularjs.org/img/AngularJS-small.png">', title: 'seuil activé'});
                  
                    app.accessDenied = false; // Show table
                    
                    // Check if logged in user is an admin or moderator
                    if (data.data.permission === 'admin') {
                       app.editAccess = true; // Clear access on load
                       app.deleteAccess = true; // CLear access on load
                      // Show delete button
                    } else if (data.data.permission === 'client') {
                          app.editAccess = false; // Clear access on load
                          app.deleteAccess = false; // CLear access on load
                      
                        // CLear access on load
                    }
                } else {
                    app.errorMsg = 'Insufficient Permissions'; // Reject edit and delete options
                   // Stop loading icon
                }
            } else {
                app.errorMsg = data.data.message; // Set error message
                 // Stop loading icon
           
            }
           
             });
        
         
    }

    getUsers(); // Invoke function to get users from databases
    
      $scope.working = 'Angular is Working';
        function onError () {


      app.onError = function (error) {
            $scope.error = error.data;
        };
        };
        //end error function

        //get all persone
      app.onUsersGetCompleted = function(response){
        $scope.users = response.data;
            console.log($scope.users);
      }
      
       function refresh() {


      app.refresh = function(){
          $http.get('/api/management/')
            .then(onUsersGetCompleted, onError);
          console.log('Response received...');
        }
      };
        
        
      //end get all persons

        function onGetByIdCompleted(){


        app.onGetByIdCompleted = function(response){
            $scope.chaine = response.data;
            console.log(response.data);
        };
        };


        $scope.searchUser = function(id){
            $http.get('/api/user/' + id)
                    .then(onGetByIdCompleted, onError);
            console.log(id);
        };
        

        function onAddUserCompleted () {


        app.onAddUserCompleted = function(response){
            $scope.user = response.data;
            console.log(response.data);
            refresh();
        };
         };
        $scope.addUser = function(chaine){
            $http.post('/api/addUser/', user)
                    .then(onAddUserCompleted, onError);
            console.log(chaine);
        };
        //end add new person

      
        //end delete person

        //update person
        $scope.updateUser= function(chaine){
            $http.put('/api/updateUser/', user)
                .then(onUpdateUserCompleted, onError);
                    console.log(user);
        };
        
        function onUpdateUserCompleted(){


        app.onUpdateUserCompleted = function(response){
            $scope.user = response.data;//response.data;
            console.log(response.data);
            refresh();
        };
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
        app.limit = undefined; // Clear ng-repeat limit
        app.showMoreError = false; // Clear error message
    };

    // Function: Delete a user
    app.deleteUser = function(username) {
        // Run function to delete a user
        User.deleteUser(username).then(function(data) {
            // Check if able to delete user
            if (data.data.success) {
                getUsers(); // Reset users on page
               Notification.primary('Primary notification');
            } else {
                app.showMoreError = data.data.message; // Set error message
            }
        });
    };

    // Function: Perform a basic search function
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

    // Function: Clear all fields
    app.clear = function() {
        $scope.number = 'Clear'; // Set the filter box to 'Clear'
        app.limit = 0; // Clear all results
        $scope.searchKeyword = undefined; // Clear the search word
        $scope.searchFilter = undefined; // Clear the search filter
        app.showMoreError = false; // Clear any errors
    };

    // Function: Perform an advanced, criteria-based search
    app.advancedSearch = function(searchByUsername, searchByEmail, searchByName) {
        // Ensure only to perform advanced search if one of the fields was submitted
        if (searchByUsername || searchByEmail || searchByName) {
            $scope.advancedSearchFilter = {}; // Create the filter object
            if (searchByUsername) {
                $scope.advancedSearchFilter.username = searchByUsername; // If username keyword was provided, search by username
            }
            if (searchByEmail) {
                $scope.advancedSearchFilter.email = searchByEmail; // If email keyword was provided, search by email
            }
            if (searchByName) {
                $scope.advancedSearchFilter.name = searchByName; // If name keyword was provided, search by name
            }
            app.searchLimit = undefined; // Clear limit on search results
        }
    };

    // Function: Set sort order of results
    app.sortOrder = function(order) {
        app.sort = order; // Assign sort order variable requested by user
    };
})

// Controller: Used to edit users
.controller('editCtrl', function($scope, $routeParams, User, $timeout) {
    var app = this;
    $scope.nameTab = 'active'; // Set the 'name' tab to the default active tab
    app.phase1 = true; // Set the 'name' tab to default view

    // Function: get the user that needs to be edited
    User.getUser($routeParams.id).then(function(data) {
        // Check if the user's _id was found in database
        if (data.data.success) {
            $scope.newName = data.data.user.name; // Display user's name in scope
            $scope.newEmail = data.data.user.email; // Display user's e-mail in scope
            $scope.newUsername = data.data.user.username; // Display user's username in scope
            $scope.newPermission = data.data.user.permission; // Display user's permission in scope
            app.currentUser = data.data.user._id; // Get user's _id for update functions
        } else {
            app.errorMsg = data.data.message; // Set error message
            $scope.alert = 'alert alert-danger'; // Set class for message
        }
    });

    // Function: Set the name pill to active
    app.namePhase = function() {
        $scope.nameTab = 'active'; // Set name list to active
        $scope.usernameTab = 'default'; // Clear username class
        $scope.emailTab = 'default'; // Clear email class
        $scope.permissionsTab = 'default'; // Clear permission class
        app.phase1 = true; // Set name tab active
        app.phase2 = false; // Set username tab inactive
        app.phase3 = false; // Set e-mail tab inactive
        app.phase4 = false; // Set permission tab inactive
        app.errorMsg = false; // Clear error message
    };

    // Function: Set the e-mail pill to active
    app.emailPhase = function() {
        $scope.nameTab = 'default'; // Clear name class
        $scope.usernameTab = 'default'; // Clear username class
        $scope.emailTab = 'active'; // Set e-mail list to active
        $scope.permissionsTab = 'default'; // Clear permissions class
        app.phase1 = false; // Set name tab to inactive
        app.phase2 = false; // Set username tab to inactive
        app.phase3 = true; // Set e-mail tab to active
        app.phase4 = false; // Set permission tab to inactive
        app.errorMsg = false; // Clear error message
    };

    // Function: Set the username pill to active
    app.usernamePhase = function() {
        $scope.nameTab = 'default'; // Clear name class
        $scope.usernameTab = 'active'; // Set username list to active
        $scope.emailTab = 'default'; // CLear e-mail class
        $scope.permissionsTab = 'default'; // CLear permissions tab
        app.phase1 = false; // Set name tab to inactive
        app.phase2 = true; // Set username tab to active
        app.phase3 = false; // Set e-mail tab to inactive
        app.phase4 = false; // Set permission tab to inactive
        app.errorMsg = false; // CLear error message
    };

    // Function: Set the permission pill to active
    app.permissionsPhase = function() {
        $scope.nameTab = 'default'; // Clear name class
        $scope.usernameTab = 'default'; // Clear username class
        $scope.emailTab = 'default'; // Clear e-mail class
        $scope.permissionsTab = 'active'; // Set permission list to active
        app.phase1 = false; // Set name tab to inactive
        app.phase2 = false; // Set username to inactive
        app.phase3 = false; // Set e-mail tab to inactive
        app.phase4 = true; // Set permission tab to active
        app.disableClient = false; // Disable buttons while processing
        app.disableSilver = false; // Disable buttons while processing
        app.disableGold = false; // Disable buttons while processing
        app.disablePlatinium = false; // Disable buttons while processing
        app.errorMsg = false; // Clear any error messages
        // Check which permission was set and disable that button
        if ($scope.newPermission === 'client') {
            app.disableClient = true; // Disable 'user' button
        } else if ($scope.newPermission === 'silver') {
            app.disableSilver = true; // Disable 'moderator' button
        } else if ($scope.newPermission === 'gold') {
            app.disableGold = true; // Disable 'admin' button
        }else if ($scope.newPermission === 'platinium') {
            app.disablePlatinium = true; // Disable 'admin' button
        }


    };

    // Function: Update the user's name
    app.updateName = function(newName, valid) {
        app.errorMsg = false; // Clear any error messages
        app.disabled = true; // Disable form while processing
        // Check if the name being submitted is valid
        if (valid) {
            var userObject = {}; // Create a user object to pass to function
            userObject._id = app.currentUser; // Get _id to search database
            userObject.name = $scope.newName; // Set the new name to the user
            // Runs function to update the user's name
            User.editUser(userObject).then(function(data) {
                // Check if able to edit the user's name
                if (data.data.success) {
                    $scope.alert = 'alert alert-success'; // Set class for message
                    app.successMsg = data.data.message; // Set success message
                    // Function: After two seconds, clear and re-enable
                    $timeout(function() {
                        app.nameForm.name.$setPristine(); // Reset name form
                        app.nameForm.name.$setUntouched(); // Reset name form
                        app.successMsg = false; // Clear success message
                        app.disabled = false; // Enable form for editing
                    }, 2000);
                } else {
                    $scope.alert = 'alert alert-danger'; // Set class for message
                    app.errorMsg = data.data.message; // Clear any error messages
                    app.disabled = false; // Enable form for editing
                }
            });
        } else {
            $scope.alert = 'alert alert-danger'; // Set class for message
            app.errorMsg = 'Please ensure form is filled out properly'; // Set error message
            app.disabled = false; // Enable form for editing
        }
    };

    // Function: Update the user's e-mail
    app.updateEmail = function(newEmail, valid) {
        app.errorMsg = false; // Clear any error messages
        app.disabled = true; // Lock form while processing
        // Check if submitted e-mail is valid
        if (valid) {
            var userObject = {}; // Create the user object to pass in function
            userObject._id = app.currentUser; // Get the user's _id in order to edit
            userObject.email = $scope.newEmail; // Pass the new e-mail to save to user in database
            // Run function to update the user's e-mail
            User.editUser(userObject).then(function(data) {
                // Check if able to edit user
                if (data.data.success) {
                    $scope.alert = 'alert alert-success'; // Set class for message
                    app.successMsg = data.data.message; // Set success message
                    // Function: After two seconds, clear and re-enable
                    $timeout(function() {
                        app.emailForm.email.$setPristine(); // Reset e-mail form
                        app.emailForm.email.$setUntouched(); // Reset e-mail form
                        app.successMsg = false; // Clear success message
                        app.disabled = false; // Enable form for editing
                    }, 2000);
                } else {
                    $scope.alert = 'alert alert-danger'; // Set class for message
                    app.errorMsg = data.data.message; // Set error message
                    app.disabled = false; // Enable form for editing
                }
            });
        } else {
            $scope.alert = 'alert alert-danger'; // Set class for message
            app.errorMsg = 'Please ensure form is filled out properly'; // Set error message
            app.disabled = false; // Enable form for editing
        }
    };

    // Function: Update the user's username
    app.updateUsername = function(newUsername, valid) {
        app.errorMsg = false; // Clear any error message
        
        app.disabled = true; // Lock form while processing
        // Check if username submitted is valid
        if (valid) {
            var userObject = {}; // Create the user object to pass to function
            userObject._id = app.currentUser; // Pass current user _id in order to edit
            userObject.username = $scope.newUsername; // Set the new username provided
            // Runs function to update the user's username
            User.editUser(userObject).then(function(data) {
                // Check if able to edit user
                if (data.data.success) {
                    $scope.alert = 'alert alert-success'; // Set class for message
                    app.successMsg = data.data.message; // Set success message
                    // Function: After two seconds, clear and re-enable
                    $timeout(function() {
                        app.usernameForm.username.$setPristine(); // Reset username form
                        app.usernameForm.username.$setUntouched(); // Reset username form
                        app.successMsg = false; // Clear success message
                        app.disabled = false; // Enable form for editing
                    }, 2000);
                } else {
                    app.errorMsg = data.data.message; // Set error message
                    app.disabled = false; // Enable form for editing
                }
            });
        } else {
            app.errorMsg = 'Please ensure form is filled out properly'; // Set error message
            app.disabled = false; // Enable form for editing
        }
    };

    // Function: Update the user's permission
    app.updatePermissions = function(newPermission) {
        app.errorMsg = false; // Clear any error messages
        app.disableClient = true; // Disable button while processing
        app.disableGold = true; // Disable button while processing
        app.disableSilver = true; // Disable button while processing
        app.disablePlatinium = true; // Disable button while processing
        var userObject = {}; // Create the user object to pass to function
        userObject._id = app.currentUser; // Get the user _id in order to edit
        userObject.permission = newPermission; // Set the new permission to the user
        // Runs function to udate the user's permission
        User.editUser(userObject).then(function(data) {
            // Check if was able to edit user
            if (data.data.success) {
                $scope.alert = 'alert alert-success'; // Set class for message
                app.successMsg = data.data.message; // Set success message
                // Function: After two seconds, clear and re-enable
                $timeout(function() {
                    app.successMsg = false; // Set success message
                    $scope.newPermission = newPermission; // Set the current permission variable
                    // Check which permission was assigned to the user
                    if (newPermission === 'client') {
                        app.disableClient = true; 
                        app.disableSilver = false; 
                        app.disableGold = false; 
                        app.disablePlatinium = false; 
                    } else if (newPermission === 'silver') {
                        app.disableSilver = true; // Lock the 'moderator' button
                        app.disableClient = false; // Unlock the 'user' button
                        app.disableGold = false; // Unlock the 'admin' button
                        app.disablePlatinium = false; // Unlock the 'admin' button
                    } else if (newPermission === 'gold') {
                        app.disableGold = true; // Lock the 'admin' buton
                        app.disableClient = false; // Unlock the 'moderator' button
                        app.disableSilver = false; // unlock the 'user' button
                        app.disablePlatinium = false; // unlock the 'user' button

                    }else if (newPermission === 'platinium') {
                        app.disablePlatinium = true; // Lock the 'admin' buton
                        app.disableClient = false; // Unlock the 'moderator' button
                        app.disableSilver = false; // unlock the 'user' button
                        app.disableGold = false; // unlock the 'user' button

                    }
                }, 2000);
            } else {
                $scope.alert = 'alert alert-danger'; // Set class for message
                app.errorMsg = data.data.message; // Set error message
                app.disabled = false; // Enable form for editing
            }
        });
    };

});

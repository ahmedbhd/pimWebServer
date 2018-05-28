angular.module('historyController', ['ui-notification'])
.controller('historyCtrl', function(History, Notification, $scope) {
   var app = this;
   
    
  
  

   function getHistorys(){


   History.getHistorys().then(function(data) {
      
      if (data.data.success) {
        app.historys = data.data.historys;
       console.log(data);
       
      }else {
                app.errorMsg = data.data.message; // Set error message
                
           
            }
       
        
        
        //common error function
    
    
   });
    }

    getHistorys();



  });
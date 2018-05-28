angular.module('chartController', [])
.controller('chartsCtrl', function(History, User) {
   var app = this;
   
  
  
  
   
   function getHistorys(){


   History.getHistory().then(function(data) {
      
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
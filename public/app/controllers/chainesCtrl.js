angular.module('chainesController', ['chaineServices'])
.controller('chainesCtrl', function (Chaine) {

	Chaine.getChaines().then(function(data) {
        if (data.data.success){
              
        }   else {
        	app.errorMsg = data.data.message;
        }
	});
});
app.controller('chartsCtrl', function($scope, $http) {
    var getdata;
 
    getData = function(url, callback) {
        $http({
            method: 'GET',
            dataType: 'json',
            url: url,
            headers: {
                "Content-Type": "application/json"
            }
        }).success(callback);
    };
 
    getData('/api/managementhistory/', function(response) {
        console.log(response);
       var labeldata = [];
            var chartData = [];
 
        chart = {
            caption: "Top 10 Most Populous Countries",
            showValues: 0,
            theme: "zune"
        };
 
        for (var i = 0; i < response.length; i++) {
             labeldata.push(response[i].channel);
                chartData.push(response[i].recepteur)
           
        };
 
         $scope.labels = labeldata;

  $scope.data = [
    chartData
    
  ];
        
 
        
 
    });
});
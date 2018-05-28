angular.module('abonnementController', ['ui.bootstrap']);

var modalControl = function ($scope, $modal, $log) {

  var key = 1000;
  $scope.items = ['item1', 'item2', 'item3'];

  $scope.open = function (abonnement) {

    var modalInstance = $modal.open({
      templateUrl: 'editabonnementmodal.html',
      controller: abonnementCtrl,
      resolve: {
        items: function () {
          return $scope.abonnements;
        },
        key: function() {return key; }
      }
    });

    modalInstance.result.then(function (selectedItem) {
      $scope.selected = selectedItem;
    }, function () {
      $log.info('Modal dismissed at: ' + new Date());
    });
  };
};
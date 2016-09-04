angular.module('madeWithFirebase')

.controller('EditController', ['$scope', '$firebaseObject', 'DatabaseRef', '$stateParams',
  function($scope, $firebaseObject, DatabaseRef, $stateParams) {
    console.log('Controller loaded');

    var fire = $firebaseObject(DatabaseRef.child('fire').child($stateParams.fireId));

    $scope.loading = true;
    
    var categoryObject = $firebaseObject(DatabaseRef.child('categories'));
    categoryObject.$loaded()
      .then(function(data) {
        $scope.categories = data;
      }, function(error) {
        toastr.error(error.message, 'Couldnt not load categories');
      });

    var now = new Date().getTime();

    fire.$bindTo($scope, "formData")
      .then(function() {
        $scope.loading = false;
        $scope.formData.updatedAt = now;
        fire.update($scope.formData)
          .then(function(data) {
            toastr.info('Updating ongoing', 'Busy');
          }, function(error) {
            toastr.error(error.message, error.reason);
          })
      })
  }
])

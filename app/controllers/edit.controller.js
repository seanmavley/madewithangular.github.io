angular.module('madeWithFirebase')

.controller('EditController', ['$scope', '$state', '$firebaseObject', 'DatabaseRef', 'Auth', 'currentAuth',
  function($scope, $state, $firebaseObject, $firebaseArray, DatabaseRef, Auth, currentAuth) {
    
    var fire = $firebaseObject(DatabaseRef.child('fire').child($stateParams.fireId));

    var categoryObject = $firebaseObject(DatabaseRef.child('categories'));
    categoryObject.$loaded()
      .then(function(data) {
        $scope.categories = data;
      }, function(error) {
        toastr.error(error.message, 'Couldnt not load categories');
      });

    fire.$bindTo($scope, "formData")
      .then(function() {
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

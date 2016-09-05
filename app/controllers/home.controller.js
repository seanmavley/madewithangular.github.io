angular.module('madeWithFirebase')

.controller('HomeController', ['$scope', '$rootScope', 'Auth', 'DatabaseRef', '$firebaseArray', '$firebaseObject',
  function($scope, $rootScope, Auth, DatabaseRef, $firebaseArray, $firebaseObject) {

    var list = $firebaseArray(DatabaseRef.child('fire'));

    $scope.filterKey = function(value) {
      return value;
    };

    var categoryObject = $firebaseObject(DatabaseRef.child('categories'));
    categoryObject.$loaded()
      .then(function(data) {
        $scope.categories = data;
      }, function(error) {
        toastr.error(error.message, 'Couldnt not load categories');
      })
    list.$loaded()
      .then(function(data) {
        $scope.list = data;
        // TODO: use for loop
        // to tuck list item under their category
      })
      .catch(function(error) {
        toastr.error(error.message);
      })
  }
])

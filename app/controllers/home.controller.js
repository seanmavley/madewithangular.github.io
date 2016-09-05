angular.module('madeWithFirebase')

.controller('HomeController', ['$scope', '$rootScope', 'Auth', 'DatabaseRef', '$firebaseArray', '$firebaseObject',
  function($scope, $rootScope, Auth, DatabaseRef, $firebaseArray, $firebaseObject) {

    var list = $firebaseArray(DatabaseRef.child('fire'));

    $scope.filterKey = function(value) {
      return value;
    };

    var categoryArray = $firebaseArray(DatabaseRef.child('categories'));
    categoryArray.$loaded()
      .then(function(data) {
        $scope.categories = data;
      }, function(error) {
        toastr.error(error.message, 'Couldnt not load categories');
      })
    list.$loaded()
      .then(function(data) {
        $scope.list = data;
      })
      .catch(function(error) {
        toastr.error(error.message);
      })
  }
])

angular.module('madeWithFirebase')

.controller('HomeController', ['$scope', '$rootScope', 'Auth', 'DatabaseRef', '$firebaseArray',
  function($scope, $rootScope, Auth, DatabaseRef, $firebaseArray) {

    var list = $firebaseArray(DatabaseRef.child('fire'));

    list.$loaded()
      .then(function(data) {
        console.log(data);
        $scope.list = data;
      })
      .catch(function(error) {
        toastr.error(error.message);
      })
  }
])

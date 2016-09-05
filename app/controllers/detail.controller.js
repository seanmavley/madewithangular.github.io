angular.module('madeWithFirebase')

.controller('DetailController', ['$scope', '$rootScope', '$state',
  '$stateParams', 'DatabaseRef', '$firebaseObject',
  '$firebaseArray', 'Auth',
  function($scope, $rootScope, $state, $stateParams,
    DatabaseRef, $firebaseObject, $firebaseArray, Auth) {

    $scope.loading = true;

    var fire = $firebaseObject(DatabaseRef.child('fire').child($stateParams.fireId));

    fire.$loaded()
      .then(function(data) {
        $scope.loading = false;
        $scope.fire = data;
      });
  }
]);

angular.module('madeWithFirebase')

.controller('AdminController', ['$scope', '$firebaseObject', '$firebaseArray', 'currentAuth', 'Auth', 'DatabaseRef',
  function($scope, $firebaseObject, $firebaseArray, currentAuth, Auth, DatabaseRef) {
    // init empty formData object
    // retrieve codes created by 
    var query = DatabaseRef.child('fire').orderByChild('uid').equalTo(currentAuth.uid);
    var list = $firebaseArray(query);

    list.$loaded()
      .then(function(data) {
        console.log(data);
        $scope.list = data
      })
      .catch(function(error) {
        toastr.error(error.message);
      })
  }
])

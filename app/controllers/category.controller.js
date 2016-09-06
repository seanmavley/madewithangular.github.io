angular.module('madeWithFirebase')
  .controller('CategoryController', ['$scope', 'DatabaseRef', '$firebaseArray', '$stateParams',
    function($scope, DatabaseRef, $firebaseArray, $stateParams) {
      console.log('Category Controller loaded');
      var query = DatabaseRef.child('fire').orderByChild('category').equalTo($stateParams.categoryId);
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

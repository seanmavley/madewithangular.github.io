angular.module('madeWithFirebase')

.controller('CreateController', ['$scope', '$state', '$firebaseObject', '$firebaseArray', 'DatabaseRef', 'Auth', 'currentAuth',
  function($scope, $state, $firebaseObject, $firebaseArray, DatabaseRef, Auth, currentAuth) {
    $scope.sending = false; 

    var list = $firebaseArray(DatabaseRef.child('fire'));

    var categoryObject = $firebaseObject(DatabaseRef.child('categories'));
    categoryObject.$loaded()
      .then(function(data) {
        $scope.categories = data;
      }, function(error) {
        toastr.error(error.message, 'Couldnt not load categories');
      });

    $scope.addNew = function() {
      if ($scope.addForm.$invalid) {
        toastr.error('Please fill the form, all of it!',
          'Throw in the best of your coding spices.',
          'It means a lot!', 'Incomplete form');

      } else {
        toastr.info('Saving begins', 'Sending your submission to the Firebase. Hold on!');
        $scope.sending = true;
        var now = new Date().getTime();

        $scope.formData.uid = currentAuth.uid;
        $scope.formData.createdBy = currentAuth.displayName;
        $scope.formData.createdAt = now;

        // console.log($scope.formData);

        list.$add($scope.formData)
          .then(function(saved) {
            toastr.clear();
            // console.log('Saving happened', saved);
            toastr.success('Saving happened');
            $state.go('fire', { fireId: saved.key });
          }, function(error) {
            // console.log(error.reason, error.message);
            toastr.error(error.reason, error.message)
          })
      }
    }
  }
])

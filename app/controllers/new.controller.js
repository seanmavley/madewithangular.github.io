angular.module('madeWithFirebase')

.controller('CreateController', ['$scope', '$state', '$firebaseObject',
  '$firebaseArray', 'DatabaseRef', 'Auth',
  'currentAuth', 'resizeService',
  function($scope, $state, $firebaseObject,
    $firebaseArray, DatabaseRef, Auth,
    currentAuth, resizeService) {

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
        toastr.error('Please fill the form, all of it!', 'Incomplete form');
      } else {
        toastr.info('Saving begins', 'Sending your submission to Firebase. Hold on!');
        $scope.sending = true;
        var now = new Date().getTime();

        // append more values to formData object
        $scope.formData.uid = currentAuth.uid;
        $scope.formData.createdBy = currentAuth.displayName;
        $scope.formData.createdAt = now;

        // We handle resizing before submission actually happens.
        resizeService
          .resizeImage($scope.formData.image, {
            size: 306,
            sizeScale: 'ko',
            crossOrigin: 'Anonymous'
          })
          .then(function(image) {
            // generate a dataURI thumnail from original image
            // and add to formData object
            $scope.formData.thumbnail = image;
            list.$add($scope.formData)
              .then(function(saved) {
                toastr.clear();
                toastr.success('Saving happened');
                $state.go('fire', { fireId: saved.key });
              }, function(error) {
                toastr.error(error.reason, error.message)
              })
          })
          .catch(function(error) {
            console.log(error);
            toastr.error(error);
          })
      }
    }
  }
])

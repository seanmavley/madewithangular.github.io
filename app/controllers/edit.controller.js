angular.module('madeWithFirebase')

.controller('EditController', ['$scope', '$firebaseObject',
  'DatabaseRef', '$stateParams', 'currentAuth', 'resizeService',
  function($scope, $firebaseObject,
    DatabaseRef, $stateParams, currentAuth, resizeService) {

    var fire = $firebaseObject(DatabaseRef.child('fire').child($stateParams.fireId));

    $scope.loading = true;

    // generate thumbnail, and 
    // $bindTo will pick up the model change and reflect in
    // realtime database
    $scope.doThumbnail = function() {
      console.log('do Thumbnail engaged.');
      resizeService
        .resizeImage($scope.formData.image, {
          size: 306,
          sizeScale: 'ko',
          crossOrigin: 'Anonymous'
        })
        .then(function(image) {
          $scope.formData.thumbnail = image;
        })
    };
    // compare createdBy to user to edit
    // enforced in rules
    fire.$loaded()
      .then(function(data) {
        if (data.uid != currentAuth.uid) {
          toastr.error('Not allowed', 'You are trying to edit a site you did not create.');
          $scope.allowed = false;
        } else {
          $scope.allowed = true;
          var now = new Date().getTime();
          /* threesome begins */
          fire.$bindTo($scope, "formData")
            .then(function() {
              $scope.loading = false;
              toastr.info('All changes you make are saved in realtime to Firebase', 'Live saving enabled!');
            })
        }
      })

    var categoryObject = $firebaseObject(DatabaseRef.child('categories'));
    categoryObject.$loaded()
      .then(function(data) {
        $scope.categories = data;
      }, function(error) {
        toastr.error(error.message, 'Couldnt not load categories');
      });
  }
])

angular.module('madeWithFirebase')

.controller('AdminController', ['$scope', '$firebaseObject', '$firebaseArray', 'currentAuth', 'DatabaseRef',
  function($scope, $firebaseObject, $firebaseArray, currentAuth, DatabaseRef) {
    // init empty formData object
    // retrieve codes created by  user in context
    var query = DatabaseRef.child('fire').orderByChild('uid').equalTo(currentAuth.uid);
    var list = $firebaseArray(query);

    $scope.admin = false;
    console.log(currentAuth.email);

    if (currentAuth.email == 'seanmavley@gmail.com') {
      $scope.admin = true;
      console.log($scope.admin);
    }

    list.$loaded()
      .then(function(data) {
        // console.log(data);
        $scope.list = data
      })
      .catch(function(error) {
        toastr.error(error.message);
      })

    // I'm lazy to type always should the db be reset.
    $scope.addCategories = function() {
      if (currentAuth.email != 'seanmavley@gmail.com') {
        toastr.error('You cannot initiate the categories')
      } else {
        DatabaseRef
          .child('categories')
          .update({
            'google': 'Google',
            'business': 'Business',
            'communication': 'Communication',
            'education': 'Education',
            'entertainment': 'Entertainment',
            'finance': 'Finance',
            'health-fitness': 'Health & Fitness',
            'lifestyle': 'Lifestyle',
            'media-video': 'Media & Video',
            'music-audio': 'Music & Audio',
            'news-magazines': 'News & Magazines',
            'photography': 'Photography',
            'productivity': 'Productivity',
            'shopping': 'Shopping',
            'social': 'Social',
            'sports': 'Sports',
            'tools': 'Tools',
            'travel-local': 'Travel & Local',
            'transportation': 'Transportation',
            'weather': 'Weather',
            'community': 'From the Community'
          })
      }
    }
  }
])

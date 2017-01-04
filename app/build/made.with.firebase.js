angular.module('madeWithFirebase', ['ui.router', 'firebase', 'ngProgress', 'images-resizer'])

.factory("Auth", ['$firebaseAuth', function($firebaseAuth) {
  return $firebaseAuth();
}])

.factory("DatabaseRef", ['$firebaseAuth', function($firebaseAuth) {
  return firebase.database().ref();
}])

.config(['$stateProvider', '$urlRouterProvider', '$locationProvider',
  function($stateProvider, $urlRouterProvider, $locationProvider) {

    $stateProvider
      .state('home', {
        url: '/',
        templateUrl: 'pages/home.html',
        controller: 'HomeController',
        meta: {
          title: 'Homepage',
          description: 'Your Favorite Programming Languages, Side By Side'
        },
      })
      .state('about', {
        url: '/about',
        templateUrl: 'templates/about.html',
        meta: {
          title: 'About',
          description: 'CodeBySide, a simple and fast way to compare code, side by side.' +
            ' Find out what CodeBySide is all about'
        }
      })      
      .state('privacy', {
        url: '/privacy',
        templateUrl: 'templates/privacy.html',
        meta: {
          title: 'Privacy',
          description: 'Details about your privacy on madeWithFirebase'
        }
      })
      .state('new', {
        url: '/submit',
        templateUrl: 'pages/new.html',
        controller: 'CreateController',
        resolve: {
          currentAuth: ['Auth', function(Auth) {
            return Auth.$requireSignIn()
          }]
        },
        meta: {
          title: 'Create new'
        }
      })
      .state('category', {
        url: '/category/:categoryId',
        templateUrl: 'pages/category.html',
        controller: 'CategoryController',
        meta: {
          title: 'Category Detail',
          description: 'Category Detail'
        }
      })
      .state('fire', {
        url: '/fires/:fireId',
        templateUrl: 'pages/detail.html',
        controller: 'DetailController',
        meta: {
          title: 'Code Detail',
          description: 'Code Description'
        }
      })
      .state('edit', {
        url: '/fires/:fireId/edit',
        templateUrl: 'pages/edit.html',
        controller: 'EditController',
        resolve: {
          currentAuth: ['Auth', function(Auth) {
            return Auth.$requireSignIn()
          }]
        },
        meta: {
          title: 'Edit ',
          description: 'Code Description'
        }
      })
      .state('delete', {
        url: '/fires/:fireId',
        templateUrl: 'codes/delete.html',
        controller: 'DeleteController',
        resolve: {
          currentAuth: ['Auth', function(Auth) {
            return Auth.$requireSignIn()
          }]
        },
        meta: {
          title: 'Code Detail',
          description: 'Code Description'
        }
      })
      .state('login', {
        url: '/login',
        templateUrl: 'auth/login.html',
        controller: 'LogRegController',
        params: {
          message: null,
          toWhere: null
        },
        meta: {
          title: 'Login'
        }
      })
      .state('admin', {
        url: '/admin',
        templateUrl: 'pages/admin.html',
        controller: 'AdminController',
        resolve: {
          currentAuth: ['Auth', function(Auth) {
            return Auth.$requireSignIn()
          }]
        },
        meta: {
          title: 'Admin',
          restricted: true
        }
      })

    $urlRouterProvider.otherwise('/');
    $locationProvider.html5Mode(true);
  }
])

.run(['$rootScope', '$state', '$location', 'Auth', 'ngProgressFactory',
  function($rootScope, $state, $location, Auth, ngProgressFactory) {
    // ngMeta.init();
    var progress = ngProgressFactory.createInstance();
    var afterLogin;

    $rootScope.$on("$stateChangeError", function(event, toState, toParams, fromState, fromParams, error) {
      if (error === "AUTH_REQUIRED") {
        $state.go('login', { toWhere: toState });
        progress.complete();
      }
    });

    $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
      progress.start();
    });

    $rootScope.$on('$stateChangeSuccess', function() {
      $rootScope.title = $state.current.meta.title;
      $rootScope.description = $state.current.meta.description;
      progress.complete();
    });
  }
])

angular.module('madeWithFirebase')

.controller('AdminController', ['$scope', '$firebaseObject', '$firebaseArray', 'currentAuth', 'DatabaseRef',
  function($scope, $firebaseObject, $firebaseArray, currentAuth, DatabaseRef) {
    // init empty formData object
    // retrieve codes created by 
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

angular.module('madeWithFirebase')
  .controller('LogRegController', ['$scope', '$stateParams', 'Auth', '$state', '$rootScope', 'DatabaseRef', '$firebaseObject',
    function($scope, $stateParams, Auth, $state, $rootScope, DatabaseRef, $firebaseObject) {
      // Social Auths
      // GOOGLE AUTH
      $scope.googleAuth = function() {
        var provider = new firebase.auth.GoogleAuthProvider();
        provider.addScope('https://www.googleapis.com/auth/plus.login');

        Auth.$signInWithPopup(provider)
          .then(function(firebaseUser) {
            toastr.success('Logged in with Google successfully', 'Success');
            // updateUserIfEmpty(firebaseUser);
            $state.go('admin');
          })
          .catch(function(error) {
            toastr.error(error.message, error.reason);
          })
      }

      // FACEBOOK AUTH
      $scope.facebookAuth = function() {
        var provider = new firebase.auth.FacebookAuthProvider();
        provider.addScope('email');

        Auth.$signInWithPopup(provider)
          .then(function(firebaseUser) {
            toastr.success('Logged in with Google successfully', 'Success');
            $state.go('home');
          })
          .catch(function(error) {
            toastr.error(error.message, error.reason);
          })
      }
    }
  ])

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

angular.module('madeWithFirebase')

.controller('DetailController', ['$scope', '$rootScope', '$state',
    '$stateParams', 'DatabaseRef', '$firebaseObject', 'Auth', '$anchorScroll',
    function($scope, $rootScope, $state, $stateParams,
        DatabaseRef, $firebaseObject, Auth, $anchorScroll) {

        $anchorScroll();

        $scope.loading = true;

        var fire = $firebaseObject(DatabaseRef.child('fire').child($stateParams.fireId));

        // Make the auth available in the scope for checking who
        // owns a piece.
        Auth.$onAuthStateChanged(function(firebaseUser) {
            if (firebaseUser) {
                console.log("Signed in as:", firebaseUser.uid);
                $scope.firebaseUserUid = firebaseUser.uid;
            } else {
                console.log("Not logged in");
            }
        });

        fire.$loaded()
            .then(function(data) {
                $scope.loading = false;
                $scope.fire = data;
                if ($scope.firebaseUserUid = $scope.fire.uid) {
                    $scope.allowed = true;
                    console.log($scope.allowed);
                };
            });


        // Let's handle deletion
        $scope.deleteFire = function() {
            swal({
                    title: "Are you sure?",
                    text: "You will not be able to reverse this process",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#DD6B55",
                    confirmButtonText: "Yes, delete it!",
                    closeOnConfirm: false
                },
                function() {
                    console.log('deleting fire');
                    console.log($scope.allowed);

                    if ($scope.allowed) {
                        console.log('delete happened');
                        fire.$remove()
                            .then(function(ref) {
                                swal("Deleted!", "Resource deletion is complete.", "success");
                                $state.go('admin');
                                toastr.success('Deletion done!', 'Finished Deletion')
                            });

                    } else {
                        toastr.error('You aint doing anything');
                    }
                });
        }

    }

]);

angular.module('madeWithFirebase')

.controller('EditController', ['$scope', '$firebaseObject',
    'DatabaseRef', '$stateParams', 'currentAuth', 'resizeService',
    function($scope, $firebaseObject,
        DatabaseRef, $stateParams, currentAuth, resizeService) {

        var fire = $firebaseObject(DatabaseRef.child('fire').child($stateParams.fireId));

        $scope.loading = true;

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
            }
            // compare created by to user to edit
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

angular.module('madeWithFirebase')

.controller('emailVerifyController', ['$scope', '$stateParams', 'currentAuth', 'DatabaseRef',
  function($scope, $stateParams, currentAuth, DatabaseRef) {
    console.log(currentAuth);
    $scope.doVerify = function() {
      firebase.auth()
        .applyActionCode($stateParams.oobCode)
        .then(function(data) {
          // change emailVerified for logged in User
          toastr.success('Verification happened', 'Success!');
        })
        .catch(function(error) {
          $scope.error = error.message;
          toastr.error(error.message, error.reason, { timeOut: 0 });
        })
    };
  }
])

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

angular.module('madeWithFirebase')
  .controller('MenuController', ['$scope', 'Auth', '$state', function($scope, Auth, $state) {

    Auth.$onAuthStateChanged(function(firebaseUser) {
      if (firebaseUser != null) {
        $scope.loggedIn = true;
      } else {
        $scope.loggedIn = false;
      }
    })

    $scope.logout = function() {
      Auth.$signOut();
      Auth.$onAuthStateChanged(function(firebaseUser) {
        console.log('loggedout');
      });
      $state.go('login');
    }
  }])

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
                    size:306,
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

$(document).foundation();

toastr.options = {
  "closeButton": false,
  "debug": false,
  "newestOnTop": false,
  "progressBar": false,
  "positionClass": "toast-top-right",
  "preventDuplicates": false,
  "onclick": null,
  "showDuration": "300",
  "hideDuration": "1000",
  "timeOut": "5000",
  "extendedTimeOut": "1000",
  "showEasing": "swing",
  "hideEasing": "linear",
  "showMethod": "fadeIn",
  "hideMethod": "fadeOut"
}

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

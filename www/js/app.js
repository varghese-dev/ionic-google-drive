// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', [
  'ionic',
  'ngCordova'
])

    .run(function ($rootScope, $state, $ionicPlatform) {

      $ionicPlatform.ready(function () {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins.Keyboard) {
          cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }
        if (window.StatusBar) {
          StatusBar.styleDefault();
        }
      });
    })

    .config(function ($stateProvider, $urlRouterProvider, $ionicConfigProvider, $locationProvider) {
      $ionicConfigProvider.views.maxCache(0);

      $stateProvider

          .state('welcome', {
            url: '/welcome',
            views: {
              'menuContent': {
                templateUrl: 'templates/welcome.html',
                controller: 'WelcomeCtrl'
              }
            }
          })
          .state('drive', {
            url: '/drive',
            views: {
              'menuContent': {
                templateUrl: 'templates/drive.html',
                controller: 'DriveCtrl'
              }
            }
          });

      $urlRouterProvider.otherwise('/welcome');
    })
    .controller('AppCtrl', ['$rootScope', '$scope', function ($rootScope, $scope) {

    }])
    .controller('WelcomeCtrl', function ($scope, Drive, $state, $window) {
      $scope.loginByGoogle = function () {

        var scopes = [
          'https://www.googleapis.com/auth/userinfo.profile',
           'https://www.googleapis.com/auth/drive',
            'https://www.googleapis.com/auth/drive.file',
             'https://www.googleapis.com/auth/userinfo.email'
            ];
        Drive.authenticate(scopes, {redirect_uri: 'http://localhost/callback'})
            .then(function (response) {//authenticate
              if (response) {
                //Access token received on authorization and to be sent as part of all requests
                var token = response.access_token;
                $state.go('drive');
              }
            },
            function (error) {
              console.log("" + error);
            });

      };
    })
    .controller('DriveCtrl', function ($scope, Drive) {
      $scope.files = [];
      $scope.userName = '';
      $scope.nextPageToken = '';
      $scope.moredata = true;

      $scope.about = function() {
        Drive.about().then(function (about) {
          $scope.userName = about.user.displayName;
        }, function () {
          console.log("About API failed");
          $scope.userName = 'Error!';
        });
      }

      $scope.readFiles = function () {
        Drive.readFiles($scope.nextPageToken).then(function (data) {
          if($scope.files.length >= 100) {
              $scope.moredata=true;
          }
          else {
            for (var index = 0; index < data.files.length; index++) {
              $scope.files.push(data.files[index]);   
            }
            $scope.nextPageToken = data.nextPageToken;
            $scope.moredata = false;
          }
          console.log("FileRead: success.");
          $scope.$broadcast('scroll.infiniteScrollComplete');
        }, function () {
          console.log("FileRead: error.");
          $scope.$broadcast('scroll.infiniteScrollComplete');
        });
      };

      $scope.about();
      $scope.readFiles();

    });

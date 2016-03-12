var myApp = angular.module('myApp', ['ngRoute', 'ngAnimate', 'ui.date']);

myApp.config(function ($routeProvider) {

    $routeProvider
        .when('/', {
            templateUrl: 'pages/login.html',
            controller: 'loginCtrl'
        })
        .when('/home', {
            resolve: {
                "check": function ($location, $rootScope) {
                    if (!$rootScope.loggedIn) {
                        $location.path('/');
                    }
                }
            },
            templateUrl: 'pages/home.html',
            controller: 'homeCtrl'
        })
        .when('/register', {
            resolve: {
                "check": function ($location, $rootScope) {
                    if (!$rootScope.loggedIn) {
                        $location.path('/');
                    }
                }
            },
            templateUrl: 'pages/register.html',
            controller: 'registerCtrl'
        })

    .when('/profile', {
            resolve: {
                "check": function ($location, $rootScope) {
                    if (!$rootScope.loggedIn) {
                        $location.path('/');
                    }
                }
            },
            templateUrl: 'pages/profile.html',
            controller: 'profileCtrl'
        })
        .when('/error', {
            templateUrl: 'pages/404.html',
            controller: 'errorCtrl'
        })
        .otherwise({
            redirectTo: '/error'
        });
});


//login Controller starts
myApp.controller('loginCtrl', function ($scope, $location, $rootScope, $http) {
    $scope.bg = "#525564";
    $rootScope.loggedIn = false;
    $scope.submit = function () {


        $scope.isLoading = true;

        $http({

            method: 'get',
            url: 'https://api.backand.com:443/1/objects/userLogin?pageSize=20&pageNumber=1',
            headers: {
                'AnonymousToken': '9be2ef1b-0af7-4582-a0cb-45b0a8667739'
            }

        })

        .then(function (response) {

                if ($scope.username === response.data.data[0].username &&
                    $scope.password === response.data.data[0].password) {
                    $rootScope.loggedIn = true;
                    $location.path('/home');
                } else {
                    $scope.showMessage = false;
                    $scope.message = "Wrong username or password!";
                }

                $scope.isLoading = false;

            },
            function errorCallback(response) {
                alert('Could not connect to server');
                $scope.isLoading = false;
                // called asynchronously if an error occurs
                // or server returns response with an error status.
            });



    };
});
//login Controller Ends


//home Controller starts
myApp.controller('homeCtrl', function ($scope) {
    $scope.bg = "#74828F";
});
//home controller ends

//register Controller Starts
myApp.controller('registerCtrl', function ($scope, $location, $http) {

    $scope.bg = "#96C0CE";


    $scope.dateOptions = {
        changeYear: true,
        changeMonth: true,
        yearRange: '1951:1998'
    };

    $scope.checkEmail = function () {

        return $http({
                method: 'GET',
                url: 'https://api.backand.com:443/1/objects/users',
                headers: {
                    'AnonymousToken': '9be2ef1b-0af7-4582-a0cb-45b0a8667739'
                },
                params: {
                    pageSize: 1,
                    pageNumber: 1,
                    filter: [
                        {
                            fieldName: 'email',
                            operator: 'equals',
                            value: $scope.email
      }
    ],
                    sort: ''
                }
            })
            .then(function (response) {

                    if ($scope.email === response.data.data[0].email) {
                        $scope.emailError = "Email is already in use!";
                        $scope.hideEmailError = false;
                    }

                },
                function errorCallback(response) {
                    alert('Could not connect to server');
                });
    };

    $scope.register = function () {


        $scope.isSaving = true;

        var data = {
            name: $scope.name,
            fname: $scope.fname,
            dob: $scope.dob,
            email: $scope.email,
            mobile: $scope.mobile
        };


        $http({
            method: 'post',
            url: 'https://api.backand.com:443/1/objects/users',
            data: data,
            headers: {
                'AnonymousToken': '9be2ef1b-0af7-4582-a0cb-45b0a8667739'
            }
        }).then(function () {

                $location.path('/profile');
                $scope.isSaving = false;
            },
            function errorCallback(response) {
                alert('Could not connect to server');
                $scope.isSaving = false;

            });



    };



});
//Register Controller Ends


//profile Controller starts
myApp.controller('profileCtrl', function ($scope, $http) {
    $scope.bg = "#C25B56";

    $http({
            method: 'GET',
            url: 'https://api.backand.com:443/1/objects/users',
            headers: {
                'AnonymousToken': '9be2ef1b-0af7-4582-a0cb-45b0a8667739'
            },
            params: {
                pageSize: 20,
                pageNumber: 1,
                sort: ''
            }
        })
        .then(function (response) {
                $scope.users = response.data.data;
            },
            function errorCallback(response) {
                alert('Connection to server failed! Try Again');

            });
});



//profile controller ends

//error controller starts
myApp.controller('errorCtrl', function ($scope, $rootScope) {
    $rootScope.loggedIn = false;
});
//error controller ends

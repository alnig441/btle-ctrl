var app = angular.module('myApp', ['ngMaterial','ngRoute','ngAnimate']);

app.config(function($routeProvider, $locationProvider, $mdThemingProvider){

    $mdThemingProvider.theme('default')
        .primaryPalette('deep-orange',{
            'default': '500',
            'hue-1': '100',
            'hue-2': '900'
        })
        .accentPalette('blue-grey');

    $locationProvider.html5Mode(true);
    $routeProvider
        .when('/admin', {
            templateUrl: 'views/admin.html',
            controller: 'adminViewCtrl'
        })
        .when('/default',{
            templateUrl: 'views/default.html',
            controller: 'panelViewCtrl'
        })
        .otherwise({redirectTo: '/default'});




});



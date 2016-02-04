var app = angular.module('myApp', ['ngMaterial','ngRoute','ngAnimate']);

app.config(function($routeProvider, $locationProvider, $mdThemingProvider, $mdIconProvider){

    $mdThemingProvider.theme('default')
        .primaryPalette('deep-orange',{
            'default': '700',
            'hue-1': '100',
            'hue-2': '900'
        })
        .backgroundPalette('blue-grey', {
            'default': '100',
            'hue-1': '50',
            'hue-2': '900'
    });

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

    $mdIconProvider
        .defaultIconSet('https://fonts.googleapis.com/icon?family=Material+Icons');       // Register a default set of SVG icons

});



var app = angular.module("libraryApp", ["ngRoute"]);

app.config(function ($routeProvider) {

	$routeProvider
		.when("/",
		{

			templateUrl: "./app/partials/home.html"
		
		})
		.when("/login",
		{
			controller: "loginController",			
			templateUrl: "./app/partials/login.html"

		})	
		.when("/editUser",
		{		
			templateUrl: "./app/partials/editUser.html"

		})
		.when("/logoutUser",
		{		
			templateUrl: "./app/partials/home.html"

		})
		.when("/loggedInUser",
		{

			controller: "userServiceController",			
			templateUrl: "./app/partials/loggedInUser.html"

		})
		.when("/loggedInLibrarian",
		{

			controller: "librarianServiceController",			
			templateUrl: "./app/partials/loggedInLibrarian.html"

		})
		.when("/editBook",
		{

			controller: "librarianServiceController",			
			templateUrl: "./app/partials/editBook.html"

		})
		.when("/addBook",
		{

			controller: "librarianServiceController",			
			templateUrl: "./app/partials/addBook.html"

		})
		.otherwise({
			
			redirectTo: "/"
		
		});

});

//var libraryFactory = require("../factory/libraryFactory.js");


app.controller("libraryController", function ($rootScope, $scope, $http, $location){

	init();

	function init(){

		$rootScope.newUser = {};
		$rootScope.user = undefined;
		$rootScope.successfulLogin = false;

	}
	

	$scope.logout = function() {
	
		$rootScope.user = undefined;
		$rootScope.successfulLogin = false;
		$location.path("/login");
		//console.log($rootScope.user);
	};

	$scope.editUser = function() {

		$location.path("/editUser");

	};
	
	$scope.submitEditUser = function() {

		var submitEditUserData = {
	
			"id": $rootScope.user.id,
			"username": $rootScope.newUser.username,
			"password": $rootScope.newUser.password,
			"name": $rootScope.newUser.name

		};

		$http.post("/submitEditUser", submitEditUserData).then(

			function() {

				alert("Successfully completed edit! Relog to see updated user data!");
				$location.path("/loggedInUser");

			}
		);

	};

	/*$rootScope.updateUser = function(){

		var tmpUser = $rootScope.user;

		console.log("rootScope.user: " + $rootScope.user.name);

		$http.post("/refreshUserData", tmpUser).then(

			function(response) {

				$rootScope.user = angular.copy(response.data);

			}
		);

	}*/

});


app.controller("loginController", function($rootScope, $scope, $http, $location){

	console.log("loginController started...");
	//console.log($rootScope.newUser.username);
	//console.log($rootScope.newUser.password);
	
	


	$scope.login = function() {

		$scope.showProgressBar = true;

		$http.post("/login", $rootScope.newUser).then(

			function(response){
				
				$rootScope.user = angular.copy(response.data);

				console.log($rootScope.user.username);
				console.log($rootScope.user.password);

				$rootScope.newUser = {};

				if($rootScope.user.username === undefined || $rootScope.user.password === undefined){

					alert("Unsuccessful login!");
					$rootScope.successfulLogin = false;
					$location.path("/login");

				} else {

					$rootScope.successfulLogin = true;

					if($rootScope.user.position === 2){

						
						$location.path("/loggedInLibrarian");

					} else {

						
					 	$location.path("/loggedInUser");
					}

				}
				
				
			}
		);

	};





});

app.controller("userServiceController", function($rootScope, $scope, $http, $location){

	console.log("userServiceController started...");
	
	
	init();

	function init(){

		$scope.listRentalsAsked = false;
		$scope.listAllBooksAsked = false;
		$scope.listPendingRequestsAsked = false;
		$scope.listChange = false;
		$scope.rentalOrderBy = "bookID";
		$scope.booklistOrderBy = "bookID";
		$scope.rentalReverse = false;
		$scope.booklistReverse = false;
		$scope.rentalsTotal = calculateTotalRentals();
		$scope.pendingRequestsTotal = calculateTotalPendingRequests();
		

	}

	
	$scope.listRentals = function() {

		$scope.listRentalsAsked = true;
		//$scope.rentalsTotal = calculateTotalRentals();
			
	};

	$scope.closeRentals = function() {

		$scope.listRentalsAsked = false;

	};

	$scope.listAllBooks = function() {

		$http.get("/allBooks").then(

			function (response){

				$scope.books = angular.copy(response.data);
	
			}
		);

		$scope.listAllBooksAsked = true;
		

	};


	$scope.closeAllBooks = function() {

		$scope.listAllBooksAsked = false;
		$location.path("/loggedInUser");
		
	};

	$scope.refreshUserData = function(){

		$http.get("/refreshUserData", $rootScope.user).then(


			function(){
	
				console.log("rootScope.user.name: " + $rootScope.user.name);
				$rootScope.user = angular.copy(response.data);

			}

		);

	};


	$scope.listPendingRequests = function(){

		$scope.listPendingRequestsAsked = true;

	};

	$scope.closePendingRequests = function(){
		
		$scope.listPendingRequestsAsked = false;
		$location.path("/loggedInUser");

	};

	$scope.setRentalOrder = function(orderby){

		if(orderby === $scope.rentalOrderBy){

			$scope.rentalReverse = !$scope.rentalReverse;

		}
		$scope.rentalOrderBy = orderby;
	};

	$scope.setBooklistOrder = function(orderby){

		if(orderby === $scope.booklistOrderBy){

			$scope.booklistReverse = !$scope.booklistReverse;

		}
		$scope.booklistOrderBy = orderby;

	};


	$scope.requestBook = function(requestedBook){

		var requestData = {
			"requestUserID": $rootScope.user.id,
			"requestUserName": $rootScope.user.name,
			"requestBookID": requestedBook.bookID,
			"requestBookAuthor": requestedBook.author,
			"requestBookTitle": requestedBook.title
		};

		$http.post("/requestBook", requestData).then(
	
			function() {
				
				alert("Successful request! Relog to see updated request list!");
				$scope.listAllBooksAsked = false;
				$scope.listPendingRequestsAsked = false;
				$location.path("/loggedInUser");
				
			}			
		);

	};

	function calculateTotalRentals(){

		var total = 0;
		for (var i = 0; i < $rootScope.user.rentals.length; i++){

			total += 1;
		}
		return total;
	}

	function calculateTotalPendingRequests(){

		var total = 0;
		for (var i = 0; i < $rootScope.user.requests.length; i++){

			total += 1;
		}
		return total;
	}


});







app.controller("librarianServiceController", function($rootScope, $scope, $http, $location){

	console.log("librarianServiceController started...");

	init();

	function init(){

		$scope.listAllBooksAsked = false;
		$scope.hideBookID = true;
		$scope.newBookData = undefined;
		$scope.oldBook = undefined;
		$scope.extraAuthorName = "";
		$scope.listAllRentalsAsked = false;
		$scope.listAllRequestsAsked = false;

	}
	
	$scope.listAllBooks = function() {

		$http.get("/allBooks").then(

			function (response){

				$scope.books = angular.copy(response.data);
	
			}
		);

		$scope.listAllBooksAsked = true;
		
	};


	$scope.closeAllBooks = function() {

		$scope.listAllBooksAsked = false;
		
	};



	$scope.editBook = function(oldBook){
		
		$scope.oldBook = oldBook;
		$scope.newBookData = oldBook;
		$location.path("/editBook");
			
	};


	$scope.submitEditBook = function() {


		$http.post("/submitEditBook", $scope.newBookData).then(

			function(){
					
				$scope.newBookData = undefined;
				$location.path("/loggedInLibrarian");

			}

		);

	};


	$scope.addBook = function(){

		$location.path("/addBook");

	};

	$scope.submitAddBook = function() {


		$http.post("/submitAddBook", $scope.newBookData).then(

			function(){
					
				$scope.newBookData = undefined;
				$location.path("/loggedInLibrarian");

			}

		);

	};


	$scope.addAuthor = function(inpIndex) {

		var realIndex = inpIndex + 1;
		var createdBookID = parseInt(realIndex + "" + realIndex + "" + realIndex + "" +realIndex);

		console.log("createdBookID: " + createdBookID);

		$scope.selected = createdBookID;


	};

	$scope.setSelected = function(selected){

		$scope.selected = selected;

	};

	$scope.createExtraAuthor = function(inpBook, inpExtraAuthor) {

		var extraAuthorData = {

			"bookID" : inpBook.bookID,
			"extraAuthor": inpExtraAuthor

		};

		console.log("extraAuthor: " + inpExtraAuthor);

		$http.post("/createExtraAuthor", extraAuthorData).then(

			function() {

				$scope.listAllBooksAsked = false;
				$location.path("/loggedInLibrarian");

			}

		);

	};


	$scope.closeExtraAuthor = function() {

		$scope.selected = 0;

	};


	$scope.plusBookInstance = function(inpBook) {

		$http.post("/plusBookInstance", inpBook).then(

			function() {
		
				$scope.listAllBooksAsked = false;
				$location.path("/loggedInLibrarian");

			}

		);

	};


	$scope.minusBookInstance = function(inpBook) {

		$http.post("/minusBookInstance", inpBook).then(

			function() {
		
				$scope.listAllBooksAsked = false;
				$location.path("/loggedInLibrarian");

			}

		);

	};



	$scope.listAllRentals = function() {

		$scope.listAllRentalsAsked = true;
		

		$http.get("/getTotalRentals").then(

			function (response){

				$scope.summedRentals = response.data;
	
			}
		);
	};


	$scope.closeAllRentals = function() {

		$scope.listAllRentalsAsked = false;
		
	};



	$scope.listAllRequests = function() {

		$scope.listAllRequestsAsked = true;

		$http.get("/getTotalRequests").then(

			function (response){

				$scope.summedRequests = response.data;
	
			}
		);


	};

	$scope.closeAllRequests = function() {

		$scope.listAllRequestsAsked = false;
		
	};

	
	$scope.lendBook = function(inpRequestData){

		$http.post("/lendBook", inpRequestData).then(

			function(response){
		
				alert("Successfully completed request! Relog to see updated request list!");
				$scope.listAllRequestsAsked = false;
				$scope.listAllRentalsAsked = false;

			}

		);

	};




});











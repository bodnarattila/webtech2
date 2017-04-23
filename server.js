var express = require("express");
var fs = require("fs");
var bodyParser = require("body-parser");

app = express();

app.use(express.static(__dirname + ""));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true
}));

var user;



app.get("/", function(req, res){

	res.sendFile(__dirname + "index.html");

});

app.get("/currentUser", function(req, res){

	res.send(user);

});

app.get("/allUsers", function(req, res){

	var users = getAllUsers();
	res.send(users);

});

app.get("/allBooks", function(req, res){

	var books = getAllBooks();
	res.send(books);

});

app.post("/refreshUserData", function(req, res){

	var users = getAllUsers();
	var updatedUser;

	for(currentUser of users){

		console.log("req.body.id: " + req.body.id);
		console.log("currentUser.id: " + currentUser.id);
		console.log("req.body.rental.length: " + req.body.rentals.length);
		console.log("currentUser.rental.length: " + currentUser.rentals.length);

		if(req.body.id  === currentUser.id){

			updatedUser = currentUser;
			res.send(updatedUser);
			break;

		}

	}

	

});


app.get("/getTotalRentals", function(req, res){

	var users = getAllUsers();
	var totalRentals;
	var tempRentals;
	var finilizedRentals = [];

	for(var currentUser of users){

		tempRentals = currentUser.rentals;
		//console.log("tempRentals: " + tempRentals);
	
		if(tempRentals.length > 0){
		
			for( var rental of tempRentals){

				totalRentals = {

					"userID": currentUser.id,
					"name": currentUser.name,
					"bookID": rental.bookID,
					"author": rental.author,
					"title": rental.title

				};

				finilizedRentals.push(totalRentals);

			}

		} else {

			continue;
	
		}

	}

	fs.writeFileSync(__dirname + "/rentals.json", JSON.stringify(finilizedRentals), "utf8");

	res.send(finilizedRentals);


});

app.get("/getTotalRequests", function(req, res){

	res.send(JSON.parse(fs.readFileSync('./requests.json', 'utf8')));

});




app.post("/login", function(req, res){

	var users = getAllUsers();
	var tmpUser = undefined;
	
	for(var currentUser of users){

		if(currentUser.username === req.body.username && currentUser.password === req.body.password){

			tmpUser = currentUser;
			break;

		}
	}

	if(tmpUser === undefined){

		user = undefined;

	} else {

		user = tmpUser;

	}
	

	res.send(user);
 	

});




app.post("/submitEditUser", function(req, res){

	var users = getAllUsers();
	var requests = JSON.parse(fs.readFileSync(__dirname + "/requests.json", "utf8"));
	var rentals = JSON.parse(fs.readFileSync(__dirname + "/rentals.json", "utf8"));

	for(var currentUser of users){

		if(currentUser.id === req.body.id){

			console.log("currentUser.username: " + currentUser.username);
			console.log("currentUser.password: " + currentUser.password);
			console.log("currentUser.name: " + currentUser.name);

			currentUser.username = req.body.username;
			currentUser.password = req.body.password;
			currentUser.name = req.body.name;

			console.log("2currentUser.username: " + currentUser.username);
			console.log("2currentUser.password: " + currentUser.password);
			console.log("2currentUser.name: " + currentUser.name);

			break;
		}

	}

	for(var currentRequest of requests){

		if(currentRequest.userID === req.body.id){

			console.log("currentRequest.name: " + currentRequest.name);
	
			currentRequest.name = req.body.name;

			console.log("2currentRequest.name: " + currentRequest.name);

			break;

		}

	}

	for(var currentRental of rentals){

		if(currentRental.userID === req.body.id){

			console.log("currentRental.name: " + currentRental.name);
	
			currentRental.name = req.body.name;

			console.log("2currentRental.name: " + currentRental.name);

			break;

		}

	}


	fs.writeFileSync(__dirname + "/users.json", JSON.stringify(users), "utf8");
	fs.writeFileSync(__dirname + "/requests.json", JSON.stringify(requests), "utf8");
	fs.writeFileSync(__dirname + "/rentals.json", JSON.stringify(rentals), "utf8");

	res.end();

});


app.post("/submitEditBook", function(req, res){
	

	//console.log("Editing book");
	var books = getAllBooks();

	for(var currentBook of books){

		/*console.log("currentBook.bookID: "+ currentBook.bookID);
		console.log("req.body.bookID: "+ searchBookID);*/	

		if(currentBook.bookID === req.body.bookID){

			currentBook.author = req.body.author;
			currentBook.title = req.body.title;
			currentBook.genre = req.body.genre;
			currentBook.quantity = req.body.quantity;
			currentBook.status = req.body.status;
			/*console.log("currentBook.author: " + currentBook.author);
			console.log("currentBook.title: " + currentBook.title);
			console.log("currentBook.genre: " + currentBook.genre);
			console.log("currentBook.quantity: " + currentBook.quantity);
			console.log("currentBook.status: " + currentBook.status);*/
			break;

		}
	}

	fs.writeFileSync(__dirname + "/inventory.json", JSON.stringify(books), "utf8");
	res.end();
	

});

app.post("/submitAddBook", function(req, res){
	

	//console.log("Adding book");
	var books = getAllBooks();

	var newBook = {
		"bookID": req.body.bookID,
		"author": req.body.author,
		"title": req.body.title,
		"genre": req.body.genre,
		"status": req.body.status
	};

	books.push(newBook);

	fs.writeFileSync(__dirname + "/inventory.json", JSON.stringify(books), "utf8");
	res.end();
	
});

app.post("/createExtraAuthor", function(req, res){

	var books = getAllBooks();

	for(var currentBook of books){

		/*console.log("currentBookID: " + currentBook.bookID + ", reqBookID: " + req.body.bookID);
		console.log("req.body.extraAuthor: " + req.body.extraAuthor);*/

		if(currentBook.bookID === req.body.bookID){

			currentBook.author = currentBook.author + ", " + req.body.extraAuthor;
			break;

		}

	}
	
	fs.writeFileSync(__dirname + "/inventory.json", JSON.stringify(books), "utf8");
	res.end();
	

});

app.post("/plusBookInstance", function(req, res){

	var books = getAllBooks();

	for(var currentBook of books){

		if(currentBook.bookID === req.body.bookID){

			if(currentBook.status === 0){

				currentBook.quantity += 1;
				currentBook.status = 1;
				break;
 
			} else {

				if(currentBook.quantity < 100){

					currentBook.quantity += 1;
					break;

				} else {

					currentBook.quantity = 100;
					break;
				}
			}
		}
	}
	

	fs.writeFileSync(__dirname + "/inventory.json", JSON.stringify(books), "utf8");
	res.end();
	

});

app.post("/minusBookInstance", function(req, res){

	var books = getAllBooks();

	for(var currentBook of books){

		if(currentBook.bookID === req.body.bookID){

			if(currentBook.status === 0){

				break;
 
			} else {

				if(currentBook.quantity > 0){

					currentBook.quantity -= 1;
					if(currentBook.quantity === 0){

						currentBook.status = 0;

					}
					break;

				} else if (currentBook.quantity <= 0){

					currentBook.quantity = 0;
					currentBook.status = 0;
					break;
				}
			}
		}
	}
	

	fs.writeFileSync(__dirname + "/inventory.json", JSON.stringify(books), "utf8");
	res.end();
	

});


app.post("/requestBook", function(req, res){

	var requests = JSON.parse(fs.readFileSync(__dirname + "/requests.json", "utf8"));
	var id = requests.length + 1;
	var newRequest = {

		"id": id,
		"userID": req.body.requestUserID,
		"name": req.body.requestUserName,
		"bookID": req.body.requestBookID,
		"author": req.body.requestBookAuthor,
		"title": req.body.requestBookTitle
	};

	requests.push(newRequest);

	fs.writeFileSync(__dirname + "/requests.json", JSON.stringify(requests), "utf8");

	var requestedBook = getBookByID(req.body.requestBookID);

	console.log("requestedBook: " +requestedBook.title);	

	var users = getAllUsers();
	
	for(var user of users){

		if(user.id === req.body.requestUserID){

			var nextRequestID = newRequestID(req.body.requestUserID);

			user.requests[nextRequestID] = requestedBook;

		}

	}	
	
	fs.writeFileSync(__dirname + "/users.json", JSON.stringify(users), "utf8");

	res.end();
});


app.post("/lendBook", function(req, res){

	/*
		"id": id,
		"userID": 
		"name": 
		"bookID": 
		"author": 
		"title": 
	*/

	//
	//1. delete from requests.json
	//	
	var requests = JSON.parse(fs.readFileSync(__dirname + "/requests.json", "utf8"));

	var spliceIndex = 0;

	for(var request of requests){

		spliceIndex += 1;

		console.log("spliceIndex: " + spliceIndex);

		if(request.id === req.body.id){

			requests.splice((spliceIndex - 1), 1);

		}
	}

	fs.writeFileSync(__dirname + "/requests.json", JSON.stringify(requests), "utf8");


	//2. minus 1 from quantity and status check
	//
	var books = getAllBooks();
	var newRequestList = [];

	for(var currentBook of books){

		if(currentBook.bookID === req.body.bookID){

			currentBook.quantity -= 1;

			if(currentBook.quantity <= 0){

				currentBook.quantity = 0;
				currentBook.status = 0;

				// remove all further requests for that book

				for(var request_tmp of requests){
			
					

					if(request_tmp.bookID !== currentBook.bookID){


						newRequestList.push(request_tmp);
						

					}
				}
				fs.writeFileSync(__dirname + "/requests.json", JSON.stringify(newRequestList), "utf8");

			}

		}

	}

	fs.writeFileSync(__dirname + "/inventory.json", JSON.stringify(books), "utf8");


	//3. delete from user.requests[] and add to user.rentals[]
	//
	var users  = getAllUsers();
	var updatedBooks = getAllBooks();
	var rentedBook;
	var newUserRequestList = [];

	for(var book of updatedBooks){

		if(book.bookID === req.body.bookID){

			rentedBook = book;

		}
	}

	for(var currentUser of users){

		if(currentUser.id === req.body.userID){

			for(var currentRequest of currentUser.requests){


				if(currentRequest.bookID !== req.body.bookID){

					newUserRequestList.push(currentRequest);

				}

			}
			currentUser.requests = newUserRequestList;
			currentUser.rentals.push(rentedBook);

		}

	}

	

	

	fs.writeFileSync(__dirname + "/users.json", JSON.stringify(users), "utf8");
	fs.writeFileSync(__dirname + "/inventory.json", JSON.stringify(updatedBooks), "utf8");


	res.end();

});



// FUNCTIONS ------------------------------------------------------------

function getAllUsers(){

	return JSON.parse(fs.readFileSync('./users.json', 'utf8'));

}

function getAllBooks(){

	return JSON.parse(fs.readFileSync('./inventory.json', 'utf8'));

}

function getBookByID(requestedBookID){

	var books = getAllBooks();
	var requestedBook;

	for(var book of books){

		if(book.bookID === requestedBookID){

			requestedBook = book;		

		}
	}
	return requestedBook;
}

function getUserByID(requestedUserID){

	var users = getAllUsers();
	var requestedUser;

	for(var currentUser of users){

		if(currentUser.id === requestedUserID){

			requestedUser = currentUser;		

		}
	}
	return requestedUser;

}

function newRequestID(requestedUserID){

	var user = getUserByID(requestedUserID);
	var numOfRequests = 0;
	
	for(var request in user.requests){
		numOfRequests += 1;
	}
	
	return numOfRequests;
}

app.listen(8081);
console.log("Library application listening at http://localhost:8081");

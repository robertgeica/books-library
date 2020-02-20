// web app's firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyA_tzhAFK61r5NrcXKrFst62SFFP884L7M",
    authDomain: "mylibrary-26c0e.firebaseapp.com",
    databaseURL: "https://mylibrary-26c0e.firebaseio.com",
    projectId: "mylibrary-26c0e",
    storageBucket: "mylibrary-26c0e.appspot.com",
    messagingSenderId: "990145479699",
    appId: "1:990145479699:web:e31e8d82262eeacb672be6"
};

// initialize firebase
firebase.initializeApp(firebaseConfig);
// get reference to database
let database = firebase.database();
// database reference location
let databaseRef = database.ref('books');

// event value will have two callbacks
databaseRef.on('value', getData, errorData);

// let myLibrary = [];

// book constructor
function Book(title, author, pages, read) {
    this.id = Date.now();
    this.title = title;
    this.author = author; 
    this.pages = pages;
    this.read = read;
    // this.info = function() {
    //     return `${title} by ${author}, ${pages}, ${read}`;
    // }
}

const addBookToLibrary = (e) => {
    e.preventDefault();

    // get values from user form
    let bookTitle = document.getElementById('bookTitle').value;
    let bookAuthor = document.getElementById('bookAuthor').value;
    let bookPages = document.getElementById('bookPages').value;
    let bookRead = document.getElementById('bookRead').value;

    // check for empty form
    if(bookTitle !== "" && bookAuthor !== "" && !isNaN(bookPages) && bookPages !== "") {
        let myBook = new Book(bookTitle, bookAuthor, bookPages, bookRead);
        // push myBook object to database
        databaseRef.push(myBook);
        console.log('Pushed to database')
    } else {
        console.log('Complete form correctly')
    }

}

// trigger function on btn click
let submitButton = document.getElementById('btn');
submitButton.addEventListener('click', addBookToLibrary);

// retrieve data from database
function getData(data) {
    // select all li elements with listingBook class
    let listingBooks = document.getElementsByClassName("listingBook");
    // iterate through all elements with listingBook class
    for(let i=0; i<listingBooks.length; i++) {
        listingBooks[i].style.display = 'none'; // hide to prevent multiplication
    }

    // get object representation of the data
    let books = data.val();
    // get keys of elements from database
    let keys = Object.keys(books);


    // iterate through the database keys
    let title, author, pages, read;
    for(let i=0; i<keys.length; i++) {
        let k = keys[i];
        title = books[k].title;
        author = books[k].author;
        pages = books[k].pages;
        read = books[k].read;

        // display on page
        let li = document.createElement('li');
        // append ol and append li elements to it

        const ol = document.createElement('ul').appendChild(li);
        ol.style = 'list-style-type: none';

        // add listingBook class to all elements from list
        li.classList.add('listingBook');

        li.innerHTML = `${title} by ${author}, ${pages}, ${read}`;
        document.body.appendChild(ol); // show ol to the page
    }
}


function errorData(error) {
    console.log('something happen: ' + error);
}



/* TODO: 
    modify read to three options: read, unread, reading
    optional: add isbn, completed pages
    do not allow to write letters on pages form
    add image from url
    add popup when invalid input
    implement delete
    implement update
    implement search
    implement ratings
    implement sorting
    add informations page (total books, completed books, total pages, total completed pages)

*/
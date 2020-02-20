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
    let title, author, pages, read, id;
    for(let i=0; i<keys.length; i++) {
        let k = keys[i];
        title = books[k].title;
        author = books[k].author;
        pages = books[k].pages;
        read = books[k].read;
        id = books[k].id;

        // display on page
        const ul = document.createElement('ul');
        const li = document.createElement('li');
        const cross = document.createElement('div');
        const updateButton = document.createElement('button');

        // add listingBook class to all elements from list
        li.classList.add('listingBook');
        // add key as data atribute to every list element
        li.setAttribute('data-id', k);
        // set content of cross to 'X'
        cross.textContent = 'X';
        // set content of update button to 'update'
        updateButton.textContent = 'update';

        // append li elements to ul and set style to none
        ul.appendChild(li);
        ul.style = 'list-style-type: none';

        // show title, author, pages, read and id on page
        li.innerHTML = `${title} by ${author}, ${pages}, ${read} with id ${id}`;
        // append ol to body
        document.body.appendChild(ul);
        // append cross and update to li
        li.appendChild(cross);
        li.appendChild(updateButton);

        // delete book from database on cross click
        cross.addEventListener('click', (e) => {
            e.stopPropagation();
            // get key on cross click
            let bookKey = e.target.parentElement.getAttribute('data-id'); 
            // get reference to database key
            let keyRef = database.ref('books').child(bookKey);

            keyRef.remove().then(function() {
                console.log('deleted successfully');
            }).catch(function(error) {
                console.log('error happen on delete');
            });
        });


        // update book 
        updateButton.addEventListener('click', (e) => {
            e.stopPropagation();

            let modal = document.getElementById('updateModal');
            let modalBtn = document.getElementById('modalBtn');
            let span = document.getElementsByClassName('close')[0];
            let updateBook = document.getElementById('updateBook');

            // display modal
            modal.style.display = 'block';

            // close modal when user clicks on span
            span.onclick = function() {
                modal.style.display = 'none';
            }

            // get key on cross click
            let bookKey = e.target.parentElement.getAttribute('data-id'); 
            // get reference to database key
            let keyRef = database.ref('books').child(bookKey);
            
            // update book record from modal form
            updateBook.addEventListener('click', () => {
                keyRef.update({
                    title: document.getElementById('updateTitle').value,
                    author: document.getElementById('updateAuthor').value,
                    pages: document.getElementById('updatePages').value,
                    read: document.getElementById('updateRead').value
                });
            });
        });
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
    implement update
    implement search
    implement ratings
    implement sorting
    add informations page (total books, completed books, total pages, total completed pages)

*/

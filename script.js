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

// book constructor
function Book(title, author, pages, completedPages, status) {
    this.id = Date.now();
    this.title = title;
    this.author = author; 
    this.pages = pages;
    this.completedPages = completedPages;
    this.status = status;
}


let addBookButtonModal = document.getElementById('addBookButton-modal'); //the button which open add modal 
let addBookModal = document.getElementById('addBook-modal'); // the modal
let closeAddModal = document.getElementsByClassName("closeModal")[0]; // the close modal button

// display modal on btn click
addBookButtonModal.onclick = () => {
    addBookModal.style.display = 'block';
    console.log('modal on screen');
}

// hide modal on 'X' click
closeAddModal.onclick = () => {
    addBookModal.style.display = 'none';
    console.log('modal off screen (x)');
}

// hide modal on window click
window.onclick = (e) => {
    if(e.target == addBookModal) {
        addBookModal.style.display = 'none';
        console.log('modal off screen (w)');
    }
}

// add book function
const addBookToLibrary = (e) => {
    e.preventDefault();

    // get values from user form
    let bookTitle = document.getElementById('bookTitle').value;
    let bookAuthor = document.getElementById('bookAuthor').value;
    let bookPages = document.getElementById('bookPages').value;
    let bookCompletedPages = document.getElementById('bookCompletedPages').value;
    let bookStatus = document.getElementById('bookStatus').value;

    // check for empty form or non number at pages
    if(bookTitle !== "" && bookAuthor !== "" && !isNaN(bookPages) && bookPages !== "" && !isNaN(bookCompletedPages) && bookCompletedPages !== '') {
        // create object
        let myBook = new Book(bookTitle, bookAuthor, bookPages, bookCompletedPages, bookStatus);

        // push myBook object to database
        databaseRef.push(myBook);
        
        // feedback to user
        Swal.fire(
            'Succes!',
            `${bookTitle} has been added!`,
            'success'
        );
    } else {
        Swal.fire({
            icon: 'error',
            title: 'Error!',
            text: 'You typed something wrong!'
        });
    }

}

// trigger function on btn click
let submitBookBtn = document.getElementById('submitBookBtn');
submitBookBtn.addEventListener('click', addBookToLibrary);


// retrieve data from database
function getData(data) {
    // select all rows with listingBook class
    let listingBooks = document.getElementsByClassName("listingBook");
    // iterate through all rows with listingBook class
    for(let i=0; i<listingBooks.length; i++) {
        listingBooks[i].style.display = 'none'; // hide to prevent multiplication
    }

    // get object representation of the data
    let books = data.val();
    // get keys of elements from database
    let keys = Object.keys(books);
    
    // iterate through the database keys
    let title, author, pages, completedPages, status, id;
    let sumPages = 0, sumCompletedPages = 0, completedBooks = 0;

    for(let i=0; i<keys.length; i++) {
        let k = keys[i];
        title = books[k].title;
        author = books[k].author;
        pages = books[k].pages;
        completedPages = books[k].completedPages;
        status = books[k].status;
        id = books[k].id;

        // get infos about books
        function infoBooks() {
            // total books
            document.getElementById('total-books').innerHTML = `Total books: ${parseInt(i)+1}`;

            // total pages
            if(pages) {
                sumPages = sumPages + parseInt(pages);
                document.getElementById('total-pages').innerHTML = `Total pages: ${sumPages}`;
            }

            // completed pages
            if(completedPages) {
                sumCompletedPages = sumCompletedPages + parseInt(completedPages);
                document.getElementById('completed-pages').innerHTML = `Completed pages: ${sumCompletedPages}`;
            }
          
            // completed books
            if(books[k].status == 'read') {
                completedBooks++;
                document.getElementById('completed-books').innerHTML = `Completed books: ${completedBooks}`;
            }

        }

        infoBooks();


        // display on page
        const deleteButton = document.createElement('div');
        let updateButton = document.createElement('div');

        // add deleteIcon class and icon to deletebutton
        deleteButton.classList.add('deleteIcon');
        deleteButton.classList.add('fas');
        deleteButton.classList.add('fa-trash-alt');

        // add updateBtn class and icon to updateButton
        updateButton.classList.add('updateBtn');
        updateButton.classList.add('fas');
        updateButton.classList.add('fa-edit');

        
        // display data to a table
        let table = document.getElementById('booksTable');
        let row = table.insertRow(-1);

        // add key as data atribute to every row
        row.setAttribute('data-id', k);
        // add listingBook class to every row to prevent multiplication
        row.classList.add('listingBook'); 

        // cell 0 => update button
        let cell0 = row.insertCell(0);
        cell0.appendChild(updateButton);

        // cell 1 => title
        let cell1 = row.insertCell(1);
        cell1.innerHTML = `${title}`;

        // cell 2 => author
        let cell2 = row.insertCell(2);
        cell2.innerHTML = `${author}`;

        // cell 3 => pages
        let cell3 = row.insertCell(3);
        cell3.innerHTML = `${pages}`;
        
        // cell 4 => completed pages
        let cell4 = row.insertCell(4);
        cell4.innerHTML = `${completedPages}`;

        // cell 5 => status
        let cell5 = row.insertCell(5);
        cell5.innerHTML = `${status}`;

        //cell 6 => id
        let cell6 = row.insertCell(6);
        cell6.innerHTML = `${id}`;

        // cell 7 => delete button
        let cell7 = row.insertCell(7);        
        cell7.appendChild(deleteButton);



        // delete book from database on cross click
        deleteButton.addEventListener('click', (e) => {
            e.stopPropagation();

            // get key on deleteButton click 
            let bookKey = row.getAttribute('data-id'); 
            console.log(row.getAttribute('data-id'));

            // get reference to database key
            let keyRef = database.ref('books').child(bookKey);

            // get confirmation on alert to delete
            Swal.fire({
                    title: 'Are you sure?',
                    text: "You won't be able to revert this!",
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Yes, delete it!'
            // if delete is confirmed
            }).then((result) => {
                if (result.value) {
                    // remove key from database
                    keyRef.remove().then(function() {
                        // deleted successfuly
                    }).catch(function(error) {
                        // error alert
                        Swal.fire({
                            icon: 'error',
                            title: 'Error!',
                            text: `Error: ${error}`
                        });
                    });

                    // delete alert
                    Swal.fire(
                        'Deleted!',
                        `${books[k].title} has been deleted.`,
                        'success'
                    );
                }
            });
            
        });

        // update book 
        updateButton.addEventListener('click', (e) => {
            e.stopPropagation();
            
            let modal = document.getElementById('update-modal');
            let closeUpdateModal = document.getElementsByClassName('closeModal')[1];
            let updateBookButton = document.getElementById('updateBookButton');

            // display modal
            modal.style.display = 'block';

            // close modal when user clicks on 'X'
            closeUpdateModal.onclick = () => {
                modal.style.display = 'none';
                console.log('hide on x click')
            }

            // close modal when user clicks on windows
            window.onclick = (e) => {
                if(e.target == modal) {
                    modal.style.display = 'none';
                    console.log('hide on w click');
                }
            }

            // get key on update btn click 
            let bookKey = row.getAttribute('data-id');
            // get reference to database key
            let keyRef = database.ref('books').child(bookKey);
                
            // update book record from modal form
            updateBookButton.onclick =  () => {
                keyRef.update({
                    title: document.getElementById('updateTitle').value,
                    author: document.getElementById('updateAuthor').value,
                    pages: document.getElementById('updatePages').value,
                    completedPages: document.getElementById('updateCompletedPages').value,
                    status: document.getElementById('updateStatus').value
                });

            };

        });
    }


}

function search() {
    let input, filter, table, tr, tdTitle, tdAuthor, text, text2;
    input = document.getElementById('search');
    filter = input.value.toUpperCase();
    table = document.getElementById('booksTable');
    tr = table.getElementsByTagName('tr');

    for(let i=0; i<tr.length; i++) {
        tdTitle = tr[i].getElementsByTagName('td')[1];
        tdAuthor = tr[i].getElementsByTagName('td')[2];

        console.log(tdTitle, tdAuthor);
        
        if(tdTitle || tdAuthor) {
            text = tdTitle.textcontent || tdTitle.innerText;
            text2 = tdAuthor.textcontent || tdAuthor.innerText;
            
            if(text.toUpperCase().indexOf(filter) > -1 || text2.toUpperCase().indexOf(filter) > -1) {
                tr[i].style.display = '';
            } else {
                tr[i].style.display = 'none';
            }
   
        }
    }
}


function sortTable(n) {
    let table = document.getElementById('booksTable');
    let tr = document.getElementsByTagName('tr');

    let shouldSwitchRows = false;
    let switchRows = true;
    let sortType = 'asc'; // set ascending sorting
    let count = 0;
    
    while(switchRows) {
        switchRows = false;

        for(let i=1; i<(tr.length-1); i++) {
            let row1 = tr[i].getElementsByTagName('td')[n];
            let row2 = tr[i+1].getElementsByTagName('td')[n];
            
            // console.log('row1: ' + row1.innerHTML);
            // console.log('row2: ' + row2.innerHTML);

            if(sortType == 'asc') {
                // console.log('sortType == asc');

                if(row1.innerHTML.toLowerCase() > row2.innerHTML.toLowerCase()) {
                    sswitch();
                    console.log('switched asc');
                    break;
                }

            }
            
            if(sortType == 'desc') {
                // console.log('sortType == desc');

                if(row1.innerHTML.toLowerCase() < row2.innerHTML.toLowerCase()) {
                    sswitch();
                    console.log('switched desc');
                    break;
                } 
            }

            function sswitch() {
                shouldSwitchRows = true;
                
                if(shouldSwitchRows) {
                    // console.log('switched elements');
                    if(sortType == 'asc') {
                        tr[i].parentNode.insertBefore(tr[i+1], tr[i]);
                        switchRows = true;
                        console.log('switched asc2');
                        // sortType = 'desc'; // if this is removes, sort is asc
                        
                    }
                    
                    if(sortType == 'desc') {
                        // tr[i].parentNode.insertBefore(tr[i+1], tr[i]);
                        switchRows = true;
                        console.log('switched desc2');
                    }

                } 
                
            }

        }
    }
  



}


function errorData(error) {
    Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: `Error: ${error}`
    });
}


class Book {
	constructor(title, author, isbn) {
		this.title = title;
		this.author = author;
		this.isbn = isbn;
	}
}

class UI {
	addBooktoList(book) {
		const list = document.querySelector('#book-list');
		// Create tr element
		const row = document.createElement('tr');
		// Insert cols
		row.innerHTML = `
			<td>${book.title}</td>
			<td>${book.author}</td>
			<td>${book.isbn}</td>
			<td><a href="#" class="delete">X</a></td>
		`;
	
		list.appendChild(row);
	}

	showAlert(message, className) {
		// Create div
		const div = document.createElement('div');
		// Add classes
		div.className = `alert ${className}`;
		// Add text
		div.appendChild(document.createTextNode(message));
		// Get parent
		const container = document.querySelector('.container');
		// Get form
		const form = document.querySelector('#book-form');
		// Insert alert
		container.insertBefore(div, form);

		// Timeout
		setTimeout(() => {
			document.querySelector('.alert').remove();
		}, 2000);
	}

	deleteBook(target) {
		if (target.className === 'delete') {
			target.parentElement.parentElement.remove();
		}
	}

	clearFields() {
		document.querySelector('#title').value = '';
		document.querySelector('#author').value = '';
		document.querySelector('#isbn').value = '';
	}

}

// Local Storage Class/
class Store {
	static getBooks() {
		let books;
		if (localStorage.getItem('books') === null) {
			books = [];
		} else {
			books = JSON.parse(localStorage.getItem('books'));
		}

		return books;
	}

	static displayBooks() {
		const books = Store.getBooks();

		books.forEach((book) => {
			const ui = new UI;

			// Add book to UI
			ui.addBooktoList(book);
		});
	}

	static addBook(book) {
		const books = Store.getBooks();

		books.push(book);

		localStorage.setItem('books', JSON.stringify(books));
	}

	static removeBook(isbn) {
		const books = Store.getBooks();

		books.forEach((book, index) => {
			if (book.isbn === isbn) {
				books.splice(index, 1);
			}
		});

		localStorage.setItem('books', JSON.stringify(books));
	}
}

// DOM Load Event
document.addEventListener('DOMContentLoaded', Store.displayBooks);

// Event Listeners for Add Book
document.querySelector('#book-form').addEventListener('submit', function(e) {
	// Get form values
	const title = document.querySelector('#title').value,
				author = document.querySelector('#author').value,
				isbn = document.querySelector('#isbn').value;
	
	// Instantiate book
	const book = new Book(title, author, isbn);

	// Instantiate UI
	const ui = new UI();

	// Validate
	if (title === '' || author === '' || isbn === '') {
		// Error Alert
		ui.showAlert('Please fill in all fields', 'error')
	} else {
		// Add book to list
		ui.addBooktoList(book);

		// Add book to LS
		Store.addBook(book);

		// Show success
		ui.showAlert('Book added', 'success');

		// Clear fields after submit
		ui.clearFields();
	}

	e.preventDefault();
});

// Event Listener for delete book
document.querySelector('#book-list').addEventListener('click', function(e) {
	
	// Instantiate UI
	const ui = new UI();

	// Delete book
	ui.deleteBook(e.target);

	// Remove from LS
	Store.removeBook(e.target.parentElement.previousElementSibling.textContent);

	// Show message
	ui.showAlert('Book removed', 'success');

	// console.log(e.target.classList.contains('delete'));
	e.preventDefault();
});
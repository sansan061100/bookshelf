const Books = require('./controllers/books');
const routes = [
    {
        method: 'GET',
        path: '/books',
        handler: Books.listBooks,
    },
    {
        method: 'POST',
        path: '/books',
        handler: Books.addBook
    },
    {
        method: 'GET',
        path: '/books/{bookId}',
        handler: Books.detailBook
    },
    {
        method: 'PUT',
        path: '/books/{bookId}',
        handler: Books.updateBook
    },
    {
        method: 'DELETE',
        path: '/books/{bookId}',
        handler: Books.deleteBook
    }
];

module.exports = routes;
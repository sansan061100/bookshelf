const { listBooks, addBook, detailBook, updateBook, deleteBook } = require('./handlers');
const routes = [
    {
        method: 'GET',
        path: '/books',
        handler: listBooks,
    },
    {
        method: 'POST',
        path: '/books',
        handler: addBook
    },
    {
        method: 'GET',
        path: '/books/{bookId}',
        handler: detailBook
    },
    {
        method: 'PUT',
        path: '/books/{bookId}',
        handler: updateBook
    },
    {
        method: 'DELETE',
        path: '/books/{bookId}',
        handler: deleteBook
    }
];

module.exports = routes;
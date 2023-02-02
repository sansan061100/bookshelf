const fs = require('fs');

function Book() {
    const rawData = fs.readFileSync('./src/books.json');
    const books = JSON.parse(rawData);

    return books;
}

const { nanoid } = require('nanoid');

const listBooks = (request, h) => {
    const books = Book();
    const { reading, finished, name } = request.query;
    const filterBook = books.filter((book) => {
        if (reading == undefined || finished == undefined || name == undefined) {
            return book;
        } else {
            if (reading != null || reading != "") {
                return book.reading == reading;
            }

            if (finished != null || finished != "") {
                return book.finished == (finished == 1 ? true : false);
            }

            if (name != null || name != "") {
                return book.indexOf(name) > -1;
            }
        }
    });

    return h.response({
        status: "success",
        data: {
            books: filterBook.map((book) => {
                return {
                    id: book.id,
                    name: book.name,
                    publisher: book.publisher
                }
            })
        }
    }).code(200);
};

const addBook = (request, h) => {
    const books = Book();
    const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;
    const id = nanoid(16);
    const finished = pageCount === readPage;
    const insertedAt = new Date().toISOString();
    const updatedAt = insertedAt;

    if (!name) {
        return h.response({
            status: "fail",
            message: "Gagal menambahkan buku. Mohon isi nama buku",
        }).code(400);
    }

    if (readPage > pageCount) {
        return h.response({
            "status": "fail",
            "message": "Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount",
        }).code(400);
    }

    try {
        let newBook = {
            id,
            name,
            year,
            author,
            summary,
            publisher,
            pageCount,
            readPage,
            finished,
            reading,
            insertedAt,
            updatedAt
        }

        // push array buku baru ke array buku json
        books.push(newBook)
        let data = JSON.stringify(books);

        fs.writeFileSync('./src/books.json', data);

        return h.response({
            "status": "success",
            "message": "Buku berhasil ditambahkan",
            "data": {
                "bookId": id,
            },
        }).code(201);

    } catch (error) {
        return h.response({
            "status": "error",
            "message": "Buku gagal ditambahkan"
        }, 500);
    }
}

const detailBook = (request, h) => {
    const books = Book();
    const { bookId } = request.params;
    const findBookById = books.find((book) => book.id == bookId)
    if (findBookById) {
        return h.response({
            "status": "success",
            "data": {
                "book": findBookById
            }
        }).code(200);
    } else {
        return h.response({
            "status": "fail",
            "message": "Buku tidak ditemukan"
        }).code(404);
    }
}

const updateBook = (request, h) => {
    const books = Book();
    const input = request.payload;
    const { bookId } = request.params;
    const finished = input.pageCount === input.readPage;
    const updatedAt = new Date().toISOString();
    if (!input.name) {
        return h.response({
            status: "fail",
            message: "Gagal memperbarui buku. Mohon isi nama buku",
        }).code(400);
    }

    if (input.readPage > input.pageCount) {
        return h.response({
            "status": "fail",
            "message": "Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount",
        }).code(400);
    }

    const findBookById = books.find((book) => book.id == bookId)

    if (findBookById) {
        let updateBook = books.map((book) => {
            if (book.id == bookId) {
                return {
                    ...book,
                    ...input,
                    finished: finished,
                    updatedAt: updatedAt
                }
            }
            return book
        })

        let data = JSON.stringify(updateBook);

        fs.writeFileSync('./src/books.json', data);

        return h.response({
            "status": "success",
            "message": "Buku berhasil diperbarui",
        }).code(200)
    } else {
        return h.response({
            "status": "fail",
            "message": "Gagal memperbarui buku. Id tidak ditemukan"
        }).code(404);
    }
}

const deleteBook = (request, h) => {
    const books = Book();
    const { bookId } = request.params;
    const findBookById = books.find((book) => book.id == bookId)
    if (findBookById) {
        const filterBook = books.filter((book) => book.id != bookId)
        let data = JSON.stringify(filterBook);

        fs.writeFileSync('./src/books.json', data);
        return h.response({
            "status": "success",
            "message": "Buku berhasil dihapus"
        }).code(200)
    } else {
        return h.response({
            "status": "fail",
            "message": "Buku gagal dihapus. Id tidak ditemukan"
        }).code(404);
    }
}

module.exports = {
    listBooks,
    addBook,
    detailBook,
    updateBook,
    deleteBook
};
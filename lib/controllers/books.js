const { nanoid } = require('nanoid');
const books = [];

function responseJson(h, status, message, data, code) {
    let response = {
        status: status,
    }

    if (message) {
        response.message = message;
    }

    if (data) {
        response.data = data;
    }

    return h.response(response).code(code);
}

function find(id) {
    const book = books.find((book) => book.id === id);
    if (book) {
        return book;
    }
    return null;
}

module.exports = {

    listBooks: (request, h) => {
        const { reading, finished, name } = request.query;

        // Filter data berdasarkan query
        const filterBook = books.filter((book) => {
            if (reading) {
                return book.reading == reading;
            } else if (finished) {
                return book.finished == finished;
            } else if (name) {
                return book.name.toLowerCase().includes(name.toLowerCase());
            } else {
                return book;
            }
        }).map((book) => {
            return {
                id: book.id,
                name: book.name,
                publisher: book.publisher
            }
        })

        return responseJson(h, "success", null, {
            books: filterBook
        }, 200);

    },
    addBook: (request, h) => {

        const input = request.payload;
        const id = nanoid(16);
        const finished = input.pageCount === input.readPage;
        const insertedAt = new Date().toISOString();
        const updatedAt = insertedAt;

        if (!input.name) {
            return responseJson(h, "fail", "Gagal menambahkan buku. Mohon isi nama buku", null, 400);
        }

        if (input.readPage > input.pageCount) {
            return responseJson(h, "fail", "Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount", null, 400);
        }

        try {
            // push array buku baru ke array buku json
            input.id = id;
            input.finished = finished;
            input.insertedAt = insertedAt;
            input.updatedAt = updatedAt;
            books.push(input)
            return responseJson(h, "success", "Buku berhasil ditambahkan", {
                bookId: id
            }, 201);

        } catch (error) {
            return responseJson(h, "error", "Buku gagal ditambahkan", null, 500);
        }
    },

    detailBook: (request, h) => {
        const { bookId } = request.params;
        const findBookById = find(bookId)

        // Jika id buku ditemukan
        if (findBookById) {
            return responseJson(h, "success", null, {
                book: findBookById
            }, 200);
        } else {
            return responseJson(h, "fail", "Buku tidak ditemukan", null, 404);
        }

    },

    updateBook: (request, h) => {
        const input = request.payload;
        const { bookId } = request.params;
        const finished = input.pageCount === input.readPage;
        const updatedAt = new Date().toISOString();

        // Jika nama buku kosong
        if (!input.name) {
            return responseJson(h, "fail", "Gagal memperbarui buku. Mohon isi nama buku", null, 400);
        }

        // Jika readPage lebih besar dari pageCount
        if (input.readPage > input.pageCount) {
            return responseJson(h, "fail", "Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount", null, 400);
        }

        const findBookById = find

        // Jika id buku ditemukan
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
                else {
                    return book;
                }
            })

            books.push(updateBook)

            return responseJson(h, "success", "Buku berhasil diperbarui", null, 200);
        } else {
            return responseJson(h, "fail", "Gagal memperbarui buku. Id tidak ditemukan", null, 404);
        }

    },

    deleteBook: (request, h) => {

        const { bookId } = request.params;
        const findBookById = find

        // Jika id buku ditemukan
        if (findBookById) {
            const filterBook = books.filter((book) => book.id != bookId)

            return responseJson(h, "success", "Buku berhasil dihapus", filterBook, 200);
        } else {
            return responseJson(h, "fail", "Buku gagal dihapus. Id tidak ditemukan", null, 404);
        }

    }
}
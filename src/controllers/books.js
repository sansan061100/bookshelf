const fs = require('fs');
const { nanoid } = require('nanoid');

// Ambil data dari file json
function bookJson() {
    const rawData = fs.readFileSync('./src/model/books.json');
    const books = JSON.parse(rawData);
    return books;
}

// Simpan data ke file json
function saveJsonFile(books) {
    const data = JSON.stringify(books);

    fs.writeFileSync('./src/model/books.json', data);
}

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


module.exports = {

    listBooks: (request, h) => {
        const books = bookJson();
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
        const books = bookJson();
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

            let data = saveJsonFile(books);
            console.log(data)
            return responseJson(h, "success", "Buku berhasil ditambahkan", {
                bookId: id
            }, 201);

        } catch (error) {
            return responseJson(h, "error", "Buku gagal ditambahkan", null, 500);
        }
    },

    detailBook: (request, h) => {
        const books = bookJson();
        const { bookId } = request.params;
        const findBookById = books.find((book) => book.id == bookId)

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
        const books = bookJson();
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

        const findBookById = books.find((book) => book.id == bookId)

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
                return book
            })

            let data = saveJsonFile(updateBook);

            return responseJson(h, "success", "Buku berhasil diperbarui", data, 200);
        } else {
            return responseJson(h, "fail", "Gagal memperbarui buku. Id tidak ditemukan", null, 404);
        }

    },

    deleteBook: (request, h) => {
        const books = bookJson();
        const { bookId } = request.params;
        const findBookById = books.find((book) => book.id == bookId)

        // Jika id buku ditemukan
        if (findBookById) {
            const filterBook = books.filter((book) => book.id != bookId)
            let data = saveJsonFile(filterBook);

            return responseJson(h, "success", "Buku berhasil dihapus", data, 200);
        } else {
            return responseJson(h, "fail", "Buku gagal dihapus. Id tidak ditemukan", null, 404);
        }

    }
}
const { nanoid } = require('nanoid')
const books = require('./books')

const addBookHandler = (request, h) => {
  const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload

  const id = nanoid(16)
  const insertedAt = new Date().toISOString()
  const updatedAt = insertedAt
  const finished = pageCount === readPage

  const newBook = {
    name, year, author, summary, publisher, pageCount, readPage, finished, reading, id, insertedAt, updatedAt
  }

  if (name === undefined) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku'
    })
    response.code(400)
    return response
  }
  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount'
    })
    response.code(400)
    return response
  }
  if (readPage === pageCount) {
    newBook.finished = true
  }

  books.push(newBook)

  const isSuccess = books.filter((book) => book.id === id).length > -1

  if (isSuccess) {
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id
      }
    })
    response.code(201)
    return response
  } else {
    const response = h.response({
      status: 'fail',
      message: 'Buku gagal ditambahkan'
    })
    response.code(500)
    return response
  }
}

const getAllBooksHandler = () => ({

  status: 'success',
  data: {
    books: books.map((book) => ({
      id: book.id,
      name: book.name,
      publisher: book.publisher
    }))
  }
})

const getAllBookReadingHandler = (request, h) => {
  const { reading } = request.params

  if (reading === '0') {
    const book = books.filter((b) => b.reading === false)
    return {
      status: 'success',
      data: {
        books: book.map((b) => ({
          id: b.id,
          name: b.name,
          publisher: b.publisher
        }))
      }
    }
  } else if (reading === '1') {
    const book = books.filter((b) => b.reading === true)
    return {
      status: 'success',
      data: {
        books: book.map((b) => ({
          id: b.id,
          name: b.name,
          publisher: b.publisher
        }))
      }
    }
  } else {
    const response = h.response({
      status: 'fail',
      message: 'Buku tidak ditemukan'
    })
    response.code(404)
    return response
  }
}

const getBookByIdHandler = (request, h) => {
  const { bookId } = request.params

  const book = books.filter((b) => b.id === bookId)

  if (book !== undefined) {
    return {
      status: 'success',
      data: {
        book // book: book bisa ditulis book saja

      }
    }
  }
  const response = h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan'
  })
  response.code(404)
  return response
}

const getBookByNameHandler = (request, h) => {
  const { name } = request.query

  const book = books.filter((b) => b.name === name)[0]

  if (book !== undefined) {
    return {
      status: 'success',
      message: 'Data buku berhasil didapatkan',
      data: {
        book
      }
    }
  }
  const response = h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan'
  })
  response.code(404)
  return response
}

const editBookByIdHandler = (request, h) => {
  const { id } = request.params

  const { name, year, author, summary, publisher, pageCount, readPage } = request.payload

  const updatedAt = new Date().toISOString()
  const finished = pageCount === readPage

  const index = books.findIndex((book) => book.id === id)

  console.log(index)

  if (name === undefined) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku'
    })
    response.code(400)
    return response
  }

  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount'
    })
    response.code(400)
    return response
  }

  if (index !== -1) {
    books[index] = {
      ...books[index],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      finished,

      updatedAt
    }
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil diperbarui',
      data: {
        id: books[index].id
      }
    })
    response.code(200)
    return response
  } else {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Id tidak ditemukan'
    })
    response.code(404)
    return response
  }
}

const deleteBookByIdHandler = (request, h) => {
  const { id } = request.params

  const index = books.findIndex((b) => b.id === id)

  if (index === -1) {
    const response = h.response({
      status: 'fail',
      message: 'Buku gagal dihapus. Id tidak ditemukan'
    })
    response.code(404)
    return response
  } else {
    books.splice(index, 1)
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus'
    })
    response.code(200)
    return response
  }
}

const deleteBookFinishHandler = (request, h) => {
  // const finish = books.filter((b) => b.finished === true)
  const { id } = request.params
  const finished = books.filter((b) => b.id === id)[0].finished

  // const index = books.findIndex((b) => b.id === id)

  if (finished === false) {
    const response = h.response({
      status: 'fail',
      message: 'Buku gagal dihapus. Buku belum selesai dibaca'
    })
    response.code(404)
    return response
  } else {
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus'
    })
    response.code(200)
    return response
  }
}

module.exports =
{
  addBookHandler,
  getAllBooksHandler,
  getBookByIdHandler,
  getAllBookReadingHandler,
  editBookByIdHandler,
  getBookByNameHandler,
  deleteBookByIdHandler,
  deleteBookFinishHandler
}
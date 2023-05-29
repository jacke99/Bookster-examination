import { redirect, useLoaderData } from "react-router-dom";
import { buyBooks, fetchBooks, searchBooks } from "../service/bookService";
import { useEffect, useState } from "react";
import { parseJwt } from "../service/jwtService";
import { actionDelete } from "../service/actionService";
import EditBook from "../components/EditBook";
import AddBook from "../components/AddBook";

export function loader() {
  const authtoken = sessionStorage.getItem("Authtoken");
  const userInfo = parseJwt(authtoken);
  if (!userInfo) {
    return redirect("/login");
  }
  if (userInfo.role !== "ADMIN") {
    return redirect("/login");
  }
  return fetchBooks();
}

export default function AdminView() {
  const [editBook, setEditBook] = useState(null);
  const [search, setSearch] = useState("");
  const [books, setBooks] = useState(null);
  const [bookElements, setBookElements] = useState(null);
  const [addBook, setAddBook] = useState(false);

  let loaderBooks = useLoaderData();

  useEffect(() => {
    setBooks(loaderBooks);
    loaderBooks.forEach((book) => {
      book.order = 0;
    });
  }, [loaderBooks]);

  function increaseOrder(event) {
    const { value } = event.target;
    console.log(value);
    const updateOrder = books.map((book, i) => {
      if (parseInt(value) === parseInt(i)) {
        if (book.order < book.quantity) {
          book.order++;
        }
        return book;
      } else {
        return book;
      }
    });
    setBooks(updateOrder);
  }
  function decreaseOrder(event) {
    const { value } = event.target;
    const updateOrder = books.map((book, i) => {
      if (parseInt(value) === parseInt(i)) {
        if (book.order > 0) {
          book.order--;
        }
        return book;
      } else {
        return book;
      }
    });
    setBooks(updateOrder);
  }

  async function orderBooks(event) {
    const { value } = event.target;
    const order = books[value];

    const data = await buyBooks(order.title, order.order);
    console.log(data);

    const reRender = await fetchBooks();
    reRender.forEach((book) => {
      book.order = 0;
    });
    setBooks(reRender);
    if (data.message) {
      alert("Purchase was successful");
    } else {
      alert("Something went wrong, please try again");
    }
  }

  async function deleteBook(event) {
    const { value } = event.target;
    const order = books[value];

    const data = await actionDelete(order.title);
    console.log(data);

    const reRender = await fetchBooks();
    reRender.forEach((book) => {
      book.order = 0;
    });

    setBooks(reRender);
  }

  function toggleEdit(event) {
    const { value } = event.target;
    const bookToEdit = books[value];
    console.log(bookToEdit);
    setEditBook(bookToEdit);
  }

  useEffect(() => {
    const bookElements = books?.map((book, index) => {
      return (
        <tr key={index}>
          <td>{book.title}</td>
          <td>{book.author}</td>
          <td>
            {book.quantity === 0 ? "Out of stock" : book.quantity + " left"}
          </td>
          <td className="order-td">
            <button
              disabled={book.quantity === 0}
              value={index}
              onClick={decreaseOrder}
              data-testid="decrease"
            >
              -
            </button>
            <div>{book.order}</div>
            <button
              disabled={book.quantity === 0}
              value={index}
              onClick={increaseOrder}
              data-testid="increase"
            >
              +
            </button>
            <button
              disabled={book.quantity === 0}
              value={index}
              onClick={orderBooks}
            >
              Order
            </button>
          </td>
          <td>
            <button disabled={editBook} value={index} onClick={toggleEdit}>
              Edit
            </button>
            <button disabled={editBook} value={index} onClick={deleteBook}>
              Delete
            </button>
          </td>
        </tr>
      );
    });
    setBookElements(bookElements);
    //eslint-disable-next-line
  }, [books, editBook]);

  async function handleChange(event) {
    const { value } = event.target;
    setSearch(value);
    console.log(search);
    console.log(value);
    if (value === "") {
      const data = await fetchBooks();
      data.forEach((book) => {
        book.order = 0;
      });
      setBooks(data);
    }
  }

  async function handleKeyDown(event) {
    if (event.code === "Enter") {
      let books = await searchBooks(search);
      books.forEach((book) => {
        book.order = 0;
      });
      setBooks(books);
    }
  }

  return (
    <>
      <input
        className="search-input"
        type="search"
        placeholder="Seatch..."
        onKeyDown={handleKeyDown}
        onChange={handleChange}
      />
      <button onClick={() => setAddBook(true)} className="add-book-btn">
        Add new book
      </button>
      <table data-testid="book-table" className="book-table">
        <thead>
          <tr>
            <th className="table-header">Book title</th>
            <th className="table-header">Book author</th>
            <th className="table-header">Availability</th>
            <th className="table-header">Order</th>
            <th className="table-header">Action</th>
          </tr>
        </thead>
        <tbody>{bookElements}</tbody>
      </table>

      {addBook && <AddBook toggle={setAddBook} render={setBooks} />}
      {editBook && (
        <EditBook book={editBook} toggle={setEditBook} render={setBooks} />
      )}
    </>
  );
}

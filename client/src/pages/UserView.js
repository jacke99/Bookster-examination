import { redirect, useLoaderData } from "react-router-dom";
import { buyBooks, fetchBooks, searchBooks } from "../service/bookService";
import { useEffect, useState } from "react";
import { parseJwt } from "../service/jwtService";

export function loader() {
  const authtoken = sessionStorage.getItem("Authtoken");
  const userInfo = parseJwt(authtoken);
  if (!userInfo) {
    return redirect("/login");
  }
  return fetchBooks();
}

export default function UserView() {
  const [search, setSearch] = useState("");
  const [books, setBooks] = useState(null);
  const [bookElements, setBookElements] = useState(null);

  let loaderBooks = useLoaderData();

  useEffect(() => {
    setBooks(loaderBooks.books);
    loaderBooks.books.forEach((book) => {
      book.order = 0;
    });
    sessionStorage.setItem("BooksVersion", loaderBooks.version);
  }, [loaderBooks]);

  function increaseOrder(event) {
    const { value } = event.target;
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
    reRender.books.forEach((book) => {
      book.order = 0;
    });
    setBooks(reRender.books);
    if (data.message) {
      alert("Purchase was successful");
    } else {
      alert("Something went wrong, please try again");
    }
  }

  useEffect(() => {
    if (books !== null) {
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
          </tr>
        );
      });
      setBookElements(bookElements);
    }

    //eslint-disable-next-line
  }, [books]);

  async function handleChange(event) {
    const { value } = event.target;
    setSearch(value);
    if (value === "") {
      const data = await fetchBooks();
      data.books.forEach((book) => {
        book.order = 0;
      });
      setBooks(data.books);
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
        className="userview-search-input"
        type="search"
        placeholder="Search..."
        onKeyDown={handleKeyDown}
        onChange={handleChange}
      />
      <table data-testid="book-table" className="book-table">
        <thead>
          <tr>
            <th className="table-header">Book title</th>
            <th className="table-header">Book author</th>
            <th className="table-header">Availability</th>
            <th className="table-header">Order</th>
          </tr>
        </thead>
        <tbody>{bookElements}</tbody>
      </table>
    </>
  );
}

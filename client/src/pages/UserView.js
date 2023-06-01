/**AdminView component
 * This component will render if you log in as a user / have the user role
 * We display all the books on this page through smaller components
 * When entering this page we recieve all the books though our loader
 * This component uses short-polling to rerender if it recieves new data that does not match the current version.
 */

import { redirect, useLoaderData } from "react-router-dom";
import { fetchBooks, searchBooks } from "../service/bookService";
import { useEffect, useState } from "react";
import { parseJwt } from "../service/jwtService";
import BookTable from "../components/BookTable";
import { MapBooks } from "../components/MapBooks";
import { polling } from "../service/pollingService";

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

  useEffect(() => {
    const interval = setInterval(async () => {
      const newVersion = await polling(books);
      setBooks(newVersion);
    }, 10000);
    return () => clearInterval(interval);
  }, [books]);

  useEffect(() => {
    if (books !== null) {
      const mappedBooks = <MapBooks books={books} setBooks={setBooks} />;
      setBookElements(mappedBooks);
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
      <BookTable bookElements={bookElements} />
    </>
  );
}

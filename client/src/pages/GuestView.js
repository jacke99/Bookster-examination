/**AdminView component
 * This component will render if you are browsing as a guest user (not logged in)
 * When entering this page we recieve all the books though our loader
 * This component uses short-polling to rerender if it recieves new data that does not match the current version.
 */

import { useLoaderData } from "react-router-dom";
import { fetchBooks, searchBooks } from "../service/bookService";
import { useEffect, useState } from "react";
import { polling } from "../service/pollingService";
import { MapBooks } from "../components/MapBooks";

export function loader() {
  return fetchBooks();
}

export default function GuestView() {
  const [search, setSearch] = useState("");
  const [books, setBooks] = useState(null);
  const [bookElements, setBookElements] = useState(null);
  let loaderBooks = useLoaderData();

  useEffect(() => {
    setBooks(loaderBooks.books);
  }, [loaderBooks]);

  useEffect(() => {
    const interval = setInterval(async () => {
      const newVersion = await polling(books);
      if (newVersion) {
        setBooks(newVersion);
      }
    }, 10000);
    return () => clearInterval(interval);
  }, [books]);

  useEffect(() => {
    const bookElements = <MapBooks books={books} setBooks={setBooks} />;
    setBookElements(bookElements);
  }, [books]);

  async function handleChange(event) {
    const { value } = event.target;
    setSearch(value);
    if (value === "") {
      const data = await fetchBooks();
      setBooks(data.books);
    }
  }

  async function handleKeyDown(event) {
    if (event.code === "Enter") {
      let books = await searchBooks(search);

      setBooks(books);
    }
  }

  return (
    <>
      <input
        data-testid="search-input"
        className="guestview-search-input"
        type="search"
        placeholder="Seatch..."
        onKeyDown={handleKeyDown}
        onChange={handleChange}
      />
      <table className="book-table">
        <thead>
          <tr>
            <th className="table-header">Book title</th>
            <th className="table-header">Book author</th>
            <th className="table-header">Availability</th>
          </tr>
        </thead>
        <tbody>{bookElements}</tbody>
      </table>
    </>
  );
}

/**AdminView component
 * This component will render if you log in as an admin user / have the admin role
 * We display all the books/users on this page through smaller components
 * When entering this page we recieve all the users and books though our loader
 * This component uses short-polling to rerender if it recieves new data that does not match the current version.
 */

import { redirect, useLoaderData } from "react-router-dom";
import { fetchBooks } from "../service/bookService";
import { useEffect, useState } from "react";
import { parseJwt } from "../service/jwtService";
import EditBook from "../components/EditBook";
import AddBook from "../components/AddBook";
import { getUsers } from "../service/userService";
import UserAction from "../components/UserAction";
import BookTable from "../components/BookTable";
import UserTable from "../components/UserTable";
import { MapBooks } from "../components/MapBooks";
import { MapUsers } from "../components/MapUsers";
import { SubHeader } from "../components/SubHeader";
import { polling } from "../service/pollingService";

export async function loader() {
  const authtoken = sessionStorage.getItem("Authtoken");
  const userInfo = parseJwt(authtoken);
  if (!userInfo) {
    return redirect("/login");
  }
  if (userInfo.role !== "ADMIN") {
    return redirect("/login");
  }
  const loaderBooks = await fetchBooks();
  loaderBooks.books.forEach((book) => {
    book.order = 0;
  });
  if (userInfo.exp * 1000 < Date.now()) {
    sessionStorage.removeItem("Authtoken");
    return redirect("/login");
  }
  const loaderUsers = await getUsers();

  return { loaderBooks, loaderUsers };
}

export default function AdminView() {
  const [editBook, setEditBook] = useState(null);
  const [books, setBooks] = useState(null);
  const [bookElements, setBookElements] = useState(null);
  const [addBook, setAddBook] = useState(false);
  const [toggleTable, setToggleTable] = useState(true);
  const [users, setUsers] = useState(null);
  const [userElements, setUserElements] = useState(null);
  const [toggleAction, setToggleAction] = useState(null);
  const [user, setUser] = useState(null);
  const [action, setAction] = useState(null);

  let { loaderBooks, loaderUsers } = useLoaderData();

  useEffect(() => {
    setBooks(loaderBooks.books);
    setUsers(loaderUsers);
    sessionStorage.setItem("BooksVersion", loaderBooks.version);
  }, [loaderBooks, loaderUsers]);

  useEffect(() => {
    const interval = setInterval(async () => {
      const newVersion = await polling(books);
      if (newVersion) {
        setBooks(newVersion);
      }
    }, 10000);
    return () => clearInterval(interval);
  }, [books]);

  function handleUserAction(event) {
    const { value, name } = event.target;
    setAction(name);
    setUser(users[value]);
    setToggleAction(true);
  }

  useEffect(() => {
    if (books !== null) {
      const mappedBooks = (
        <MapBooks
          books={books}
          setBooks={setBooks}
          editBook={editBook}
          setEditBook={setEditBook}
          setUsers={setUsers}
        />
      );
      setBookElements(mappedBooks);
    }

    if (users !== null) {
      const mappedUsers = (
        <MapUsers users={users} handleUserAction={handleUserAction} />
      );
      setUserElements(mappedUsers);
    }

    //eslint-disable-next-line
  }, [books, editBook, users]);

  return (
    <>
      <SubHeader
        setBooks={setBooks}
        setAddBook={setAddBook}
        setToggleTable={setToggleTable}
      />
      {toggleAction && (
        <UserAction
          user={user}
          setUsers={setUsers}
          toggle={setToggleAction}
          action={action}
        />
      )}

      {toggleTable && <BookTable bookElements={bookElements} />}
      {!toggleTable && <UserTable userElements={userElements} />}

      {addBook && <AddBook toggle={setAddBook} render={setBooks} />}
      {editBook && (
        <EditBook book={editBook} toggle={setEditBook} render={setBooks} />
      )}
    </>
  );
}

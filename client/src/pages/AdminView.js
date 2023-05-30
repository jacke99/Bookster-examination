import { redirect, useLoaderData, useNavigate } from "react-router-dom";
import { buyBooks, fetchBooks, searchBooks } from "../service/bookService";
import { useEffect, useState } from "react";
import { parseJwt } from "../service/jwtService";
import { actionDelete } from "../service/actionService";
import EditBook from "../components/EditBook";
import AddBook from "../components/AddBook";
import Users from "../components/Users";
import Books from "../components/Books";
import { getUsers } from "../service/userService";
import UserAction from "../components/UserAction";

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
  const [search, setSearch] = useState("");
  const [books, setBooks] = useState(null);
  const [bookElements, setBookElements] = useState(null);
  const [addBook, setAddBook] = useState(false);
  const [toggleTable, setToggleTable] = useState(true);
  const [users, setUsers] = useState(null);
  const [userElements, setUserElements] = useState(null);
  const [toggleAction, setToggleAction] = useState(null);
  const [user, setUser] = useState(null);
  const [action, setAction] = useState(null);

  const navigate = useNavigate();

  let { loaderBooks, loaderUsers } = useLoaderData();

  useEffect(() => {
    setBooks(loaderBooks.books);
    setUsers(loaderUsers);
    sessionStorage.setItem("BooksVersion", loaderBooks.version);
  }, [loaderBooks, loaderUsers]);

  useEffect(() => {
    const interval = setInterval(async () => {
      const newBooks = await fetchBooks();
      const currentVersion = sessionStorage.getItem("BooksVersion");
      console.log(newBooks, currentVersion);
      if (String(newBooks.version) !== String(currentVersion)) {
        console.log("they are not the same");
        for (let i = 0; i < newBooks.books.length; i++) {
          if (books[i]) {
            newBooks.books[i].order = books[i].order;
          } else {
            newBooks.books[i].order = 0;
          }
        }

        setBooks(newBooks.books);
        sessionStorage.setItem("BooksVersion", newBooks.version);
      } else {
        console.log("they are the same");
      }
    }, 10000);
    return () => clearInterval(interval);
  }, [books]);

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
    if (data.message) {
      const reRender = await fetchBooks();
      reRender.books.forEach((book) => {
        book.order = 0;
      });
      console.log(reRender);
      setBooks(reRender.books);

      const reRenderUsers = await getUsers();
      setUsers(reRenderUsers);
      alert("Purchase was successful");
    } else if (data.error === "Digital signing is invalid, request new token") {
      alert("Session expired, please log in again");
      navigate("/login");
    } else {
      const reRender = await fetchBooks();
      reRender.books.forEach((book) => {
        book.order = 0;
      });
      console.log(reRender);
      setBooks(reRender.books);

      const reRenderUsers = await getUsers();
      setUsers(reRenderUsers);
      alert("Something went wrong, please try again");
    }
  }

  async function deleteBook(event) {
    const { value } = event.target;
    const order = books[value];

    const data = await actionDelete(order.title);
    console.log(data);

    const reRender = await fetchBooks();
    reRender.books.forEach((book) => {
      book.order = 0;
    });

    setBooks(reRender.books);
  }

  function toggleEdit(event) {
    const { value } = event.target;
    const bookToEdit = books[value];
    console.log(bookToEdit);
    setEditBook(bookToEdit);
  }

  function handleUserAction(event) {
    const { value, name } = event.target;
    setAction(name);
    setUser(users[value]);
    setToggleAction(true);
  }

  useEffect(() => {
    console.log(books);
    const mappedBooks = books?.map((book, index) => {
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

    setBookElements(mappedBooks);
    if (users !== null) {
      const mappedUsers = users?.map((user, index) => {
        return (
          <tr key={index}>
            <td>{user.username}</td>
            <td>{user.role}</td>
            <td>{user.purchases ? user.purchases.length : 0}</td>
            <td>
              <button
                disabled={
                  user.username ===
                  parseJwt(sessionStorage.getItem("Authtoken")).username
                }
                name="promote"
                value={index}
                onClick={handleUserAction}
              >
                Promote
              </button>
              <button
                disabled={
                  user.username ===
                  parseJwt(sessionStorage.getItem("Authtoken")).username
                }
                name="delete"
                value={index}
                onClick={handleUserAction}
              >
                Delete
              </button>
            </td>
          </tr>
        );
      });
      setUserElements(mappedUsers);
    }

    //eslint-disable-next-line
  }, [books, editBook, users]);

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
      <div className="controller-container">
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

        <div className="btn-container">
          <button onClick={() => setToggleTable(true)} className="book-btn">
            books
          </button>
          <button onClick={() => setToggleTable(false)} className="user-btn">
            Users
          </button>
        </div>
      </div>

      {toggleAction && (
        <UserAction
          user={user}
          setUsers={setUsers}
          toggle={setToggleAction}
          action={action}
        />
      )}

      {toggleTable && <Books bookElements={bookElements} />}
      {!toggleTable && <Users userElements={userElements} />}

      {addBook && <AddBook toggle={setAddBook} render={setBooks} />}
      {editBook && (
        <EditBook book={editBook} toggle={setEditBook} render={setBooks} />
      )}
    </>
  );
}

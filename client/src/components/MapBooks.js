/**MapBooks component
 *Mappes through the books recieved as props and returns JSX that can be used to render the table
 */

import { useNavigate } from "react-router-dom";
import {
  decreaseBookOrder,
  deleteClickedBook,
  increaseBookOrder,
  placeOrder,
} from "../service/bookService";
import { parseJwt } from "../service/jwtService";

export function MapBooks({ books, setBooks, editBook, setEditBook, setUsers }) {
  const navigate = useNavigate();
  const decoded = parseJwt(sessionStorage.getItem("Authtoken"));

  function increaseOrder(event) {
    const updateOrder = increaseBookOrder(event, books);
    setBooks(updateOrder);
  }
  function decreaseOrder(event) {
    const updateOrder = decreaseBookOrder(event, books);
    setBooks(updateOrder);
  }

  async function orderBooks(event) {
    const { data, reRender, reRenderUsers } = await placeOrder(event, books);

    if (data) {
      if (data.error === "Digital signing is invalid, request new token") {
        navigate("/login");
      } else {
        setBooks(reRender.books);
        if (decoded.role === "ADMIN") {
          setUsers(reRenderUsers);
        }
      }
    }
  }

  async function deleteBook(event) {
    const { reRender } = await deleteClickedBook(event, books);
    setBooks(reRender.books);
  }

  function toggleEdit(event) {
    const { value } = event.target;
    const bookToEdit = books[value];

    setEditBook(bookToEdit);
  }

  const mappedBooks = books?.map((book, index) => {
    return (
      <tr key={index}>
        <td>{book.title}</td>
        <td>{book.author}</td>
        <td>
          {book.quantity === 0 ? "Out of stock" : book.quantity + " left"}
        </td>
        {decoded && (
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
        )}
        {decoded && decoded.role === "ADMIN" && (
          <td>
            <button disabled={editBook} value={index} onClick={toggleEdit}>
              Edit
            </button>
            <button disabled={editBook} value={index} onClick={deleteBook}>
              Delete
            </button>
          </td>
        )}
      </tr>
    );
  });
  return mappedBooks;
}

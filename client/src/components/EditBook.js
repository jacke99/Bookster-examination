/**EditBook component
 * Recieve the clicked book as prop and renders a pop-up window that allows you to edit title, author and quantity
 */

import { useState } from "react";
import { actionEdit } from "../service/actionService";
import { fetchBooks } from "../service/bookService";

export default function EditBook({ book, toggle, render }) {
  const [inputValues, setInputValues] = useState({
    title: book.title,
    author: book.author,
    quantity: book.quantity,
  });

  function handleChange(event) {
    const { name, value } = event.target;
    setInputValues((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  }

  async function saveChanges() {
    const data = await actionEdit(book, inputValues);
    console.log(data);
    if (data.message === "book updated successfully") {
      const reRender = await fetchBooks();
      reRender.books.forEach((book) => {
        book.order = 0;
      });
      render(reRender.books);
      alert(`Successfully edited ${book.title}`);
      toggle(null);
    } else {
      alert(`Failed to edit ${book.title}`);
    }
  }

  return (
    <div className="edit-container">
      <h3 className="edit-title">Add/edit book</h3>

      <label className="edit-label">Title - {book.title}</label>
      <input
        className="edit-input"
        onChange={handleChange}
        name="title"
        value={inputValues.title}
        type="text"
        placeholder="Insert new title..."
      />

      <label className="edit-label">Author - {book.author}</label>
      <input
        className="edit-input"
        onChange={handleChange}
        name="author"
        value={inputValues.author}
        type="text"
        placeholder="Insert new author..."
      />

      <label className="edit-label">Quantity - {book.quantity}</label>
      <input
        className="edit-input"
        onChange={handleChange}
        name="quantity"
        value={inputValues.quantity}
        type="number"
        placeholder="Insert new quantity..."
      />
      <div className="edit-btn-container">
        <button className="edit-btn" onClick={saveChanges}>
          Save changes
        </button>
        <button className="edit-btn discard-btn" onClick={() => toggle(null)}>
          Discard changes
        </button>
      </div>
    </div>
  );
}

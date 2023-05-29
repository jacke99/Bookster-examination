import { useState } from "react";
import { actionAdd } from "../service/actionService";

export default function AddBook({ toggle, render }) {
  const [inputValues, setInputValues] = useState({
    title: "",
    author: "",
    quantity: "",
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
    const data = await actionAdd(inputValues);
    console.log(data);
    if (data.message === "book added successfully") {
      data.context.books.forEach((book) => {
        book.order = 0;
      });
      render(data.context.books);
      alert(`Successfully added book`);
      toggle(false);
    } else {
      alert(`Failed to add book`);
    }
  }

  return (
    <div className="edit-container">
      <h3 className="edit-title">Add/edit book</h3>

      <label className="edit-label">Title:</label>
      <input
        className="edit-input"
        onChange={handleChange}
        name="title"
        value={inputValues.title}
        type="text"
        placeholder="Insert new title..."
      />

      <label className="edit-label">Author:</label>
      <input
        className="edit-input"
        onChange={handleChange}
        name="author"
        value={inputValues.author}
        type="text"
        placeholder="Insert new author..."
      />

      <label className="edit-label">Quantity:</label>
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
          Add book
        </button>
        <button className="edit-btn discard-btn" onClick={() => toggle(false)}>
          Discard changes
        </button>
      </div>
    </div>
  );
}

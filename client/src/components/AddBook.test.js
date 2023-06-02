import { fireEvent, render, screen } from "@testing-library/react";
import {
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";
import Layout from "./Layout";
import AdminView, { loader as adminLoader } from "../pages/AdminView";
import { loginUser } from "../service/authService";
import { fetchBooks } from "../service/bookService";

test("Check if book is added to database", async () => {
  const resp = await loginUser({ username: "Bob", password: "123" });
  sessionStorage.setItem("Authtoken", resp.accessToken);
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<Layout />}>
        <Route path="/" element={<AdminView />} loader={adminLoader} />
      </Route>
    )
  );

  render(<RouterProvider router={router} />);

  const addBookBtn = await screen.findByTestId("add-book-btn");
  fireEvent.click(addBookBtn);

  const bookTitle = await screen.findByTestId("add-book-title");
  const bookAuthor = await screen.findByTestId("add-book-author");
  const bookQuantity = await screen.findByTestId("add-book-quantity");
  const saveBookBtn = await screen.findByTestId("save-book-btn");

  fireEvent.change(bookTitle, { target: { value: "Test book" } });
  fireEvent.change(bookAuthor, { target: { value: "Jacob" } });
  fireEvent.change(bookQuantity, { target: { value: 5 } });

  fireEvent.click(saveBookBtn);

  const response = await fetchBooks();
  const addedBook = response.books.slice(-1);

  expect(addedBook[0].title).toBe("Test book");
  expect(addedBook[0].author).toBe("Jacob");
  expect(addedBook[0].quantity).toBe("5");
});

import { render, screen } from "@testing-library/react";
import Layout from "../components/Layout";
import {
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";
import UserView, { loader as userLoader } from "./UserView";

test("Check if book table is rendered", async () => {
  sessionStorage.setItem(
    "Authtoken",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
  );
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<Layout />}>
        <Route path="/" element={<UserView />} loader={userLoader} />
      </Route>
    )
  );

  render(<RouterProvider router={router} />);

  const bookTable = await screen.findByTestId("book-table");

  expect(bookTable).toBeInTheDocument();
});

test("Check if you can decrease the number of books you want to order", () => {});

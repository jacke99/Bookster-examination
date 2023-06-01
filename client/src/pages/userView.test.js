import { render, screen } from "@testing-library/react";
import Layout from "../components/Layout";
import {
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";
import UserView, { loader as userLoader } from "./UserView";
import { loginUser } from "../service/authService";

test("Check if book table is rendered", async () => {
  const resp = await loginUser({ username: "Yves", password: "123" });
  sessionStorage.setItem("Authtoken", resp.accessToken);
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

/**Layout component
 * In this component we use outlet to determine which components we render on the screen
 * Outlet looks at the router path to decide what to render
 */

import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";

export default function Layout() {
  return (
    <>
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}

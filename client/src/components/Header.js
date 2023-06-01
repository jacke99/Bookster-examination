/**Header component
 * Renders the page header, and display the name of whoever is logged in by decoding their JWT
 */

import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { parseJwt } from "../service/jwtService";

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState();

  useEffect(() => {
    const authToken = sessionStorage.getItem("Authtoken");
    if (authToken) {
      const userInfo = parseJwt(authToken);
      setUser(userInfo.username);
    }
  }, [location]);

  function logout() {
    if (user) {
      sessionStorage.removeItem("Authtoken");
      setUser(null);
    }

    navigate("/login");
  }

  return (
    <header>
      <h1>Bookster website</h1>
      <div className="user-info">
        <p>Browsing as: {user ? user : "Guest"}</p>
        <button onClick={logout} className="log-out-btn">
          {user ? "Log out" : "Log in"}
        </button>
      </div>
    </header>
  );
}

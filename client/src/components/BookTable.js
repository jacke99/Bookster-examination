/**BookTable component
 * In this file we recieve all the books as prop and render them as a table
 */

import { parseJwt } from "../service/jwtService";

export default function BookTable({ bookElements }) {
  const authToken = sessionStorage.getItem("Authtoken");
  const decoded = parseJwt(authToken);
  return (
    <table data-testid="book-table" className="book-table">
      <thead>
        <tr>
          <th className="table-header">Book title</th>
          <th className="table-header">Book author</th>
          <th className="table-header">Availability</th>
          {(decoded.role === "ADMIN" || decoded.role === "USER") && (
            <th className="table-header">Order</th>
          )}
          {decoded.role === "ADMIN" && <th className="table-header">Action</th>}
        </tr>
      </thead>
      <tbody>{bookElements}</tbody>
    </table>
  );
}

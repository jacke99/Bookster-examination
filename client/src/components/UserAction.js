/**UserAction component
 * This component renders as a pop-up window when an admin want to promote/delete a user
 */

import {
  actionDeleteUser,
  actionPromoteUser,
  getUsers,
} from "../service/userService";

export default function UserAction({ user, setUsers, toggle, action }) {
  async function deleteUser() {
    const data = await actionDeleteUser(user.username);
    console.log(data);

    if (data.message) {
      setUsers(await getUsers());
      toggle(null);
    }
  }

  async function promoteUser() {
    const data = await actionPromoteUser(user.username);
    console.log(data);
    if (data.message) {
      setUsers(await getUsers());
      toggle(null);
    }
  }
  return (
    <div className="edit-container">
      <h2 className="edit-title">Change user settings</h2>
      <p>
        Are you sure you wish to {action}. User {user.username}
      </p>
      <div>
        <button
          className="edit-btn"
          onClick={action === "delete" ? deleteUser : promoteUser}
        >
          Proceed
        </button>
        <button className="edit-btn discard-btn" onClick={() => toggle(null)}>
          Cancel
        </button>
      </div>
    </div>
  );
}

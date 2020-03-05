import React from "react";

function Dropdown({ activeUserId, selectUser, allUsers }) {
  return (
    <div className="Dropdown">
      <label>
        Select User:
        <select value={activeUserId} onChange={e => selectUser(e.target.value)}>
          {allUsers.map(user => (
            <option key={user.id} value={user.id}>
              {user.name}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}

export default Dropdown;

import React, { useState } from "react";
import Dropdown from "./Dropdown";
import TextareaInput from "./TextareaInput";

function TweetForm({ users, createPost }) {
  const [activeUser, setActiveUser] = useState(users[0].id);
  const inputSubmit = inputVal => {
    let newPost = {
      userId: activeUser,
      text: inputVal,
      created: Date.now()
    };
    createPost(newPost);
    setActiveUser(users[0].id);
  };
  return (
    <div className="TweetForm">
      <Dropdown
        activeUserId={activeUser}
        selectUser={setActiveUser}
        allUsers={users}
      />
      <TextareaInput inputSubmit={inputSubmit} maxLength={100} />
    </div>
  );
}

export default TweetForm;

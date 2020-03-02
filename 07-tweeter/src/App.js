import React, { useState } from "react";
import TweetForm from "./TweetForm";
import PostsList from "./PostsList";

function App() {
  const [posts, setPosts] = useState([]);
  const [users] = useState([
    { name: "User1", id: "1" },
    { name: "User2", id: "2" },
    { name: "User3", id: "3" },
    { name: "User4", id: "4" },
    { name: "User5", id: "5" }
  ]);
  return (
    <div className="app">
      <header>Tweeter</header>
      <TweetForm
        users={users}
        createPost={newPost => setPosts([...posts, newPost])}
      />
      <PostsList
        posts={posts}
        getUserById={id => users.filter(user => user.id === id)[0]}
      />
    </div>
  );
}

export default App;

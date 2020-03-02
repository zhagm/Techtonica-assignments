import React from "react";

function PostsList({ posts, getUserById }) {
  return (
    <div className="PostsList">
      <ul>
        {posts.map((post, i) => {
          let username = getUserById(post.userId).name;
          let date = new Date(post.created);
          return (
            <li key={i}>
              {username}: {post.text} ({date.toString()})
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default PostsList;

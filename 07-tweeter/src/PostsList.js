import React from "react";

function PostsList({ posts, getUserById }) {
  let postsSortedByNewest = posts.sort((a, b) => b.created - a.created);
  return (
    <div className="PostsList">
      {posts.length ? (
        <ul>
          {postsSortedByNewest.map((post, i) => {
            let username = getUserById(post.userId).name;
            let date = new Date(post.created);
            return (
              <li key={i}>
                {username}: {post.text} ({date.toString()})
              </li>
            );
          })}
        </ul>
      ) : (
        <p>NO POSTS YET</p>
      )}
    </div>
  );
}

export default PostsList;

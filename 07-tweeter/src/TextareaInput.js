import React, { useState } from "react";
import CharacterCounter from "./CharacterCounter";

function TextareaInput({ inputSubmit, maxLength }) {
  const [input, setInput] = useState("");
  let handleSubmit = e => {
    e.preventDefault();
    inputSubmit(input);
    setInput("");
  };
  return (
    <div className="TextareaInput">
      <form onSubmit={e => handleSubmit(e)}>
        <textarea value={input} onChange={e => setInput(e.target.value)} />
        <button disabled={input.length > maxLength} type="submit">
          Tweet
        </button>
      </form>
      <CharacterCounter chars={input.length} max={maxLength} />
    </div>
  );
}

export default TextareaInput;

import React, { useState } from "react";

import axios from "axios";
import Error from "./Error";

const AddComment = (props) => {
  const [text, setText] = useState();
  const [error, setError] = useState("");
  // console.log(props.listId);
  const loggedIn = localStorage.getItem("id");
  const listId = props.listId;

  const addNewComment = async (e) => {
    // console.log(localStorage.getItem("id"));

    e.preventDefault();
    // console.log({ text });
    try {
      setText("");
      const userid = localStorage.getItem("id");
      if (userid) {
        const comment = { text };
        const addedCommentRes = await axios
          .post(
            `https://wish-back.herokuapp.com/${userid}/comment/list/${listId}`,
            comment
          )
          .catch((error) => console.log(error));
        console.log(addedCommentRes);
        if (addedCommentRes.data.res) {
          setError(addedCommentRes.data.res);
        }
        props.parentMethod();
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      {loggedIn ? (
        <form onSubmit={addNewComment} className="add-comment form-style-6">
          {error && <Error error={error} clearError={() => setError("")} />}
          <textarea
            type="text"
            id="text"
            value={text}
            placeholder="Text"
            onChange={(e) => setText(e.target.value)}
          />
          <button className="example_b comment-btn">Add comment</button>
        </form>
      ) : (
        <p>Only authorized users can leave comments</p>
      )}
    </div>
  );
};

export default AddComment;

import React, { useState, useCallback, useMemo, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addPost, editPost, deletePost } from "../redux/postSlice";

export default function Posts() {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const dispatch = useDispatch();
  const { posts } = useSelector((state) => state.postSlice);
  const [isEdit, setIsEdit] = useState(false);
  const [id, setId] = useState(null);

  const postToEdit = useMemo(() => {
    const desiredPost = posts.find((item) => item.id === id);
    return desiredPost;
  }, [id, posts]);

  useEffect(() => {
    setEditedTitle(postToEdit?.title || "");
    setEditedDesc(postToEdit?.desc || "");
  }, [postToEdit]);

  const [editedTitle, setEditedTitle] = useState("");
  const [editedDesc, setEditedDesc] = useState("");

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      if (title) {
        dispatch(addPost({ id: posts.length + 1, title, desc }));
        setTitle("");
        setDesc("");
      }
    },
    [desc, dispatch, posts.length, title]
  );

  return (
    <div>
      <form onSubmit={(e) => handleSubmit(e)}>
        <input
          type="text"
          required
          placeholder="Title*"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          type="text"
          placeholder="Description"
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
        />
        <button disabled={!Boolean(title)}>Add</button>
      </form>

      <div className="posts">
        {posts.length
          ? posts.map((post) => {
              return (
                <div key={post.id} className="post">
                  <h2>{post.title}</h2>
                  <p>{post.desc}</p>
                  <button
                    onClick={() => {
                      setIsEdit(true);
                      setId(post.id);
                    }}
                  >
                    Edit
                  </button>
                  <button onClick={() => dispatch(deletePost(post.id))}>
                    Delete
                  </button>

                  <br />

                  {isEdit && post.id === id && (
                    <div className="edit-box">
                      <input
                        type="text"
                        placeholder="Update title"
                        value={editedTitle}
                        onChange={(e) => setEditedTitle(e.target.value)}
                      />
                      <input
                        type="text"
                        placeholder="Update description"
                        value={editedDesc}
                        onChange={(e) => setEditedDesc(e.target.value)}
                      />
                      <button
                        disabled={!Boolean(editedTitle)}
                        onClick={() => {
                          if (editedTitle || editedDesc) {
                            dispatch(
                              editPost({
                                title: editedTitle,
                                desc: editedDesc,
                                id: post.id,
                              })
                            );
                            setEditedTitle("");
                            setEditedDesc("");
                            setIsEdit(false);
                          }
                        }}
                      >
                        Update
                      </button>
                      <button
                        className="close"
                        onClick={() => setIsEdit(false)}
                      >
                        X
                      </button>
                    </div>
                  )}
                </div>
              );
            })
          : "There are no posts yet!"}
      </div>
    </div>
  );
}

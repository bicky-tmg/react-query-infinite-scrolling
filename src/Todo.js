import React from "react";

const Todo = React.forwardRef(({ todo }, ref) => {
  const todoContent = (
    <>
      <h2>{todo.title}</h2>
      <p>Status: {todo.completed ? "Completed" : "To Complete"}</p>
    </>
  );

  const content = ref ? (
    <article className="article" ref={ref}>
      {todoContent}
    </article>
  ) : (
    <article className="article">{todoContent}</article>
  );
  return content;
});

export default Todo;

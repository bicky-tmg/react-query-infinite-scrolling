import { useCallback, useRef } from "react";
import { useInfiniteQuery } from "react-query";
import "./App.css";
import Todo from "./Todo";

function App() {
  const LIMIT = 10;

  const fetchTodos = async (page) => {
    const response = await fetch(
      `https://jsonplaceholder.typicode.com/todos?_page=${page}&_limit=${LIMIT}`
    );
    return response.json();
  };

  const { data, isSuccess, hasNextPage, fetchNextPage, isFetchingNextPage } =
    useInfiniteQuery("posts", ({ pageParam = 1 }) => fetchTodos(pageParam), {
      getNextPageParam: (lastPage, allPages) => {
        const nextPage =
          lastPage.length === LIMIT ? allPages.length + 1 : undefined;
        return nextPage;
      },
    });

  const intObserver = useRef();
  const lastTodoRef = useCallback(
    (todo) => {
      if (isFetchingNextPage) return;

      if (intObserver.current) intObserver.current.disconnect();

      intObserver.current = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && hasNextPage) {
            fetchNextPage();
          }
        });
      });

      if (todo) intObserver.current.observe(todo);
    },
    [isFetchingNextPage, hasNextPage, fetchNextPage]
  );

  const content =
    isSuccess &&
    data.pages.map((page) =>
      page.map((todo, i) => {
        if (page.length === i + 1) {
          return <Todo ref={lastTodoRef} key={todo.id} todo={todo} />;
        }
        return <Todo key={todo.id} todo={todo} />;
      })
    );

  return (
    <div className="app">
      {content}
      {isFetchingNextPage && <h3>Loading...</h3>}
    </div>
  );
}

export default App;

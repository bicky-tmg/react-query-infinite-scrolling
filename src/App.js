import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { useInfiniteQuery } from "react-query";
import "./App.css";
import Todo from "./Todo";

function App() {
  const { ref, inView } = useInView();
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

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage, hasNextPage]);

  const content =
    isSuccess &&
    data.pages.map((page) =>
      page.map((todo, i) => {
        if (page.length === i + 1) {
          return <Todo ref={ref} key={todo.id} todo={todo} />;
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

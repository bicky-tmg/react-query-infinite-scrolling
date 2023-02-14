import { useCallback, useRef } from "react";
import { useInfiniteQuery } from "react-query";
import "./App.css";
import Post from "./Post";

function App() {
  const LIMIT = 10;

  const fetchPosts = async (page) => {
    const response = await fetch(
      `https://jsonplaceholder.typicode.com/posts?_page=${page}&_limit=${LIMIT}`
    );
    return response.json();
  };

  const { data, isSuccess, hasNextPage, fetchNextPage, isFetchingNextPage } =
    useInfiniteQuery("posts", ({ pageParam = 1 }) => fetchPosts(pageParam), {
      getNextPageParam: (lastPage, allPages) => {
        const nextPage =
          lastPage.length === LIMIT ? allPages.length + 1 : undefined;
        return nextPage;
      },
    });

  const intObserver = useRef();
  const lastPostRef = useCallback(
    (post) => {
      if (isFetchingNextPage) return;

      if (intObserver.current) intObserver.current.disconnect();

      intObserver.current = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && hasNextPage) {
            fetchNextPage();
          }
        });
      });

      if (post) intObserver.current.observe(post);
    },
    [isFetchingNextPage, hasNextPage, fetchNextPage]
  );

  const content =
    isSuccess &&
    data.pages.map((page) =>
      page.map((post, i) => {
        if (page.length === i + 1) {
          return <Post ref={lastPostRef} key={post.id} post={post} />;
        }
        return <Post key={post.id} post={post} />;
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

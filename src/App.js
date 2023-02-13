import { useQuery } from "react-query";
import "./App.css";

function App() {
  const fetchPosts = async () => {
    const response = await fetch(
      `https://jsonplaceholder.typicode.com/posts?_page=2&_limit=10`
    );
    return response.json();
  };

  const { data, isSuccess } = useQuery("repos", fetchPosts);

  return (
    <div className="app">
      {isSuccess &&
        data.map((post) => (
          <div className="article" key={post.id}>
            <h2>{post.title}</h2>
            <p>{post.body}</p>
          </div>
        ))}
    </div>
  );
}

export default App;

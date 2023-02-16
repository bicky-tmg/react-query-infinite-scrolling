import { useQuery } from "react-query";
import "./App.css";

function App() {
  const fetchTodos = async () => {
    const response = await fetch(
      `https://jsonplaceholder.typicode.com/todos?_page=1&_limit=10`
    );
    return response.json();
  };

  const { data, isSuccess } = useQuery("todos", fetchTodos);

  return (
    <div className="app">
      {isSuccess &&
        data.map((todo) => (
          <div className="article" key={todo.id}>
            <h2>{todo.title}</h2>
            <p>Status: {todo.completed ? "Completed" : "To Complete"}</p>
          </div>
        ))}
    </div>
  );
}

export default App;

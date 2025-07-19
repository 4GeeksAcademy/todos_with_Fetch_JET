import React, { useState, useEffect } from "react";

//create your first component
const Home = () => {
  let [userName, setUserName] = useState("jet007");
  const [todos, setTodos] = useState([]);
  const [text, setText] = useState("");

  useEffect(() => {
    createUser(userName);
    console.log(userName);
  }, []);

  //adding a new user to the list
  function createUser(username) {
    fetch("https://playground.4geeks.com/todo/users/" + username, {
      method: "POST",
      body: JSON.stringify([]),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        console.log(data);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  //GETting the list from the server and display on the webpage
  function getTodos(username) {
    fetch("https://playground.4geeks.com/todo/todos/" + username)
      .then((response) => {
        if (!response.ok) throw new Error("Failed to fetch todos");
        return response.json();
      })
      .then((data) => {
        setTodos(data); // Update state so the list displays
        console.log("Successful todos fetch:", data);
      })
      .catch((error) => {
        console.error("Error fetching todos:", error);
      });
  }

  //Adding a new task that is displayed on the webpage (POST)
  function addTodo() {
    const trimmed = text.trim();
    if (!trimmed) return;
    fetch("https://playground.4geeks.com/todo/todos/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        label: trimmed,
        is_done: false,
        user_id: userName,
      }),
    })
      .then((response) => {
        if (!response.ok) throw new Error("Failed to add the todos");
        return response.json();
      })
      .then((newTodo) => {
        setTodos((prev) => [...prev, newTodo]); // Adding to the current list
        setText(""); //to clear
      })
      .catch((error) => {
        console.error("Error adding todo:", error);
      });
  }

  //deleting a task that is displayed on the webpage (DELETE)
  function deleteTodo(id) {
    fetch(`https://playground.4geeks.com/todo/todos/${id}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (!response.ok) throw new Error("Failed to delete the todo");
        setTodos((prev) => prev.filter((todo) => todo.id !== id));
      })
      .catch((error) => {
        console.error("Error deleting task:", error);
      });
  }

  return (
    <div className="text-center mt-10">
      <h1 className="text-center mb-4">My To Do's</h1>

      {/* Create User Section */}
      <div className="row justify-content-center mb-3">
        <div className="col-md-6">
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="Enter username"
            />
            <button
              onClick={() => createUser(userName)}
              className="btn btn-secondary"
            >
              Create User
            </button>
          </div>
        </div>
      </div>

      {/* Add Todo Section */}
      <div className="row justify-content-center mb-4">
        <div className="col-md-8">
          <div className="input-group">
            <input
              type="text"
              className="form-control me-3"
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addTodo()}
              placeholder="Add your To Do and hit Enter or click the button"
            />
            <button onClick={addTodo} className="btn btn-primary">
              Add to list
            </button>
          </div>
        </div>
      </div>

      {/* Column Headers */}
      <div className="row justify-content-center mb-2">
        <div className="col-md-8">
          <div className="row fw-bold">
            <div className="col-4 text-center">Completed Task</div>
            <div className="col-4 text-start">My To Do</div>
            <div className="col-4 text-center">Remove</div>
          </div>
        </div>
      </div>

      {/* Todo List */}
      <div className="row justify-content-center">
        <div className="col-md-8">
          <ul style={{ listStylePosition: "inside" }}>
            {todos.map((todo) => (
              <li key={todo.id} className="row align-items-center mb-2">
                <div className="col-4 text-center">
                  <input type="checkbox" checked={todo.done} readOnly />
                </div>
                <div className="col-4 text-start">
                  <span
                    style={{
                      textDecoration: todo.done ? "line-through" : "none",
                    }}
                  >
                    {todo.label}
                  </span>
                </div>
                <div className="col-4 text-center">
                  <button
                    onClick={() => deleteTodo(todo.id)}
                    className="btn btn-sm btn-danger"
                  >
                    ×
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <p className="text-center mt-3">{todos.length} Items To Do</p>
    </div>
  );
};

export default Home;

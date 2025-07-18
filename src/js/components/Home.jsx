import React, { useState, useEffect } from "react";

const Home = () => {
  const [userNameInput, setUserNameInput] = useState("");
  const [userName, setUserName] = useState("");
  const [todos, setTodos] = useState([]);
  const [newTask, setNewTask] = useState("");

  // Create a new user
  function createUser(username) {
    const trimmedName = userNameInput.trim();
    if (trimmedName === "") return;

    fetch("https://playground.4geeks.com/todo/users/" + username, {
      method: "POST",
      body: JSON.stringify({ username: trimmedName }),
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => {
        if (!res.ok && res.status !== 400)
          throw new Error("User creation failed");
        return res.json();
      })
      .then(() => {
        setUserName(trimmedName);
        getUsersTodoList(trimmedName);
      })
      .catch((err) => console.log("User creation error:", err));
  }

  // Get todos for user
  function getUsersTodoList(username) {
    fetch(`https://playground.4geeks.com/todo/users/${username}`)
      .then((res) => res.json())
      .then((data) => {
        setTodos(data.todos || []);
      })
      .catch((err) => console.log("Fetching todos error:", err));
  }

  // Add a new task for the user
  function addNewTask() {
    if (newTask.trim() === "" || userName === "") return;

    const task = {
      label: newTask.trim(),
      done: false,
    };

    fetch(`https://playground.4geeks.com/todo/todos/${userName}`, {
      method: "POST",
      body: JSON.stringify(task),
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to add task");
        return res.json();
      })
      .then(() => {
        setNewTask("");
        getUsersTodoList(userName);
      })
      .catch((err) => console.log("Add task error:", err));
  }

  // Delete a single task
  function deleteTodo(todoId) {
    fetch(`https://playground.4geeks.com/todo/todos/${todoId}`, {
      method: "DELETE",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to delete task");
        return res.json();
      })
      .then(() => getUsersTodoList(userName))
      .catch((err) => console.log("Delete error:", err));
  }

  // Clear all tasks (delete one by one)
  function clearAllTasks() {
    const deletions = todos.map((todo) =>
      fetch(`https://playground.4geeks.com/todo/todos/${todo.id}`, {
        method: "DELETE",
      })
    );

    Promise.all(deletions)
      .then(() => getUsersTodoList(userName))
      .catch((err) => console.log("Clear all error:", err));
  }

  // Optional: toggle complete (PUT update task)
  function toggleDone(todo) {
    const updated = { ...todo, done: !todo.done };

    fetch(`https://playground.4geeks.com/todo/todos/${todo.id}`, {
      method: "PUT",
      body: JSON.stringify(updated),
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to update task");
        return res.json();
      })
      .then(() => getUsersTodoList(userName))
      .catch((err) => console.log("Update task error:", err));
  }

  function handleTaskKeyPress(e) {
    if (e.key === "Enter") {
      addNewTask();
    }
  }

  function handleUserKeyPress(e) {
    if (e.key === "Enter") {
      createUser();
    }
  }

  return (
    <div className="text-center container mt-5">
      <h1>To-do List with Fetch</h1>

      {/* Username input */}
      <div className="d-flex justify-content-center mb-4">
        <input
          type="text"
          className="form-control w-50 me-2"
          placeholder="Enter your name to create a new user"
          value={userNameInput}
          onChange={(e) => setUserNameInput(e.target.value)}
          onKeyDown={handleUserKeyPress}
        />
        <button className="btn btn-success" onClick={createUser}>
          Create User
        </button>
      </div>

      {/* Show user if active */}
      {userName && <h5 className="mb-3">User: {userName}</h5>}

      {/* Task input and list */}
      {userName && (
        <>
          <div className="d-flex justify-content-center mb-3">
            <input
              type="text"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              onKeyDown={handleTaskKeyPress}
              className="form-control w-50 me-2"
              placeholder="Add a task and hit Enter or click Add"
            />
            <button className="btn btn-primary me-2" onClick={addNewTask}>
              Add to list
            </button>
            <button className="btn btn-danger" onClick={clearAllTasks}>
              Clear All
            </button>
          </div>

          <ul className="list-group">
            {todos.length === 0 ? (
              <li className="list-group-item">No tasks yet</li>
            ) : (
              todos.map((todo, i) => (
                <li
                  key={todo.id || i}
                  className="list-group-item d-flex justify-content-between align-items-center"
                >
                  <span
                    style={{
                      textDecoration: todo.done ? "line-through" : "none",
                      cursor: "pointer",
                    }}
                    onClick={() => toggleDone(todo)}
                  >
                    {todo.label}
                  </span>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => deleteTodo(todo.id)}
                  >
                    ×
                  </button>
                </li>
              ))
            )}
          </ul>
        </>
      )}
    </div>
  );
};

export default Home;

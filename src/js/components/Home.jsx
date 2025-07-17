import React, { useState, useEffect } from "react";

//create your first component
const Home = () => {
  let [userName, setUserName] = useState("jet007");

  useEffect(() => {
    createUser(userName);
    getUsersTodoList();
    console.log(userName);
  }, []);

//creating the New User Function
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

//creating the Get-to-do list Function
function getUsersTodoList() {
    fetch("https://playground.4geeks.com/todo/users/" + userName)
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

  return (
    <div className="text-center">
      <h1>To do list with Fetch</h1>
      <input
        type="text"
        className="form-control me-3"
        placeholder="Add your To Do and hit Enter or click the button"
      />
      <button className="btn btn-primary">Add to list</button>
      <ul>
        <li>Todo 1</li>
        <li>Todo 2</li>
        <li>Todo 3</li>
      </ul>
    </div>
  );
};

export default Home;

import React, { useEffect, useState } from "react";
import axios from "axios";
import './App.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTaskText, setNewTaskText] = useState("");

  // Fetch tasks when the app loads
  useEffect(() => {
    axios.get("http://127.0.0.1:8000/tasks")
      .then((res) => setTasks(res.data))
      .catch((err) => console.error("Error fetching tasks:", err));
  }, []);

  // Add new task
  const addTask = async () => {
    if (!newTaskText.trim()) return;

    const newTask = {
      id: Date.now(), // just using timestamp as a fake ID
      text: newTaskText
    };

    try {
      const res = await axios.post("http://127.0.0.1:8000/tasks", newTask);
      setTasks([...tasks, res.data]);
      setNewTaskText("");
    } catch (err) {
      console.error("Error adding task:", err);
    }
  };

  const toggleDone = async (taskId) => {
    const updatedTasks = tasks.map(task => {
      if (task.id === taskId) {
        return { ...task, done: !task.done };
      }
      return task;
    });

    setTasks(updatedTasks);

    const taskToUpdate = updatedTasks.find(t => t.id === taskId);
    try {
      await axios.post("http://127.0.0.1:8000/tasks", taskToUpdate);
    } catch (err) {
      console.error("Failed to update task:", err);
    }
  };

  // Delete task
  const deleteTask = async (id) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/tasks/${id}`);
      setTasks(tasks.filter((task) => task.id !== id));
    } catch (err) {
      console.error("Error deleting task:", err);
    }
  };

  return (
    <div className="container">
      <h1>To-Do List</h1>


      <form
        onSubmit={(e) => {
          e.preventDefault(); // stops page refresh
          addTask(); // your existing function
        }}
      >
        <input
          value={newTaskText}
          onChange={(e) => setNewTaskText(e.target.value)}
          placeholder="What do you need to do?"
        />
        <button type="submit" className="btn-add">Add Task</button>
      </form>

      <ul>
        {tasks.map((task) => (
          <li key={task.id}>
            <label>
              <input
                type="checkbox"
                checked={task.done}
                onChange={() => toggleDone(task.id)}
              />
              {task.text}{" "}
            </label>
            <button className="btn-del" onClick={() => deleteTask(task.id)}> ❌</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
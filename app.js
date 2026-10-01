
import React, { useEffect, useState } from "react";

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);

  const API_URL = "https://jsonplaceholder.typicode.com/todos";

  useEffect(() => {
    fetch(`${API_URL}?_limit=10`)
      .then((response) => response.json())
      .then((data) => setTasks(data))
      .catch((error) => console.error("Error:", error));
  }, []);

  const addTask = async () => {
    if (!title.trim()) {
      alert("Please enter a task");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: title,
          completed: false,
          userId: 1,
        }),
      });

      const newTask = await response.json();

      setTasks((currentTasks) => [
        {
          ...newTask,
          id: Date.now(),
        },
        ...currentTasks,
      ]);

      setTitle("");
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleTask = (id) => {
    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === id
          ? { ...task, completed: !task.completed }
          : task
      )
    );
  };

  const deleteTask = (id) => {
    setTasks((currentTasks) =>
      currentTasks.filter((task) => task.id !== id)
    );
  };

  return (
    <main style={styles.container}>
      <h1>Task Manager</h1>

      <div style={styles.inputArea}>
        <input
          type="text"
          placeholder="Enter a new task"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <button onClick={addTask} disabled={loading}>
          {loading ? "Adding..." : "Add Task"}
        </button>
      </div>

      <section>
        <h2>Tasks</h2>

        {tasks.length === 0 ? (
          <p>No tasks available.</p>
        ) : (
          <ul style={styles.list}>
            {tasks.map((task) => (
              <li key={task.id} style={styles.task}>
                <span
                  onClick={() => toggleTask(task.id)}
                  style={{
                    ...styles.title,
                    textDecoration: task.completed
                      ? "line-through"
                      : "none",
                  }}
                >
                  {task.title}
                </span>

                <button onClick={() => deleteTask(task.id)}>
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}

const styles = {
  container: {
    maxWidth: "800px",
    margin: "40px auto",
    padding: "20px",
    fontFamily: "Arial, sans-serif",
  },

  inputArea: {
    display: "flex",
    gap: "10px",
    marginBottom: "30px",
  },

  list: {
    listStyle: "none",
    padding: 0,
  },

  task: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "12px",
    marginBottom: "10px",
    border: "1px solid #ddd",
    borderRadius: "6px",
  },

  title: {
    cursor: "pointer",
    flex: 1,
  },
};

export default App;

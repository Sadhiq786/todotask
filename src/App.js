import { useEffect, useState } from 'react';
import './App.css';
import { AiOutlineDelete, AiOutlineEdit } from 'react-icons/ai';
import { BsCheckLg } from 'react-icons/bs';
import axios from 'axios';

function App() {
  const [isCompleteScreen, setIsCompleteScreen] = useState(false);
  const [allTodos, setTodos] = useState([]);
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [completedTodos, setCompletedTodos] = useState([]);
  const [currentEdit, setCurrentEdit] = useState("");
  const [currentEditedItem, setCurrentEditedItem] = useState("");
  const [draggedTaskIndex, setDraggedTaskIndex] = useState(null);


  // handleAddTodo
  const handleAddTodo = () => {
    let newTodoItem = {
      title: newTitle,
      description: newDescription
    };
  
    let updatedTodoArr = [newTodoItem, ...allTodos];
    setTodos(updatedTodoArr);
    localStorage.setItem("todolist", JSON.stringify(updatedTodoArr));
  };

  // delete
  const handleDeleteTodo = (index) => {
    let reducedTodo = [...allTodos];
    reducedTodo.splice(index, 1);

    localStorage.setItem("todolist", JSON.stringify(reducedTodo));
    setTodos(reducedTodo);
  };

  const handleComplete = (index) => {
    let now = new Date();
    let dd = now.getDate();
    let mm = now.getMonth();
    let yyyy = now.getFullYear();
    let h = now.getHours();
    let m = now.getMinutes();
    let s = now.getSeconds();
    let completedOn = `${dd}-${mm}-${yyyy} at ${h}:${m}:${s}`;

    let filteredItem = {
      ...allTodos[index],
      completedOn: completedOn
    };


    // Check if the task already exists in completedTodos
    if (!completedTodos.find((item) => item.title === filteredItem.title && item.description === filteredItem.description)) 
    {
      let updatedCompletedArr = [...completedTodos];
      updatedCompletedArr.push(filteredItem);
      setCompletedTodos(updatedCompletedArr);
      localStorage.setItem("completedTodos", JSON.stringify(updatedCompletedArr));
    }
    else
    {
      alert("Task already exists");
    }

    handleDeleteTodo(index);
  };

  // delete (completed tasks)
  const handleDeleteCompleteTodo = (index) => {
    let reducedTodo = [...completedTodos];
    reducedTodo.splice(index, 1);

    localStorage.setItem("completedTodos", JSON.stringify(reducedTodo));
    setCompletedTodos(reducedTodo);
  };

  // localstorage getting items
  useEffect(() => {
    let savedTodo = JSON.parse(localStorage.getItem("todolist"));
    let savedCompletedTodo = JSON.parse(localStorage.getItem("completedTodos"));
    if (savedTodo) {
      setTodos(savedTodo);
    }

    if (savedCompletedTodo) {
      setCompletedTodos(savedCompletedTodo);
    }
  }, []);

  const handleEdit = (index, item) => {
    setCurrentEdit(index);
    setCurrentEditedItem(item);
  };

  const handleUpdateTitle = (value) => {
    setCurrentEditedItem((prev) => {
      return { ...prev, title: value };
    });
  };

  const handleUpdateDescription = (value) => {
    setCurrentEditedItem((prev) => {
      return { ...prev, description: value };
    });
  };

  const handleUpdateTodo = () => {
    let newTodo = [...allTodos];
    newTodo[currentEdit] = currentEditedItem;
    setTodos(newTodo);
    localStorage.setItem("todolist", JSON.stringify(newTodo));
    setCurrentEdit("");
  };

// localstorage getting items
useEffect(() => {
  let savedTodo = JSON.parse(localStorage.getItem("todolist"));
  let savedCompletedTodo = JSON.parse(localStorage.getItem("completedTodos"));
  if (savedTodo) {
    setTodos(savedTodo);
  }

  if (savedCompletedTodo) {
    setCompletedTodos(savedCompletedTodo);
  }
  // Fetch data from API only if there's no data in local storage
  if (!savedTodo) {
    axios.get("https://jsonplaceholder.typicode.com/todos")
      .then((res) => {
        setTodos(res.data);
      })
      .catch((error) => {
        console.error("Error", error);
      });
  }
}, []);




  // drags
  const handleDragStart = (index) => {
    setDraggedTaskIndex(index);
  };

  const handleDragEnter = (event, index) => {
    event.preventDefault();
    if (draggedTaskIndex !== null && draggedTaskIndex !== index) {
      const updatedTodos = [...allTodos];
      const draggedTask = updatedTodos[draggedTaskIndex];
      updatedTodos.splice(draggedTaskIndex, 1);
      updatedTodos.splice(index, 0, draggedTask);
      setTodos(updatedTodos);
      setDraggedTaskIndex(index);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleDragEnd = () => {
    setDraggedTaskIndex(null);
  };


  return (
    <div className="App">
      <h1>My Todos</h1>

      <div className='todo-wrapper'>
        <div className='todo-input'>
          <div className='todo-input-item'>
            <label>Title</label>
            <input type="text" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder='Enter your task title' />
          </div>

          <div className='todo-input-item'>
            <label>Description</label>
            <input type="text" value={newDescription} onChange={(e) => setNewDescription(e.target.value)} placeholder='Enter your task description' />
          </div>

          <div className='todo-input-item'>
            <button type='button' onClick={handleAddTodo} className='primaryBtn'>Add</button>
          </div>
        </div>

        <div className='btn-area'>
          <button className={`secondaryBtn ${isCompleteScreen === false && "active"}`} onClick={() => setIsCompleteScreen(false)}>Incomplete tasks</button>
          <button className={`secondaryBtn ${isCompleteScreen === true && "active"}`} onClick={() => setIsCompleteScreen(true)}>Completed tasks</button>
        </div>

        <div className='todo-list'>

          {/* data showing */}

          {
            isCompleteScreen === false &&
            allTodos.map((item, index) => {
              if (currentEdit === index) {
                return (
                  <div className='edit_wrapper' key={index}>
                    <input type='text' placeholder='Update' value={currentEditedItem.title} onChange={(e) => handleUpdateTitle(e.target.value)} />
                    <textarea placeholder='Update description' rows={4} value={currentEditedItem.description} onChange={(e) => handleUpdateDescription(e.target.value)} />
                    <button type='button' onClick={handleUpdateTodo} className='primaryBtn'>Update</button>
                  </div>
                );
              } else {
                return (
                  // <div className='todo-list-item' key={index}>
                  <div
                      key={index}
                      className='todo-list-item'
                      draggable
                      onDragStart={() => handleDragStart(index)}
                      onDragEnter={(event) => handleDragEnter(event, index)}
                      onDragOver={handleDragOver}
                      onDragEnd={handleDragEnd}
                    >
                    <div>
                      <h3>{item.title}</h3>
                      <p>{item.description}</p>
                    </div>
                    <div>
                      <AiOutlineDelete className='icon' onClick={() => handleDeleteTodo(index)} />
                      <BsCheckLg className='check-icon' onClick={() => handleComplete(index)} />
                      <AiOutlineEdit className='check-icon' onClick={() => handleEdit(index, item)} />
                    </div>
                  </div>
                );
              }
            })}
          {
            isCompleteScreen === true &&
            completedTodos.map((item, index) => {
              return (
                <div className='todo-list-item' key={index}>
                  <div>
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                    <p className='line'><small>Completed on: {item.completedOn}</small></p>
                  </div>
                  <div>
                    <AiOutlineDelete className='icon' onClick={() => handleDeleteCompleteTodo(index)} />
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}

export default App;

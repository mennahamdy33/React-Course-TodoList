import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import "../App.css";

export function TodoInput({ onAdd }) {
  const inputRef = useRef(); 
  let [value, setValue] = useState("");
  useEffect(()=>{
  if(inputRef.current)
  inputRef.current.focus();}
  ,[]);
  return (
    <div class="input">
      <input
       ref ={inputRef}
        type="text"
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
        }}
      />

      <button
        onClick={() => {
          onAdd(value);
          setValue("");
        }}
      >
        Add item
      </button>
    </div>
  );
}
export function TodoList({ items, onDelete, onCheck, onDoubleClick, onSave }) {
  return (
    <ul>
      {items.map((item) => (
        <TodoItem
          value={item}
          onDelete={() => {
            onDelete(item);
          }}
          onCheck={() => {
            onCheck(item);
          }}
          onDoubleClick={(setEditing) => {
            onDoubleClick(setEditing);
          }}
          onSave={(edited, setEditing) => {
            onSave(edited, setEditing, item);
          }}
        />
      ))}
    </ul>
  );
}

export function TodoItem({ value, onDelete, onCheck, onDoubleClick, onSave }) {
  let [edited, setValue] = useState(value.title);
  const [editing, setEditing] = useState(false);
  const inputRef = useRef(); 
  let viewMode = {};
  let editMode = {};

  if (editing) {
    viewMode.display = "none";
  } else {
    editMode.display = "none";
  }
  return (
    <>
      <li style={viewMode}>
        <input
          ref ={inputRef}
          type="checkbox"
          checked={value.completed}
          onChange={() => {
            onCheck();
          }}
        />

        <span
          onDoubleClick={() => {
            onDoubleClick(setEditing);
          }}
        >
          {value.title}
        </span>
        <button
          onClick={() => {
            onDelete();
          }}
        >
          X
        </button>
      </li>
      <li style={editMode}>
        <input
          type="text"
          value={edited}
          onChange={(e) => {
            setValue(e.target.value);
          }}
        />
        <button
          onClick={() => {
            onSave(edited, setEditing);
            setValue("");
          }}
        >
          Save
        </button>
      </li>
    </>
  );
}

export function TodoPage() {
  const [items, setItems] = useState([
    { id: 1, title: "Item1", completed: true },
    { id: 2, title: "Item2", completed: false },
  ]);
  const [filter, setFilter] = useState("all");
  const filteredItems = useMemo(()=> {
      if(filter === "todo") 
   return items.filter((i)=> !i.completed); 
  else if( filter=== "completed") 
  return items.filter((i)=> i.completed);
  else 
  return items},[filter, items]);
  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/todos")
      .then((response) => response.json())
      .then((json) => setItems(json));
  }, []);

  const handleSaveTodo= useCallback((edited, setEditing, item) => {
    setItems(
      items.map((todoItem) =>
        todoItem.id === item.id
          ? { ...todoItem, title: edited }
          : todoItem
      )
    );
    setEditing(false);
  },[items,setItems]);

  const handleCheckTodo = useCallback((item) => {
    setItems(
      items.map((todoItem) =>
        todoItem.id === item.id
          ? { ...todoItem, completed: !todoItem.completed }
          : todoItem
      )
    );
  },[items,setItems]);

const handleDoubleClickTodo = useCallback((setEditing) => {
    setEditing(true);
  },[]);

  const handleDeleteTodo = useCallback((item) => {
    setItems(items.filter((todoItem) => todoItem.id !== item.id));
  },[items,setItems]);

  const handleAddTodo = useCallback((value) => {
    setItems([
      ...items,
      { id: Math.random(), title: value, completed: false },
    ]);
  },[items,setItems]);

  const handleFilterTodo = useCallback((value) => {
    setFilter(value);
  },[]);
  return (
      
    <div class='App'>
        <div class="buttons">
        <button onClick={()=>{handleFilterTodo('all')}}>All</button>
        <button onClick={()=>{handleFilterTodo('todo')}}>Todo</button>
        <button onClick={()=>{handleFilterTodo('completed')}}>Completed</button>
        </div>
      <TodoInput
        onAdd={handleAddTodo}
      />
      <TodoList
        items={filteredItems}
        onDelete={handleDeleteTodo}
        onCheck={handleCheckTodo}
        onDoubleClick={handleDoubleClickTodo}
        onSave={handleSaveTodo}
      />
    </div>
  );
}

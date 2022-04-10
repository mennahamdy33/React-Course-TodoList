import { useState, useEffect } from "react";
import "./App.css";
export function TodoInput({ onAdd }) {
  let [value, setValue] = useState("");
  return (
    <div class="input">
      <input
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

export function App() {
  const [items, setItems] = useState([
    { id: 1, title: "Item1", completed: true },
    { id: 2, title: "Item2", completed: false },
  ]);
  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/todos")
      .then((response) => response.json())
      .then((json) => setItems(json));
  }, []);
  return (
    <div class='App'>
      <TodoInput
        onAdd={(value) => {
          setItems([
            ...items,
            { id: Math.random(), label: value, completed: false },
          ]);
        }}
      />
      <TodoList
        items={items}
        onDelete={(item) => {
          setItems(items.filter((todoItem) => todoItem.id !== item.id));
        }}
        onCheck={(item) => {
          setItems(
            items.map((todoItem) =>
              todoItem.id === item.id
                ? { ...todoItem, completed: !todoItem.completed }
                : todoItem
            )
          );
        }}
        onDoubleClick={(setEditing) => {
          setEditing(true);
        }}
        onSave={(edited, setEditing, item) => {
          setItems(
            items.map((todoItem) =>
              todoItem.id === item.id
                ? { ...todoItem, title: edited }
                : todoItem
            )
          );
          setEditing(false);
        }}
      />
    </div>
  );
}

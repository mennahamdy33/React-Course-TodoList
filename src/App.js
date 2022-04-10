import { useState, useEffect } from "react";

export function TodoInput({ onAdd }){

let [value, setValue] = useState("");
return (<div >
    <input 
    type = "text"
    value={value}
    onChange={(e)=>{
        setValue(e.target.value);
    }

    }/>
    
<button
onClick={()=>{
    onAdd(value);
    setValue("");
}}
>Add item</button>
</div>


);

}
export function TodoList({ items,onDelete,onCheck,onDoubleClick }){
    return (
    
    
    <ul>
{items.map((item)=>(
<TodoItem
value= {item}
onDelete={()=>{
onDelete(item);
    

}}
onCheck={()=>{
    onCheck(item);
    
    }}
onDoubleClick={(setEditing)=>{
    onDoubleClick(setEditing);
}
}
/>


))}

</ul>
);
}

export function TodoItem({ value, onDelete,onCheck,onDoubleClick,onSave }){
    let [edited, setValue] = useState(value.title);
       
       const [editing,setEditing] = useState(false);

      let viewMode = {}
      let editMode = {}
      
      if (editing) {
        viewMode.display = "none"
      } else {
        editMode.display = "none"
      }
    return (
    <>
    <li style={viewMode}>
        <input 
        type="checkbox" 
        checked={value.completed} 
        onChange={
            ()=>{onCheck()
        }
        }
        />

        <span onDoubleClick={()=>{onDoubleClick(setEditing);}}>{value.title}</span>
        <button onClick={()=>{onDelete()}}>X</button>

    </li>
    <li style={editMode}>
<input type="text" value={edited} />
<button 
onClick={()=>{
    onSave(edited);
    setValue("");
}}
>Save</button>
</li>
    </>
);
}

export function App(){
const [items, setItems]= useState([
    {id: 1, title: "Item1", completed: true },
    {id: 2, title: "Item2", completed: false }
]);
useEffect(() => {
    fetch('https://jsonplaceholder.typicode.com/todos')
  .then(response => response.json())
  .then((json) => setItems(json));
  }, []);
return (<div>
    <TodoInput onAdd={(value) => {
        setItems([
            ...items,
            {id: Math.random(), label: value, completed: false }
        ]);
    }
    }
    />
    <TodoList items={items}
    onDelete={(item)=>{
        setItems(items.filter((todoItem)=>todoItem.id !== item.id));
    }

}
 onCheck = {(item) =>  {
    
    let newArr = [...items]; 
    for(let i =0; i<newArr.length;i++){
    if(newArr[i]==item){
        newArr[i].completed = !newArr[i].completed;
    }
    }
    
    setItems(newArr);
  }
}
    onDoubleClick = {(setEditing) => {
        
        setEditing(true);

      }}

/>
</div>
);

}

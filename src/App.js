import "./App.css";
import {Routes, Route, Navigate} from "react-router-dom";
import {TodoPage} from './pages/TodoPage';
import {Home} from './pages/HomePage';
export function App() {
    
    return (
    <Routes>
    <Route path="/" element={<Navigate to ='/home'/>}/>  
    <Route path="home" element={<Home/>}/>  
    <Route path="todo" element={<TodoPage/>}/>
    </Routes>)
}

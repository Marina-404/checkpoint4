import { useEffect, useState } from "react";
import api from "../services/api";
import { useNavigate, useParams } from "react-router-dom";
import { IoReturnDownBackOutline } from "react-icons/io5";
import "../style/taskPage.css";
import "../style/listPage.css";
import icon from "../assets/icon.png";

type Task = {
    id: number;
    title: string;
    is_done: boolean;
};

type ListTasks = {
    id: number;
    title: string;
    tasks: Task[];
};

export default function TasksPage() {
    const { id } = useParams<{id: string}>();
    const navigate = useNavigate();

    const [listWithTasks, setListWithTasks] = useState<ListTasks | null>(null);
    const [newTitle, setNewTitle] = useState("");
    const [edit, setEdit] = useState<number | null>(null);
    const [editTitle,setEditTitle] = useState("");
    const [input, setInput] = useState(false);

    const fetchListsTasks = async () => {
        if (!id) return; 
        const res = await api.get(`/lists/${id}/full`);
            setListWithTasks(res.data);
    };

    // ajouter une nouvelle tâche
    const addTask = async () => {
        if (!newTitle.trim()) return;
        await api.post("/tasks", {
            title: newTitle,
            list_id: Number(id)
        });
        setNewTitle("");
        fetchListsTasks();
    };

    // modifier le titre d'une tâche
    const updateTask = async (taskId: number) => {
        if (!editTitle.trim()) return;
        await api.put(`/tasks/${taskId}`, {title: editTitle});
        setEdit(null);
        setEditTitle("")
        fetchListsTasks();
    }

    // supprimer une liste
    const deleteTask = async (taskId: number) => {
        await api.delete(`/tasks/${taskId}`);
        fetchListsTasks();
    };

    // changer l'état
    const toggleTask = async (taskId: number) => {
        await api.patch(`/tasks/${taskId}/toggle`);
        fetchListsTasks();
    }

    useEffect(() => {
        if (id) fetchListsTasks();
    }, [id]);

    if (!listWithTasks) {
        return <div> Chargement des tâches en cours...</div>
    }

    const couleurs = ["#FFC0C0", "#D5D9FF", "#f7f7a6ff", "#C4FFE7"];

    const getColorById = (id: number) => {
    return couleurs[id % couleurs.length];
    };

return (
    <div className="task-page">
        <div className="header-section">
            <div className="icon-container">
                <img src={icon} alt="App Icon" className="app-icon" />
             </div>
            <button className="btn-back" onClick={() => navigate("/lists")}><IoReturnDownBackOutline /></button>
        </div>
        <h1 className="task-list-title">{listWithTasks.title}</h1>
        <p className="task-count">
            {listWithTasks.tasks.filter(t => t.is_done).length} / {listWithTasks.tasks.length} tâches terminées
        </p>
        {listWithTasks.tasks.map((task) => (
            <div 
            key={task.id} 
            className="task-item"
             style={{ backgroundColor: getColorById(task.id)}}
            >
                <div className="task-main">
                    <input 
                        className="custom-checkbox"
                        type="checkbox"
                        checked={task.is_done}
                        onChange={() => toggleTask(task.id)} 
                    />
                    {edit === task.id ? (
                        <>
                        <input
                            className="task-edit-input" 
                            value={editTitle}
                            onChange={(e)=> setEditTitle(e.target.value)} 
                         />
                        </>
                ) : (
                    <span 
                        className="task-title"
                        onClick={() => {
                            setEdit(task.id);
                            setEditTitle(task.title);
                    }}>
                        {task.title}
                    </span>  
                )}
                </div>
                    <div className="task-button">
                        {edit === task.id ? (
                            <>
                                <button type="button" className="btn-save-task" onClick={() => updateTask(task.id)}>V</button>
                                <button className="btn-cancel-task" onClick={() => setEdit(null)}>X</button>
                            </>
                        ) : (
                        <button className="btn-delete-task" onClick={() => deleteTask(task.id)}>X</button>
                    )}</div>
                </div> 
            ))}
                
                <div className="task-add-section">
                {input ? (
                    <div className="task-input-container">
                        <input
                            className="task-input" 
                            placeholder="Nouvelle tâche"
                            value={newTitle}
                            onChange={(e) => setNewTitle(e.target.value)} 
                        />
                        <div className="add-cancel-section-task">
                            <button 
                                className="btn-add-task" 
                                onClick={addTask}
                            >
                                + Ajouter la tâche
                            </button>
                            <button
                                className="btn-cancel-task" 
                                onClick={() => { 
                                    setInput(false); 
                                    setNewTitle("")
                            }}
                            >
                                X
                            </button>
                        </div>
                    </div>
                ) : (
                    <button
                        className="btn-add-new-task" 
                        onClick={() => setInput(true)}
                    >
                        + nouvelle tâche
                    </button>
                )}
            </div>
        </div>
    );   
}
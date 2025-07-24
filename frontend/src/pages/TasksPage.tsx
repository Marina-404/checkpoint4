import { useEffect, useState } from "react";
import api from "../services/api";
import { useNavigate, useParams } from "react-router-dom";

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

return (
    <div>
        <button onClick={() => navigate("/lists")}>Retour</button>
        <h1>{listWithTasks.title}</h1>
        <p>
            {listWithTasks.tasks.filter(t => t.is_done).length} / {listWithTasks.tasks.length} tâches terminées
        </p>
        {listWithTasks.tasks.map((task) => (
            <div key={task.id}>
                    <input 
                        type="checkbox"
                        checked={task.is_done}
                        onChange={() => toggleTask(task.id)} 
                    />
                    {edit === task.id ? (
                        <>
                        <input 
                            value={editTitle}
                            onChange={(e)=> setEditTitle(e.target.value)} 
                            onKeyDown={(e) => e.key === "Enter" && updateTask(task.id)}
                         />
                        <button onClick={() => updateTask(task.id)}>V</button>
                        <button onClick={() => setEdit(null)}>X</button>
                    </>
                ) : (
                    <span onClick={() => {
                        setEdit(task.id);
                        setEditTitle(task.title);
                    }}>
                        {task.title}
                    </span>  
                )}
                <button onClick={() => deleteTask(task.id)}>Supprimer</button>
                </div> 
            ))}
                
                <div>
                {input ? (
                    <div>
                        <input placeholder="Nouvelle tâche"
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)} 
                        onKeyDown={(e) => e.key === "Enter" && addTask()}
                        />
                        <button onClick={addTask}>+ Ajouter la tâche</button>
                        <button onClick={() => { 
                            setInput(false); 
                            setNewTitle("")
                        }}>X</button>
                    </div>
                ) : (
                    <button onClick={() => setInput(true)}>
                        + nouvelle tâche
                    </button>
                )}
            </div>
        </div>
    );   
}
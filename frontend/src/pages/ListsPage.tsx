import { useEffect, useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

type List = {
    id: number;
    title: string;
}

export default function ListsPage() {
    const navigate = useNavigate();
    const [list, setList] = useState<List[]>([]);
    const [newTitle, setNewTitle] = useState("");
    const [input, setInput] = useState(false);
    const [edit, setEdit] = useState<number | null>(null);
    const [editTitle,setEditTitle] = useState("");

    const fetchLists = async () => {
        const res = await api.get("/lists");
            setList(res.data);
    };

    // ajouter une nouvelle liste
    const addList = async () => {
        if (!newTitle.trim()) return;
        await api.post("/lists", {title: newTitle});
        setNewTitle("");
        setInput(false);
        fetchLists();
    };

    // modifier le titre d'une liste
    const updateList = async (id: number) => {
        if (!editTitle.trim()) return;
        await api.put(`/lists/${id}`, {title: editTitle});
        setEdit(null);
        setEditTitle("")
        fetchLists();
    }

    // supprimer une liste
    const deleteList = async (id: number) => {
        await api.delete(`/lists/${id}`);
        fetchLists();
    }

    const openList = (listId: number) => {
        navigate(`/lists/${listId}`);
    };

    useEffect(() => {
        fetchLists();
    }, []);

return (
    <div>
        <h1>Mes Listes</h1>
        {list.map((lists) => (
            <div key={lists.id}>
                {edit === lists.id ? (
                    <>
                    <input 
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)} 
                    />
                    <button onClick={() => updateList(lists.id)}>V</button>
                    <button onClick={() => setEdit(null)}>X</button>
                    </>
                ) : (
                    <>
                        <h3
                        onClick={() => openList(lists.id)}>
                            {lists.title}
                        </h3>
                        <button onClick={() => { setEdit(lists.id); setEditTitle(lists.title)}}>Modifier</button>
                        <button onClick={() => deleteList(lists.id)}>Supprimer</button>
                    </>
                )}
            </div> 
        ))}
        {input ? (
            <div>
                <input placeholder="Nouvelle Liste"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)} />
                <button onClick={addList}>+ Ajouter à la liste</button>
                <button onClick={() => setInput(false)}>X</button>
            </div>
        ) : (
            <button onClick={() => setInput(true)}>+ Ajouter une autre liste</button>
        )}
    </div>
);
    
}
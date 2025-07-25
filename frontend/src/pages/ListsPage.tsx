import { useEffect, useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import "../style/listPage.css";
import icon from "../assets/icon.png";

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

    const date = new Date();
    const formatDate = `${date.getDate()} ${date.toLocaleString("default", {month:"long"})} ${date.getFullYear()}`;

    const couleurs = ["#FFC0C0", "#D5D9FF", "#f7f7a6ff", "#C4FFE7"];
    const getColorById = (id: number) => {
    return couleurs[id % couleurs.length];
};

return (
    <div className="lists-page">
        <div className="header-section">
            <div className="icon-container">
                <img src={icon} alt="App Icon" className="app-icon" />
            </div>
            <div className="title-date-container">
                <h1 className="title">Mes Listes</h1>
                <p className="date"> {formatDate}</p>
            </div>
        </div>
        <div className="section-list">
        {list.map((lists) => (
            <div 
            key={lists.id} 
            className="list-item"
            style={{ backgroundColor: getColorById(lists.id)}}
            >
                {edit === lists.id ? (
                    <div className="edit-container">
                        <input
                        className="edit-input" 
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)} 
                        />
                        <div className="edit-buttons">
                            <button className="btn-save" onClick={() => updateList(lists.id)}>V</button>
                            <button className="btn-cancel" onClick={() => setEdit(null)}>X</button>
                        </div>
                    </div>
                ) : (
                    <div>
                        <h3
                        className="list-title"
                        onClick={() => openList(lists.id)}>
                            {lists.title}
                        </h3>
                        <div className="section-edit-cancel">
                            <button className="btn-edit" onClick={() => { setEdit(lists.id); setEditTitle(lists.title)}}>Modifier</button>
                            <button className="btn-delete" onClick={() => deleteList(lists.id)}>Supprimer</button>
                        </div>
                    </div>
                )}
            </div> 
        ))}
        {input ? (
            <div className="add-list-form">
                <input 
                className="new-list-input"
                placeholder="Nouvelle Liste"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)} />
                <div className="add-cancel-section">
                    <button className="btn-add" onClick={addList}>+ Ajouter à la liste</button>
                    <button className="btn-cancel-x" onClick={() => setInput(false)}>X</button>
                </div>
            </div>
        ) : (
            <button className="btn-add-new" onClick={() => setInput(true)}>+ Ajouter une autre liste</button>
        )}
        </div>
    </div>
);
    
}
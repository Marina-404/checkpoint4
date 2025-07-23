import type { ResultSetHeader, RowDataPacket } from "mysql2";
import client from "../../database/db";

export type Task = {
  id: number;
  title: string;
  is_done: boolean,
  list_id: number
};

// récupere toutes les tâches par liste id
export async function getTasksByListId(listId: number): Promise<Task[]> {
    try {
    const [rows] = await client.query<RowDataPacket[]>(
        "SELECT * FROM tasks WHERE list_id = ?",
        [listId]
);
  return rows as Task[];
} catch (err) {
    throw new Error("impossible de récupérer les tâches")
}
}

// récupere toutes les tâches par l'id
export async function getTasksId(id: number): Promise<Task | undefined> {
    try {
    const [rows] = await client.query<RowDataPacket[]>(
        "SELECT * FROM tasks WHERE id = ?",
        [id]
);
  return rows.length > 0 ? (rows[0] as Task) : undefined;
} catch (err) {
    throw new Error("impossible de récupérer la tâche")
}
}

// creer une nouvelle tâche
export async function createTask(
  title: string,
  listId: number
): Promise<{ success:true; id?: number} | null> {
    try {
        const [result] = await client.query<ResultSetHeader>(
            "INSERT INTO tasks (title, list_id) VALUES (?, ?) ",
            [title, listId],
    );
    if (result.affectedRows > 0 && result.insertId) {
        return {
            success: true,
            id: result.insertId
        };
    }
    return null;
    } catch (err) {
        throw new Error("impossible de créer la tâche")
    }
}

// modifier une tâche
export async function updateTask(
  id: number,
  title: string,
  isDone: boolean
): Promise<boolean> {
    try { 
        const [result] = await client.query<ResultSetHeader>(
            "UPDATE tasks SET title = ?, is_done = ? WHERE id = ? ",
            [title, isDone, id],
    );
    return result.affectedRows > 0;
    } catch (err) {
        throw new Error("impossible de modifier les tâches")
    }
}
// supprimer une tâche
export async function deleteTask(
    id: number
): Promise<boolean> {
    try {
        const [result] = await client.query<ResultSetHeader>(
            "DELETE FROM tasks WHERE id = ?",
            [id],
        );
        return result.affectedRows > 0;
    } catch (err) {
        throw new Error("impossible de supprimer la tâche")
}
}

// modifier le statut d'une tache

export async function taskStatus(
    id: number, 
    isDone: boolean
): Promise<boolean> {
    try {
        const [result] = await client.query<ResultSetHeader>(
            "UPDATE tasks SET is_done = ? WHERE id = ?",
            [isDone, id],
        );
        return result.affectedRows > 0;
    } catch (err) {
        throw new Error("erreur lors de la modification du statut")
}
}
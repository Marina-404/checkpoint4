import type { ResultSetHeader, RowDataPacket } from "mysql2";
import client from "../../database/db";

export type List = {
  id: number;
  title: string;
};

export type ListWithTasks = {
  id: number;
  title: string;
  tasks: {
    id: number,
    title: string,
    is_done: boolean,
  }[];
};

// récupere toutes les listes
export async function getLists(): Promise<List[]> {
    try {
      const [rows] = await client.query<RowDataPacket[]>("SELECT * FROM lists");
      return rows as List[];
    } catch (err) {
        throw new Error("erreur lors de la récupération des listes");
    }
}

// récupere toutes les listes
export async function getListById(id: number): Promise<List | null> {
    try {
      const [rows] = await client.query<RowDataPacket[]>(
        "SELECT * FROM lists WHERE id = ?",
        [id]
);
  return rows.length > 0 ? (rows[0] as List) : null;
    } catch (err) {
        throw new Error("erreur lors de la récupération de la liste");
    }
}

export async function getListWithTasks(id:number): Promise<ListWithTasks | undefined> {
  try {
    const [rows] = await client.query<RowDataPacket[]>(
      `SELECT 
        l.id as list_id, 
        l.title as list_title, 
        t.id as task_id, 
        t.title as task_title, 
        t.is_done 
      FROM 
        lists l 
      LEFT JOIN 
        tasks t ON l.id = t.list_id 
      WHERE 
        l.id = ?`,
      [id]
    );
    if (!rows.length) return undefined;
    const list: ListWithTasks = {
      id: rows[0].list_id,
      title: rows[0].list_title,
      tasks: rows
        .filter(r => r.task_id !== null)
        .map(r => ({
          id: r.task_id,
          title:r.task_title,
          is_done: !!r.is_done
      })),
    }
    return list;
  } catch (err) {
    throw new Error("impossible de recuperer la liste avec ses tâches")
  }
}

// creer une nouvelle liste
export async function createList(
  title: string,
): Promise<{ success:boolean; id?: number}> {
  try {
    const [result] = await client.query<ResultSetHeader>(
      "INSERT INTO lists (title) VALUES (?) ",
      [title],
    );
    return {
        success: result.affectedRows > 0,
        id: result.insertId
    };
  } catch (err) {
    throw new Error("impossible de créer la liste");
  }
}

// modifier une liste
export async function updateList(
  id: number,
  title: string,
): Promise<boolean> {
  try {
    const [result] = await client.query<ResultSetHeader>(
      "UPDATE lists SET title = ? WHERE id = ? ",
      [title, id],
    );
    return result.affectedRows > 0;
  } catch (err) {
    throw new Error("impossible de modifier la liste");
  }
}

// supprimer une liste
export async function deleteList(
    id: number
): Promise<boolean> {
  try {
    const [result] = await client.query<ResultSetHeader>(
      "DELETE FROM lists WHERE id = ?",
      [id],
    );
    return result.affectedRows > 0;
  } catch (err) {
    throw new Error("erreur lors de la suppression de la liste");
  }
}
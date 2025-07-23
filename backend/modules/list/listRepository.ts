import type { ResultSetHeader, RowDataPacket } from "mysql2";
import client from "../../database/db";

export type List = {
  id: number;
  title: string;
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
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
        throw new Error("erreur lors de la récupération de la liste");
    }
}

// creer une nouvelle liste
export async function createList(
  title: string,
): Promise<boolean> {
  try {
    const [result] = await client.query<ResultSetHeader>(
      "INSERT INTO lists (title) VALUES (?) ",
      [title],
    );
    return result.affectedRows > 0;
  } catch (err) {
    throw new Error("erreur lors de la création de la liste");
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
    throw new Error("erreur lors de la modification de l'evenement");
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
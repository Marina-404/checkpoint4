import type { RequestHandler } from "express";
import {
  createList,
  getListById,
  deleteList,
  getLists,
  updateList,
  getListWithTasks
} from "./listRepository";

export const listsActions: {
  browse: RequestHandler;
  read: RequestHandler;
  add: RequestHandler;
  update: RequestHandler;
  remove: RequestHandler;
  readFull: RequestHandler;
} = {
  // on recupere les listes
  async browse(req, res) {
    try {
      const lists = await getLists();
      res.status(200).json(lists);
    } catch (err) {
      res
        .status(500)
        .json({ err: "erreur lors de la recuperation des lists" });
    }
  },

//   recuperer une liste par ID
  async read(req, res) {
    try {
        const listId = Number(req.params.id);
        if (isNaN (listId) || listId < 0 ) {
            return res.status(400).json({
                error:"ID de liste invalide"
            });
        }
      const list = await getListById(listId);
      if (!list) {
        return res.status(404).json({
            error: "Liste non trouvée"
        })
      }
      res.status(200).json(list);
    } catch (err) {
      res
        .status(500)
        .json({ err: "erreur lors de la recuperation des lists" });
    }
  },

  async readFull(req, res) {
    const listId = Number(req.params.id);
    if (!listId || listId < 0) {
      return res.status(400).json({errpr: "ID de liste invalide"})
    }
    try {
      const list = await getListWithTasks(listId);
      if (!list) {
        return res.status(404).json({error: "liste non trouvée"})
      }
      res.status(200).json(list)
    } catch {
      res.status(500).json({error: "erreur serveur"})
    }
  },

  // creer une nouvelle liste
  async add(req, res) {
    try {
      const { title } = req.body;

      // creer la liste dans la bdd
      const create = await createList(
        title.trim()
      );
      if (!create) {
        res
          .status(500)
          .json({ message: "erreur lors de la création de la liste" });
        return;
      }
      res.status(201).json({ message: "liste créée avec succès !", id: create.id });
    } catch {
      res
        .status(500)
        .json({ message: "erreur lors de la création de la liste" });
    }
  },

  // modifier une liste
  async update(req, res) {
    try {
      const listId = Number(req.params.id);
      const { title } = req.body;

      const updated = await updateList(
        Number(listId),
        title,
      );
      if (!updated) {
        res.status(404).json({ message: "liste non trouvée" });
        return;
      }
      res.status(200).json({ message: "liste modifiée avec succès" });
      return;
    } catch (err) {
      res.status(500).json({ message: "erreur lors de la mise a jour de la liste" });
      return;
    }
  },

  // supprimer une liste
  async remove(req, res) {
    try {
      const listId = Number(req.params.id);

      const deleted = await deleteList(Number(listId));
      if (!deleted) {
        res.status(404).json({ message: "liste non trouvée" });
        return;
      }
      res.status(200).json({ message: "liste supprimée avec succès" });
      return;
    } catch (err) {
      res.status(500).json({ message: "erreur lors de la suppression de la liste" });
      return;
    }
  },
}

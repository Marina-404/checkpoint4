import type { RequestHandler } from "express";
import {
  createList,
  deleteList,
  getLists,
  updateList,
} from "./listRepository";

export const listsActions: {
  browse: RequestHandler;
  add: RequestHandler;
  update: RequestHandler;
  remove: RequestHandler;
} = {
  // on recupere les listes
  async browse(req, res) {
    try {
      const lists = await getLists();
      res.status(200).json(lists);
      return;
    } catch (err) {
      res
        .status(500)
        .json({ err: "erreur lors de la recuperation des lists" });
      return;
    }
  },

  // creer une nouvelle liste
  async add(req, res) {
    try {
      const { title } = req.body;
      if (!title) {
        return res
          .status(400)
          .json({ message: "le titre de la liste est requis" });
      }

      // creer la liste dans la bdd
      const create = await createList(
        title
      );
      if (!create) {
        res
          .status(500)
          .json({ message: "erreur lors de la création de la liste" });
        return;
      }
      res.status(201).json({ message: "liste créée avec succès !" });
      return;
    } catch {
      res
        .status(500)
        .json({ message: "erreur lors de la création de l'événement" });
      return;
    }
  },

  // modifier une liste
  async update(req, res) {
    try {
      const listId = req.params.id;
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
      const listId = req.params.id;

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

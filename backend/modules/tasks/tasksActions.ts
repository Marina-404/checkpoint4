import type { RequestHandler } from "express";
import {
    getTasksByListId,
    getTasksId, 
    createTask,
    deleteTask,
    updateTask,
    taskStatus,
} from "./tasksRepository";

export const tasksActions: {
    browse: RequestHandler;
    read: RequestHandler;
    add: RequestHandler;
    update: RequestHandler;
    remove: RequestHandler;
    toggle: RequestHandler,
} = {
    
    // on recupere les taches d'une liste
    async browse(req, res) {
        try {
            const listId = Number(req.params.listId);
            if(isNaN(listId) || listId < 0) {
                return res.status(400).json({
                    error:"ID de la liste invalide"
                })
            }
            const tasks = await getTasksByListId(listId);
            res.status(200).json(tasks);
        } catch {
            res.status(500).json({error: "erreur lors de la récupération des tâches"})
        }
    },

    // on recupere une tâche par l'id
    async read(req, res) {
        try {
        const taskId = Number(req.params.id);
        if (isNaN(taskId) || taskId < 0) {
            return res.status(400).json({
                error: "ID de tâche invalide"
            });
        }
        const task = await getTasksId(taskId)
        if (!task) {
            return res.status(404).json({
                error: "tâche non trouvée"
            })
        }
        res.status(200).json(task);
        } catch (err) {
        res
            .status(500)
            .json({ err: "erreur lors de la recuperation de la tâche" });
        }
    },

    // creer une nouvelle tâche
    async add(req, res) {
        try {
        const { title, list_id } = req.body;
        if (!title || typeof title !== "string" || title.trim() === "") {
            return res.status(400).json({
                error: "le titre de la tâche est requis"
            })
        }
        if (!list_id || isNaN(Number(list_id)) || Number(list_id) < 0) {
            return res.status(400).json({
                error: "ID de la liste valide requis"
            });
        }      

        // creer la tâche dans la bdd
        const create = await createTask(
            title.trim(),
            Number(list_id)
        );
        if (!create) {
            res
            .status(500)
            .json({ message: "erreur lors de la création de la tâche" });
            return;
        }
        res.status(201).json({ message: "tâche créée avec succès !", id: create.id });
        } catch {
        res
            .status(500)
            .json({ message: "erreur lors de la création de la tâche" });
        }
    },

    // modifier une tâche
    async update(req, res) {
        try {
        const taskId = Number(req.params.id);
        const { title, is_done } = req.body;
        
        if (isNaN(taskId) || taskId < 0) {
            return res.status(400).json({
                error: "ID de tâche invalide"
            });
        }

        if (!title || typeof title !== "string" || title.trim() === "") {
            return res.status(400).json({
                error: "le titre de la tâche est requis"
            })
        }

        const updated = await updateTask(
            taskId,
            title.trim(),
            Boolean(is_done),
        );
        if (!updated) {
            res.status(404).json({ message: "tâche non trouvée" });
            return;
        }
        res.status(200).json({ message: "tâche modifiée avec succès" });
        } catch (err) {
        res.status(500).json({ message: "erreur lors de la mise a jour de la tâche" });
        }
    },

    // supprimer une tâche
    async remove(req, res) {
        try {
        const taskId = Number(req.params.id);
        
        if (isNaN(taskId) || taskId < 0) {
            return res.status(400).json({
                error: "ID de tâche invalide"
            });
        }
        const deleted = await deleteTask(Number(taskId));
        if (!deleted) {
            res.status(404).json({ message: "liste non trouvée" });
            return;
        }
        res.status(200).json({ message: "liste supprimée avec succès" });
        } catch (err) {
        res.status(500).json({ message: "erreur lors de la suppression de la liste" });
        }
    },
   

    // modifier le statut d'une tâche 
    async toggle(req, res) {
        try {
        const taskId = Number(req.params.id);
        
        if (isNaN(taskId) || taskId < 0) {
            return res.status(400).json({
                error: "ID de tâche invalide"
            });
        }
        // recupere la tâche
        const existingTask = await getTasksId(taskId);
        if (!existingTask) {
            return res.status(404).json({
                error: "tâche non trouvée"
            });
        }
        const newStatus = !existingTask.is_done;
        const updated = await taskStatus(taskId, newStatus);
        if (!updated) {
            return res.status(500).json({
                error: "error lors de la modification du statut"
            });
        }
        res.status(200).json({
            message:"statut de la tâche modifié avec succès",
            is_done: newStatus
        });
        } catch (err) {
            res.status(500).json({
                error:"error lors de la modification du statut"
            });
        }
    },
 }
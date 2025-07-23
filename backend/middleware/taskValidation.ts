import type { NextFunction, Request, Response } from "express";

// valider l'id de la tâche
export function valideTaskId(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const taskId = Number(req.params.id)
    if(isNaN(taskId) || taskId < 0) {
        return res.status(400).json({
            error: "ID de tâche invalide"
        });
    }
    next();
}

// valider l'id de la liste pour les tâches
export function valideListId(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const listId = Number(req.params.listId);
    if(isNaN(listId) || listId < 0) {
        return res.status(400).json({
            error: "ID de la liste invalide"
        });
    }
    next();
}

// valider les donner de creation et de modification
export function valideDataTask(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const { title, list_id } = req.body;
    if (!title || typeof title !== "string" || title.trim() === "") {
        return res.status(400).json({
            error: "le titre de la tâche est requis"
        });
    }
    if (list_id !== undefined && (isNaN(Number(list_id)) || Number(list_id) < 0 )) {
        return res.status(400).json({
            error: "ID de la liste invalide"
        });
    }
    next();
}
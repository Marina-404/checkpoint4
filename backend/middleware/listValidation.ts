import type { RequestHandler } from "express";
import type { NextFunction, Request, Response } from "express";

export const valideId: RequestHandler = (
    req: Request, 
    res: Response, 
    next: NextFunction
) => {
    const id = Number(req.params.id);
    if (isNaN(id) || id < 0) {
        return res.status(400).json({
            error: "ID invalide"
        });
    }
    (req as any).valideId = id;
    next();
}

// valider les données
export const valideList: RequestHandler = (
    req: Request, 
    res: Response, 
    next: NextFunction
) => {
    const { title } = req.body
    if (!title || typeof title !== "string") {
        return res.status(400).json({
            error: "le titre de la liste est requis"
        });
    }
    
    if (title.trim().length === 0) {
        return res.status(400).json({
            error: "le titre ne peut pas être vide"
        })
    }

    if (title.trim().length > 255) {
        return res.status(400).json({
            error: "le titre ne peut pas dépasser 255 caractères"
        })
    }
    req.body.title = title.trim()
    next();
};
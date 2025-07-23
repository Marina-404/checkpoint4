import express from "express";
import { listsActions } from "./modules/list/listActions";
const router = express.Router();

router.get("/lists", listsActions.browse);
router.post("/lists", listsActions.add);
router.put("/lists", listsActions.update);
router.delete("/lists", listsActions.remove);

export default router;


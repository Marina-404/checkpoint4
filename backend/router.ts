import express from "express";
import { listsActions } from "./modules/list/listActions";
import { valideId, valideList } from "./middleware/listValidation"
const router = express.Router();

router.get("/lists", listsActions.browse);
router.get("/lists/:id", valideId, listsActions.read)
router.post("/lists", listsActions.add);
router.put("/lists/:id",valideId, valideList, listsActions.update);
router.delete("/lists/:id", valideId, listsActions.remove);

export default router;


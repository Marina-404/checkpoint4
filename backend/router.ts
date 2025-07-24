import express from "express";
import { listsActions } from "./modules/list/listActions";
import { tasksActions } from "./modules/tasks/tasksActions";
import { valideId, valideList } from "./middleware/listValidation";
import { valideTaskId, valideListId, valideDataTask } from "./middleware/taskValidation";
const router = express.Router();

// les listes
router.get("/lists", listsActions.browse);
router.get("/lists/:id/full", valideId, listsActions.readFull);
router.get("/lists/:id", valideId, listsActions.read);
router.post("/lists", listsActions.add);
router.put("/lists/:id",valideId, valideList, listsActions.update);
router.delete("/lists/:id", valideId, listsActions.remove);

// les tâches
router.get("/lists/:listId/tasks", valideListId, tasksActions.browse);
router.get("/tasks/:id", valideTaskId, tasksActions.read);
router.post("/tasks", valideDataTask, tasksActions.add);
router.post("/tasks/:id", valideTaskId, valideDataTask, tasksActions.update);
router.patch("/tasks/:id/toggle", valideTaskId, tasksActions.toggle);
router.delete("/tasks/:id", valideTaskId, tasksActions.remove);

export default router;


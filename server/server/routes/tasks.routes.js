import { Router } from "express";
import {
    getTags,    
    createTag,
    addTask,
    getTasks,
    getTask,
    updateTask,
    removeTask,
    reorderList,
    getTasksDia,
    getTasksMes
} from "../controllers/tasks.controller";

const router = Router();

router.get("/tags", getTags);
router.post("/tags", createTag);
router.post("/", addTask);
router.get("/", getTasks);
router.get("/task/:id", getTask);
router.put("/:id", updateTask);
router.delete("/task/:id", removeTask);
router.post("/reorder", reorderList);
router.get("/dia", getTasksDia);
router.get("/mes", getTasksMes);

export default router;
import { Router } from "express";
import {
    addLabel,
    getLabels,
    updateLabel,
    removeLabel,
    createNote,
    getNotes,
    updateNote,
    removeNote,
    getNotesReminders,
    getNotesArchive,
    getNotesLabel,
    getNotesDia,
    getNotesMes
} from "../controllers/notes.controller";

const router = Router();

router.post("/labels", addLabel);
router.get("/labels/:usuario", getLabels);
router.put("/labels/:id", updateLabel);
router.delete("/labels/:id", removeLabel);
router.post("/", createNote);
router.get("/:usuario", getNotes);
router.put("/:id", updateNote);
router.delete("/:id", removeNote);
router.get("/reminders/:usuario", getNotesReminders);
router.get("/archive/:usuario", getNotesArchive);
router.get("/labels/:label/:usuario", getNotesLabel);
router.get("/dia/:usuario", getNotesDia);
router.get("/mes/:usuario", getNotesMes);

export default router;
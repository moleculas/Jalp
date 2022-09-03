import { Router } from "express";
import {
    addLabel,
    getLabels,
    updateLabel,
    removeLabel,
    getEvents,
    addEvent,
    updateEvent,
    removeEvent,
    getEventsDia,
    getEventsMes
} from "../controllers/calendar.controller";

const router = Router();

router.post("/labels", addLabel);
router.get("/labels/:usuario", getLabels);
router.put("/labels/:id", updateLabel);
router.delete("/labels/:id", removeLabel);
router.get("/events/:usuario", getEvents);
router.post("/events", addEvent);
router.put("/events/:id", updateEvent);
router.delete("/events/:id", removeEvent);
router.get("/events/dia/:usuario", getEventsDia);
router.get("/events/mes/:usuario", getEventsMes);

export default router;
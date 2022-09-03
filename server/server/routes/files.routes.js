import { Router } from "express";
import {
    addFileFile,
    addFileFolder,
    getFiles,
    updateFileFolder,
    updateFileFile,
    deleteFile
} from "../controllers/files.controller";
import middlewares from "../middlewares";

const router = Router();

router.post("/folder", addFileFolder);
router.post("/file", middlewares.verifyFileExistsFiles, addFileFile);
router.get("/:folderId", getFiles);
router.put("/folder/:id", updateFileFolder);
router.put("/file/:id", middlewares.verifyFileExistsFiles, updateFileFile);
router.delete("/:id", deleteFile);

export default router;
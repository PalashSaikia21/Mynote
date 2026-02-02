import express from "express";
import {
  SearchNote,
  postComments,
  deleteNote,
  updateNote,
  getComments,
  getLikes,
  reportNote,
  createNote,
  getAllNotes,
  getNote,
  deleteNotePermanently,
  restoreNote,
} from "../controllers/noteCotroller.mjs";
import {
  authentication,
  authorization,
} from "../controllers/authControllers.mjs";

const noteRouter = express.Router();

noteRouter.post(
  "/createNote/:userId",
  authentication,
  authorization,
  createNote
);

noteRouter.get("/SearchNote", SearchNote);

noteRouter.get("/getAllNotes/:userId", authentication, getAllNotes);

noteRouter.get("/getNote/:noteId", authentication, getNote);

noteRouter.get("/deleteNote/:noteId/:userId", deleteNote);

noteRouter.post("/updateNote/:noteId", updateNote);

noteRouter.post("/postComment/:noteId", authentication, postComments);

noteRouter.get("/getComment/:noteId", authentication, getComments);
noteRouter.get("/getLikes/:status/:id/:typeOn", authentication, getLikes);
noteRouter.post("/reportNote/:noteId", authentication, reportNote);
noteRouter.get(
  "/deleteNotePermanently/:noteId/:userId",
  authentication,
  deleteNotePermanently
);
noteRouter.get("/restoreNote/:noteId/:userId", authentication, restoreNote);

export default noteRouter;

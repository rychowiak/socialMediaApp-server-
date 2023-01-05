import express from "express";
import { getUser } from "../controllers/user.js";

const router = express.Router();

router.get("/find/:userId", getUser);
/* router.delete("/find/:id", (req, res) => {
  const userId = req.params.id;

  const q = "DELETE FROM users WHERE id = ?";
  db.query(q, [userId], (err, results) => {
    if (err) return res.send(err);
    return res.status(200).send("User has been deleted.");
  });
}); */

export default router;

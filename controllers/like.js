import { db } from "../connect.js";
import jwt from "jsonwebtoken";

export const getLikes = (req, res) => {
  const q = "SELECT userId FROM likes WHERE postId = ?";

  db.query(q, [req.query.postId], (error, data) => {
    if (error) return res.status(500).send(error);
    return res.status(200).send(data.map((like) => like.userId));
  });
};

export const addLike = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).send("Not logged in!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(500).send("Invalid Token.");

    const q = "INSERT INTO likes(`userId`, `postId`) VALUES (?)";
    const values = [userInfo.id, req.body.postId];

    db.query(q, [values], (error, data) => {
      if (error) return res.status(500).send(error.message);
      return res.status(200).send("Pos has been liked.");
    });
  });
};

export const deleteLike = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).send("Not logged in!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(500).send("Invalid Token.");

    const q = "DELETE FROM likes WHERE userId = ? AND postId = ?";

    db.query(q, [userInfo.id, req.query.postId], (error, data) => {
      if (error) return res.status(500).send(error.message);
      return res.status(200).send("Post has been disliked.");
    });
  });
};

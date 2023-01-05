import { db } from "../connect.js";
import jwt from "jsonwebtoken";

export const getRelationships = (req, res) => {
  const q = "SELECT followerUserId FROM relationships WHERE followedUserId = ?";

  db.query(q, [req.query.followedUserId], (error, data) => {
    if (error) return res.status(500).send(error);
    return res
      .status(200)
      .send(data.map((relationship) => relationship.followerUserId));
  });
};

export const addRelationship = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).send("Not logged in!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(500).send("Invalid Token.");

    const q =
      "INSERT INTO relationships(`followerUserId`, `followedUserId`) VALUES (?)";
    const values = [userInfo.id, req.body.userId];

    db.query(q, [values], (error, data) => {
      if (error) return res.status(500).send(error.message);
      return res.status(200).send("Following.");
    });
  });
};

export const deleteRelationship = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).send("Not logged in!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(500).send("Invalid Token.");

    const q =
      "DELETE FROM relationships WHERE followerUserId = ? AND followedUserId = ?";

    db.query(q, [userInfo.id, req.query.userId], (error, data) => {
      if (error) return res.status(500).send(error.message);
      return res.status(200).send("Unfollow");
    });
  });
};

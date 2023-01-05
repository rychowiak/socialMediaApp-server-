import { db } from "../connect.js";

export const getUser = (req, res) => {
  const userId = req.params.userId;

  const q = "SELECT * FROM users WHERE id = ?";

  db.query(q, [userId], (err, results) => {
    if (err) return res.status(500).send(err.message);

    const { password, ...data } = results[0];
    return res.status(200).send(data);
  });
};

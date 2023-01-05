import { db } from "../connect.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const register = (req, res) => {
  // check user if exist

  const q = "SELECT * FROM users WHERE email = ?";

  db.query(q, [req.body.email], (err, results) => {
    if (err) return res.status(500).send(err);
    if (results.length) return res.status(409).send("user already exists");

    // create new user
    // hash password
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(req.body.password, salt);

    const q = "INSERT INTO users (`email`, `password`) VALUES (?)";
    const values = [req.body.email, hashedPassword];

    db.query(q, [values], (err, results) => {
      if (err) return res.status(500).send(err);
      return res.status(200).send("User has been created");
    });
  });
};

export const login = (req, res) => {
  // CHECK IF EMAIL EXISTS
  const q = "SELECT * FROM users WHERE email = ?";
  db.query(q, [req.body.email], (err, results) => {
    if (err) res.status(500).send(err);
    if (results.length === 0)
      res.status(404).send("Email entered isn't connected to an account");

    const comparePassword = bcrypt.compareSync(
      req.body.password,
      results[0].password
    );
    if (!comparePassword) res.status(400).send("Wrong password or username");

    const token = jwt.sign({ id: results[0].id }, "secretkey");

    const { password, ...others } = results[0];

    res
      .cookie("accessToken", token, {
        httpOnly: true,
      })
      .status(200)
      .send(others);
  });
  // IF NO ERROR, CHECK FOR PASSWORD
};

export const logout = (req, res) => {
  res
    .clearCookie("accessToken", {
      secure: true,
      sameSite: "none",
    })
    .status(200)
    .send("User has been logged out.");
};

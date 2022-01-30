import {User} from "../entity/User";
import * as jwt from "jsonwebtoken";
import * as bcrypt from "bcrypt";

import  { RequestHandler } from "express";
//Handle Errors

//CREATE TOKEN
const maxAge = 24 * 60 * 60;
const createToken = (id: String) => {
  return jwt.sign({ id }, process.env.TOKEN_KEY as string, { expiresIn: maxAge });
};

export const signup_get: RequestHandler = (req, res) => {
  res.render("signup");
};
export const login_get: RequestHandler = (req, res) => {
  res.render("login");
};

//CREATE USER
export const signup_post: RequestHandler = async (req, res) => {
  const { email, password } = req.body;
  try {
    let user = new User()
    user.email=email
    user.password = password
    await User.save(user)
    const token = createToken(user.email);
    res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(201).json({ user: user.email });
  } catch (err) {
    res.status(400).send("hata oluştu");
  }
};

//LOGIN USER
export const login_post: RequestHandler = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    const isValid = await bcrypt.compare(password, user.password);
    if (isValid) {
      const token = createToken(user.email);
      res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
      res.status(200).json({ user: user.email });
    } else {
      res.status(401).redirect("/login");
    }
  } catch (error) {
    res.status(400).send("hata oluştu");
  }
};

export const logout_get: RequestHandler = (req, res) => {
  res.cookie("jwt", "", { maxAge: 1 });
  res.redirect("/");
};


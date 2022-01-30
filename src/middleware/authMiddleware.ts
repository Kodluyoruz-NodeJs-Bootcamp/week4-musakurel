import * as jwt from "jsonwebtoken";
import {User} from "../entity/User";
import { RequestHandler } from "express";

export const requireAuth: RequestHandler = (req, res, next) => {
  const token = req.cookies.jwt;

  // Check if the token exists
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.TOKEN_KEY as string);
      console.log(decoded);
      next();
    } catch (error) {
      console.log(error);
      res.redirect("login");
    }
  } else {
    res.redirect("/login");
  }
};


export const checkUser: RequestHandler = async (req, res, next) => {
  const token = req.cookies.jwt;
  if (token) {
    try {
      const decodedToken: any = jwt.verify(token, "MyJwtSecret");

      console.log(decodedToken);

      let user = await User.findOne(decodedToken.id);

      res.locals.user = user;
      next();
    } catch (error) {
      console.log(error);
      res.locals.user = null;
      next();
    }
  } else {
    res.locals.user = null;
    next();
  }
};

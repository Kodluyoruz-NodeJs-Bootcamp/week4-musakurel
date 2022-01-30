import "reflect-metadata";
import {createConnection} from "typeorm";
import {User} from "./entity/User";
import { requireAuth, checkUser } from "./middleware/authMiddleware";
import authRoutes from "./routes/authRoutes";
import * as express from "express";

createConnection().then(async connection => {
    const app = express();
    app.listen(3000, () => {
        console.log(`Server listening on port 3000`);
      })
    console.log("Inserting a new user into the database...");
/*     const user = new User();
    user.firstName = "Timbeer";
    user.lastName = "Slaew";
    user.age = 25;
    await User.save(user); */
    app.get("*", checkUser);
    app.get("/", (req, res) => res.render("home"));
    app.get(
      "/dashboard",
      requireAuth,
      async (req: express.Request, res: express.Response) => {
        try {
          const user = await User.find({});
          res.render("dashboard", { user });
        } catch (error) {
          console.log(error);
        }
      }
    );
    app.use(authRoutes);

}).catch(error => console.log(error));

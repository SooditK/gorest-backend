import "dotenv/config";
import cors from "cors";
import express from "express";
import { connectToDatabase } from "../db/db";
import { User, UserDocument, UserInput } from "../models/User.model";
import converter from "json-2-csv";
import fs from "fs";
import { promisify } from "util";

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "*",
  })
);

connectToDatabase();

app.get("/users", async (req, res) => {
  try {
    const users = await User.find();
    const count = await User.countDocuments();
    res.status(200).json({ count, users });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error", error });
  }
});

app.post("/users", async (req, res) => {
  const { name, email, gender, id, status } = req.body as UserInput;
  if (!name || !email || !gender || !id || !status) {
    return res.status(400).json({ message: "Missing required fields" });
  } else {
    try {
      const user = User.create(
        {
          name,
          email,
          gender,
          status,
          id,
        } as UserDocument,
        (err, user) => {
          if (err) {
            console.log(err);
          } else {
            console.log("User created");
          }
        }
      );
      res.status(201).json({ success: true, message: "User Created", user });
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({ success: false, message: "Internal server error", error });
    }
  }
});

app.get("/users/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findOne({
      id: parseInt(id),
    });
    if (user) {
      res.status(200).json({ success: true, message: "User Found", user });
    } else {
      res.status(404).json({ success: true, message: "User not found" });
    }
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ success: false, message: "Internal server error", error });
  }
});

app.patch("/users/:id", async (req, res) => {
  const { id } = req.params;
  const { name, email, gender, status } = req.body as UserInput;
  if (!name || !email || !gender || !id || !status) {
    return res.status(400).json({ message: "Missing required fields" });
  } else {
    try {
      const user = await User.findOneAndUpdate(
        {
          id: parseInt(id),
        },
        {
          name,
          email,
          gender,
          status,
        },
        {
          new: true,
        }
      );
      if (user) {
        res.status(200).json({ success: true, message: "User updated", user });
      } else {
        res.status(404).json({ success: false, message: "User not found" });
      }
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({ success: false, message: "Internal server error", error });
    }
  }
});

app.post("/getfile", async (req, res) => {
  try {
    const users = await User.find();
    const data = users.map((user) => {
      return {
        name: user.name,
        email: user.email,
        gender: user.gender,
        status: user.status,
        id: user.id,
      };
    });
    const csv = await converter.json2csvAsync(data);
    const writeFile = promisify(fs.writeFile);
    await writeFile("users.csv", csv);
    res.download("users.csv", (err) => {
      if (err) {
        console.log(err);
      } else {
        console.log("File sent");
        fs.unlink("users.csv", (err) => {
          if (err) {
            console.log(err);
          } else {
            console.log("File deleted");
          }
        });
      }
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ success: false, message: "Internal server error", error });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

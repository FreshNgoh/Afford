import express from "express";
import { User } from "../models/userModel.js";

const router = express.Router();

// Route for POST a new user
router.post("/", async (request, response) => {
  try {
    if (
      !request.body.name ||
      !request.body.email ||
      !request.body.password ||
      !request.body.contact
    ) {
      return response.status(400).send({
        message: "All the fileds is required.",
      });
    }
    const newUser = {
      name: request.body.name,
      email: request.body.email,
      password: request.body.password,
      contact: request.body.contact,
    };
    const data = await User.create(newUser);
    return response.status(201).send(data);
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});

// Route for GET ALL users
router.get("/", async (request, response) => {
  try {
    const users = await User.find();
    return response.status(200).json({
      count: users.length,
      data: users,
    });
  } catch (error) {
    console.error(error.message);
    response.status(500).send({ message: error.message });
  }
});

// Route for GET ONE user
router.get("/:id", async (request, response) => {
  const { id } = request.params;

  try {
    const users = await User.findById(id);
    return response.status(200).json({
      count: users.length,
      data: users,
    });
  } catch (error) {
    console.error(error.message);
    response.status(500).send({ message: error.message });
  }
});

//Route for UPDATE
router.patch("/:id", async (request, response) => {
  const { id } = request.params;
  const updateObject = request.body;

  try {
    const updateUser = await User.findByIdAndUpdate(
      id,
      { $set: updateObject },
      { new: true, runValidators: true }
    );

    if (!updateUser) {
      return response.status(404).json({ message: "User not found" });
    }

    return response
      .status(200)
      .send({ message: "Update successfully", user: updateUser });
  } catch (error) {
    console.error(error.message);
    return response.status(500).send({ message: error.message });
  }
});

//Route for DELETE
router.delete("/:id", async (request, response) => {
  const { id } = request.params;

  try {
    const result = await User.findOneAndDelete(id);

    if (!result) {
      return response.status(404).json({ message: "User not found" });
    }

    return response.status(200).send({ message: "User delete successfully" });
  } catch (error) {
    console.error(error.message);
    return response.status(500).send({ message: error.message });
  }
});

export default router;
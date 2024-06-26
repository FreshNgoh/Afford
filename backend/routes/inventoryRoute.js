import express from "express";
import { Inventory } from "../models/inventoryModel.js";
import { AppointmentService } from "../models/appService.js";

const router = express.Router();

// Route for POST a new user
router.post("/appService/:id", async (request, response) => {
  const { id } = request.params;

  try {
    if (!request.body.inventory) {
      return response.status(400).send({
        message: "All the fields are required.",
      });
    }

    // Insert to Inventoy Table
    const newInventory = new Inventory({
      inventory: request.body.inventory,
    });

    const inventoryData = await newInventory.save();

    // Get the ID of the newly create documents
    const newInventoryId = inventoryData._id;

    // Update to the AppointmentService Tabel
    const appServiceData = await AppointmentService.findByIdAndUpdate(
      id,
      { $set: { inventory: newInventoryId } },
      { new: true }
    );

    return response.status(201).send({
      inventoryData,
      updateAppointmentService: appServiceData,
    });
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});

// Route for GET ALL inventories
router.get("/", async (request, response) => {
  try {
    const inventories = await Inventory.find();

    return response.status(200).json({
      inventories,
    });
  } catch (error) {
    console.error(error.message);
    response.status(500).send({ message: error.message });
  }
});

// Route for GET ONE inventory
router.get("/:id", async (request, response) => {
  const { id } = request.params;

  try {
    const inventory = await Inventory.findById(id);
    if (!inventory) {
      return response.status(404).json({ message: "Iventory not found" });
    }
    return response.status(200).json({
      inventory,
    });
  } catch (error) {
    console.error(error.message);
    response.status(500).send({ message: error.message });
  }
});

// Route for UPDATE the inventory
router.put("/:id", async (request, response) => {
  const { id } = request.params;
  const { inventory } = request.body;

  try {
    // Find the inventory document by its ID
    const existingInventory = await Inventory.findById(id);
    if (!existingInventory) {
      return response.status(404).json({ message: "Inventory not found" });
    }

    // Update the inventory array
    existingInventory.inventory = inventory;

    // Save the updated inventory document
    const updatedInventory = await existingInventory.save();

    return response.status(200).send({
      inventory: updatedInventory,
    });
  } catch (error) {
    return response.status(500).send({ message: error.message });
  }
});

// Route for DELETE a inventory
router.delete("/:id", async (request, response) => {
  const { id } = request.params;

  try {
    const result = await Inventory.findByIdAndDelete(id);

    if (!result) {
      return response.status(404).json({ message: "Inventory not found" });
    }

    return response
      .status(200)
      .send({ message: "Inventory deleted successfully" });
  } catch (error) {
    console.error(error.message);
    return response.status(500).send({ message: error.message });
  }
});
export default router;

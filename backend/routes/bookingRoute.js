import express from "express";
import { Booking } from "../models/bookingModel.js";
import { Service } from "../models/serviceModel.js";
import { AppointmentService } from "../models/appService.js";

const router = express.Router();

// Route for POST a new user
router.post("/", async (request, response) => {
  try {
    if (
      !request.body.carPlate ||
      !request.body.carModel ||
      !request.body.time ||
      !request.body.date ||
      !request.body.mileage ||
      !request.body.serviceName ||
      !request.body.user
    ) {
      return response.status(400).send({
        message: "All the fields are required.",
      });
    }

    // Insert to Booking Table
    const newBooking = {
      carPlate: request.body.carPlate,
      carModel: request.body.carModel,
      remark: request.body.remark,
      time: request.body.time,
      date: request.body.date,
      status: request.body.status,
      mileage: request.body.mileage,
      user: request.body.user,
    };

    // Insert to Service Table
    const newService = {
      serviceName: request.body.serviceName,
    };

    const bookingData = await Booking.create(newBooking);
    const serviceData = await Service.create(newService);

    // Get the IDs of the newly created documents
    const newBookingId = bookingData._id;
    const newServiceId = serviceData._id;

    // Insert to AppointService Table
    const newAppointmentService = {
      booking: newBookingId,
      service: newServiceId,
    };

    const appServiceData = await AppointmentService.create(
      newAppointmentService
    );

    return response.status(201).send({
      booking: bookingData,
      service: serviceData,
      compositeData: appServiceData,
    });
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});

// Route for GET ALL bookings
router.get("/", async (request, response) => {
  try {
    const bookings = await Booking.find().populate("user").populate("admin");
    return response.status(200).json({
      count: bookings.length,
      data: bookings,
    });
  } catch (error) {
    console.error(error.message);
    response.status(500).send({ message: error.message });
  }
});

// Route for GET ONE booking
router.get("/:id", async (request, response) => {
  const { id } = request.params;

  try {
    const booking = await Booking.findById(id)
      .populate("user")
      .populate("admin");
    if (!booking) {
      return response.status(404).json({ message: "Booking not found" });
    }
    return response.status(200).json({
      data: booking,
    });
  } catch (error) {
    console.error(error.message);
    response.status(500).send({ message: error.message });
  }
});

// Route for UPDATE a booking
router.patch("/:id", async (request, response) => {
  const { id } = request.params;
  // const updateObject = request.body;

  try {
    const updateObject = {
      carPlate: request.body.carPlate,
      carModel: request.body.carModel,
      remark: request.body.remark,
      time: request.body.time,
      date: request.body.date,
      status: request.body.status,
      mileage: request.body.mileage,
      user: request.body.user,
      admin: request.body.admin,
    };

    const updatedBooking = await Booking.findByIdAndUpdate(
      id,
      { $set: updateObject },
      { new: true, runValidators: true }
    );

    if (!updatedBooking) {
      return response.status(404).json({ message: "Booking not found" });
    }

    return response
      .status(200)
      .send({ message: "Update successful", data: updatedBooking });
  } catch (error) {
    console.error(error.message);
    return response.status(500).send({ message: error.message });
  }
});

// Route for DELETE a booking
router.delete("/:id", async (request, response) => {
  const { id } = request.params;

  try {
    const result = await Booking.findByIdAndDelete(id);

    if (!result) {
      return response.status(404).json({ message: "Booking not found" });
    }

    return response
      .status(200)
      .send({ message: "Booking deleted successfully" });
  } catch (error) {
    console.error(error.message);
    return response.status(500).send({ message: error.message });
  }
});

export default router;

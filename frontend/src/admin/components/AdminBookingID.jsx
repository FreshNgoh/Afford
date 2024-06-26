import {
  Box,
  Callout,
  Card,
  Code,
  DataList,
  Flex,
  Heading,
  HoverCard,
  Link,
  Strong,
  Text,
} from "@radix-ui/themes";
import axios, { CanceledError } from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import AppointmentStatusBadge from "./AppointmentStatusBadge";
import BackButton from "./BackButton";
import DeleteButton from "./DeleteButton";
import EditButton from "./EditButton";

const AdminBookingID = () => {
  const { id } = useParams();
  const [appointment, setUser] = useState();
  const [error, setError] = useState();

  useEffect(() => {
    const controller = new AbortController();
    axios
      .get(`http://localhost:5500/appointmentService/${id}`, {
        signal: controller.signal,
      })
      .then((response) => {
        setUser(response.data.appService);
      })
      .catch((err) => {
        if (err instanceof CanceledError) return;
        setError(err.message);
      });

    return () => controller.abort();
  }, [id]);

  if (!appointment) {
    return (
      <Callout.Root color="red" className="mb-5">
        <Callout.Text>Appointment not found</Callout.Text>
      </Callout.Root>
    );
  }

  return (
    <>
      {error && (
        <Callout.Root color="red" className="mb-5">
          <Callout.Text>{error}</Callout.Text>
        </Callout.Root>
      )}
      <Box mt="8">
        <Card>
          <DataList.Root>
            <DataList.Item>
              <DataList.Label>Client Name</DataList.Label>
              <DataList.Value>
                <HoverCard.Root>
                  <HoverCard.Trigger>
                    <Link
                      href={`/admin/userManagement/${appointment.booking.user._id}`}
                      underline="always"
                    >
                      {appointment.booking.user.name}
                    </Link>
                  </HoverCard.Trigger>
                  <HoverCard.Content>
                    <Box>
                      <Heading size="3" as="h3">
                        {appointment.booking.user.name}
                      </Heading>
                      <Text as="div" size="2" color="gray" mb="2">
                        {appointment.booking.user._id}
                      </Text>
                      <Text as="div" size="2">
                        <Strong>Email:</Strong> {appointment.booking.user.email}
                      </Text>
                      <Text as="div" size="2">
                        <Strong>Contact:</Strong>{" "}
                        {appointment.booking.user.contact}{" "}
                      </Text>
                    </Box>
                  </HoverCard.Content>
                </HoverCard.Root>
              </DataList.Value>
            </DataList.Item>
            <DataList.Item>
              <DataList.Label>Appointment Status</DataList.Label>
              <DataList.Value>
                <AppointmentStatusBadge status={appointment.booking.status} />
              </DataList.Value>
            </DataList.Item>
            <DataList.Item>
              <DataList.Label>Date</DataList.Label>
              <DataList.Value>{appointment.booking.date}</DataList.Value>
            </DataList.Item>
            <DataList.Item>
              <DataList.Label>Time</DataList.Label>
              <DataList.Value>{appointment.booking.time}</DataList.Value>
            </DataList.Item>
            <DataList.Item>
              <DataList.Label>Car Model</DataList.Label>
              <DataList.Value>{appointment.booking.carModel}</DataList.Value>
            </DataList.Item>
            <DataList.Item>
              <DataList.Label>Car Plate</DataList.Label>
              <DataList.Value>{appointment.booking.carPlate}</DataList.Value>
            </DataList.Item>
            <DataList.Item>
              <DataList.Label>Car Mileage</DataList.Label>
              <DataList.Value>{appointment.booking.mileage}km</DataList.Value>
            </DataList.Item>
            <DataList.Item>
              <DataList.Label>Client's Remark</DataList.Label>
              <DataList.Value>{appointment.booking.remark}</DataList.Value>
            </DataList.Item>
            <DataList.Item>
              <DataList.Label>Servcices</DataList.Label>
              <DataList.Value>
                {appointment.service.serviceName.map((service, index) => (
                  <span key={index}>
                    <Code color="sky">{service}</Code>
                    {index < appointment.service.serviceName.length - 1 &&
                      ",\u00A0"}
                  </span>
                ))}
              </DataList.Value>
            </DataList.Item>
          </DataList.Root>
        </Card>
      </Box>
      <Flex gapX="3" mt="3">
        <EditButton
          href={`/admin/booking/edit/${appointment._id}`}
          target="Appointment"
        />
        <DeleteButton />
        <BackButton href={`/admin/booking`} />
      </Flex>
    </>
  );
};

export default AdminBookingID;

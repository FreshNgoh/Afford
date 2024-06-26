import {
  Callout,
  Card,
  Code,
  DataList,
  Flex,
  Progress,
} from "@radix-ui/themes";
import axios, { CanceledError } from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import BackButton from "../../admin/components/BackButton";
import InventoryButton from "./InventoryButton";
import ProgressButton from "./ProgressButton";
import ProgressState from "./ProgressState";

const MecAppointmentID = () => {
  const { id } = useParams();
  const [appointment, setAppointment] = useState();
  const [error, setError] = useState();

  useEffect(() => {
    const controller = new AbortController();
    axios
      .get(`${process.env.REACT_APP_BACKEND_URI}/appointmentService/${id}`, {
        signal: controller.signal,
      })
      .then((response) => {
        setAppointment(response.data.appService);
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
      <Card>
        <DataList.Root>
          <DataList.Item>
            <DataList.Label>Card Plate</DataList.Label>
            <DataList.Value>{appointment.booking.carPlate}</DataList.Value>
          </DataList.Item>
          <DataList.Item>
            <DataList.Label>Card Model</DataList.Label>
            <DataList.Value>{appointment.booking.carModel}</DataList.Value>
          </DataList.Item>
          <DataList.Item>
            <DataList.Label>Mileage</DataList.Label>
            <DataList.Value>{appointment.booking.mileage}</DataList.Value>
          </DataList.Item>
          <DataList.Item>
            <DataList.Label>Appointment Date</DataList.Label>
            <DataList.Value>{appointment.booking.date}</DataList.Value>
          </DataList.Item>
          <DataList.Item>
            <DataList.Label>Remark</DataList.Label>
            <DataList.Value>
              {appointment.booking.remark ? (
                appointment.booking.remark
              ) : (
                <span>No remarks by client</span>
              )}
            </DataList.Value>
          </DataList.Item>
          <DataList.Item>
            <DataList.Label>Services</DataList.Label>
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
          <DataList.Item>
            <DataList.Label>Progress</DataList.Label>
            <DataList.Value>
              <ProgressState progress={appointment.service.progress} />
            </DataList.Value>
          </DataList.Item>
          <DataList.Item>
            <DataList.Label>Car parts used</DataList.Label>
            <DataList.Value>
              {appointment.inventory &&
              appointment.inventory.inventory &&
              appointment.inventory.inventory.length > 0 ? (
                appointment.inventory.inventory.map((item, index) => (
                  <span key={index}>
                    <Code color="sky">{item.carPart}</Code>
                    {index < appointment.inventory.inventory.length - 1 &&
                      ",\u00A0"}
                  </span>
                ))
              ) : (
                <span>No add any Car Part yet.</span>
              )}
            </DataList.Value>
          </DataList.Item>
        </DataList.Root>
      </Card>
      <Flex direction={{ initial: "column", sm: "row" }} gap="3" mt="3">
        <ProgressButton
          route={`/mechanist/progress/${appointment.service._id}`}
        />
        <InventoryButton route={`/mechanist/inventory/${appointment._id}`} />
        <BackButton href={`/mechanist`} />
      </Flex>
    </>
  );
};

export default MecAppointmentID;

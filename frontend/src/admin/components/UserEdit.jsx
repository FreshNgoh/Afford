import {
  Box,
  Button,
  Callout,
  Flex,
  Spinner,
  TextField,
} from "@radix-ui/themes";
import axios, { CanceledError } from "axios";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";
import { FaEdit } from "react-icons/fa";
import { IoKeyOutline, IoPeople } from "react-icons/io5";
import { MdOutlineEmail, MdOutlinePhone } from "react-icons/md";
import { useParams } from "react-router";
import BackButton from "./BackButton";

const UserEdit = () => {
  const { id } = useParams();
  const [user, setUser] = useState([]);
  const [error, setError] = useState();
  const [isSubmitting, setSubmitting] = useState(false);
  const { register, handleSubmit, reset } = useForm();

  useEffect(() => {
    const controller = new AbortController();
    axios
      .get(`${process.env.REACT_APP_BACKEND_URI}/users/${id}`, {
        signal: controller.signal,
      })
      .then((response) => {
        setUser(response.data.user);
        reset(response.data.user); // Reset the form values with fetched data
      })
      .catch((err) => {
        if (err instanceof CanceledError) return;
        setError(err.message);
      });

    return () => controller.abort();
  }, [id, reset]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      setSubmitting(true);
      //update
      await axios.patch(
        `${process.env.REACT_APP_BACKEND_URI}/users/${id}`,
        data
      );

      toast.success("Update successfully");
      setError("");
    } catch (error) {
      setSubmitting(false);
      toast.error("Update unsuccessfully!");
      setError("An unexpected error occured.");
    }
    setSubmitting(false);
  });

  if (!user) {
    return (
      <Callout.Root color="red" className="mb-5">
        <Callout.Text>User not found</Callout.Text>
      </Callout.Root>
    );
  }
  return (
    <Box className="max-w-3xl">
      <Toaster />
      <form onSubmit={onSubmit}>
        <Flex direction="column" gapY="3" mt="8">
          {error && (
            <Callout.Root color="red" className="mb-5">
              <Callout.Text>{error}</Callout.Text>
            </Callout.Root>
          )}
          <TextField.Root
            placeholder="Name(IC)"
            defaultValue={user.name}
            radius="full"
            size="3"
            type="text"
            required
            className="w-full"
            {...register("name")}
          >
            <TextField.Slot>
              <IoPeople />
            </TextField.Slot>
          </TextField.Root>
          <TextField.Root
            placeholder="Email"
            defaultValue={user.email}
            radius="full"
            size="3"
            type="text"
            required
            className="w-full"
            {...register("email")}
          >
            <TextField.Slot>
              <MdOutlineEmail />
            </TextField.Slot>
          </TextField.Root>
          <TextField.Root
            placeholder="Contact"
            defaultValue={user.contact}
            radius="full"
            size="3"
            type="text"
            required
            className="w-full"
            {...register("contact")}
          >
            <TextField.Slot>
              <MdOutlinePhone />
            </TextField.Slot>
          </TextField.Root>
          <TextField.Root
            placeholder="Password"
            defaultValue={user.password}
            radius="full"
            size="3"
            type="text"
            required
            className="w-full"
            {...register("password")}
          >
            <TextField.Slot>
              <IoKeyOutline />
            </TextField.Slot>
          </TextField.Root>
          <Flex gapX="3">
            <Button color="violet" disabled={isSubmitting}>
              <FaEdit />
              Update
              {isSubmitting && <Spinner />}
            </Button>
            <BackButton href={`/admin/userManagement/${user._id}`} />
          </Flex>
        </Flex>
      </form>
    </Box>
  );
};

export default UserEdit;

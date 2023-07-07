import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";

interface Props {
  currentUserId: string;
  chatId: string;
}

type Inputs = {
  example: string;
};

export default function ChatInput({ currentUserId, chatId }: Props) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    fetch("/api/message/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: data.example,
        author: currentUserId,
        teamId: chatId,
      }),
    }).then((data) => {
      console.log(data);
      reset();
    });
  };

  return (
    <form
      className="sticky bottom-0 mx-3 flex  justify-end rounded-xl bg-gray-900 p-4 shadow-sm"
      onSubmit={handleSubmit(onSubmit)}
    >
      <input
        placeholder="Write a message"
        className="flex-[9] bg-gray-600 p-2"
        {...register("example")}
      />

      <button
        type="submit"
        className="flex-1 cursor-pointer bg-purple-700 p-2  text-white"
      >
        Send
      </button>
    </form>
  );
}

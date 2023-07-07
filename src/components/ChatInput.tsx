import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { AiOutlineSend } from "react-icons/ai";

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
    watch,
    formState: { errors },
  } = useForm<Inputs>();
  const [isInputEmpty, setIsInputEmpty] = React.useState(true);

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

  // check if the input is empty
  React.useEffect(() => {
    if (watch("example") === "") {
      setIsInputEmpty(true);
    } else {
      setIsInputEmpty(false);
    }
  }, [watch("example")]);

  return (
    <form
      className="sticky bottom-0 mx-3 flex justify-end rounded-xl p-4 shadow-sm"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="flex flex-[9]">
        <input
          placeholder="Write a message"
          className="mr-2 flex-[1] rounded-xl bg-gray-700 p-4 text-white focus:outline-purple-700"
          {...register("example")}
        />
        <button
          type="submit"
          className={`flex h-[3rem] w-[3rem] cursor-pointer items-center justify-center rounded-full text-white ${
            isInputEmpty ? "pointer-events-none bg-gray-400" : "bg-purple-700"
          }`}
          disabled={isInputEmpty} // Disable the button if the input is empty
        >
          <AiOutlineSend className="text-3xl" />
        </button>
      </div>
    </form>
  );
}

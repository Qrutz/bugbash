import { Transition } from "@headlessui/react";
import { useState } from "react";
import { RxCross1, RxPlus } from "react-icons/rx";
import { SubmitHandler, useForm } from "react-hook-form";

type NewColumnToggleProps = {
  onSubmit: (data: { title: string }) => void;
};

type FormValues = {
  title: string;
};

function NewColumnToggle({ onSubmit }: NewColumnToggleProps) {
  const [showInput, setShowInput] = useState(false);

  const { register, handleSubmit } = useForm<FormValues>();

  const handleSubmitAndHide: SubmitHandler<FormValues> = (data) => {
    onSubmit(data);
    setShowInput(false);
  };

  return (
    <div>
      <Transition
        show={!showInput}
        enter="transition-opacity duration-300"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="transition-opacity duration-300"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <button
          className="flex w-full items-center gap-2 rounded-lg  bg-neutral-900 p-3 text-center hover:bg-slate-500"
          onClick={() => setShowInput(true)}
        >
          <RxPlus className="ml-2 text-xl" />
          Add another list
        </button>
      </Transition>

      <Transition
        show={showInput}
        enter="transition ease-out duration-300"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-300"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <form
          className="flex flex-col bg-neutral-800 p-2"
          onSubmit={handleSubmit(handleSubmitAndHide)}
        >
          <input
            {...register("title", { required: true })}
            placeholder="Enter list title..."
            className="rounded-md border-gray-300 p-1 text-black shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 sm:text-sm"
          />
          <div className="flex items-center py-1 text-center">
            <button
              type="submit"
              className="rounded bg-blue-500 px-2 py-1 font-bold text-white hover:bg-blue-700"
            >
              Add list
            </button>
            <button
              type="submit"
              onClick={() => setShowInput(false)}
              className="ml-2 rounded  px-4 py-2 font-bold text-gray-700 hover:bg-gray-300"
            >
              <RxCross1 className="text-center text-white" />
            </button>
          </div>
        </form>
      </Transition>
    </div>
  );
}

export default NewColumnToggle;

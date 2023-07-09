import { SubmitHandler, useForm } from "react-hook-form";
import { api } from "~/utils/api";

const COLORS = [
  { name: "blue", color: "bg-blue-500" },
  { name: "yellow", color: "bg-yellow-500" },
  { name: "green", color: "bg-green-500" },
  { name: "red", color: "bg-red-500" },
  { name: "indigo", color: "bg-indigo-500" },
  { name: "purple", color: "bg-purple-500" },
  { name: "pink", color: "bg-pink-500" },
  { name: "gray", color: "bg-gray-500" },
  { name: "lime", color: "bg-lime-500" },
];

type LabelFormValues = {
  name: string;
  color: string;
};

export function LabelForm({ taskId }: { taskId: string }) {
  const ctx = api.useContext();

  const { register, handleSubmit, watch } = useForm<LabelFormValues>();

  const { mutate: addLabel } = api.kanbanRouter.addLabelToTask.useMutation({
    onSuccess: () => {
      void ctx.kanbanRouter.getColumns.invalidate();
    },
  });

  const handleLabelSubmit: SubmitHandler<LabelFormValues> = (data) => {
    addLabel({
      taskId: taskId,
      labelName: data.name,
      labelColor: data.color,
    });
  };

  return (
    <form onSubmit={handleSubmit(handleLabelSubmit)}>
      <div className="flex flex-col gap-2 p-2">
        <label htmlFor="name" className="text-md">
          Title
        </label>
        <input
          autoComplete="off"
          {...register("name")}
          type="text"
          className="border border-gray-900 p-1"
          placeholder="Label name..."
        />
      </div>
      <div className="flex flex-col gap-2 border-b p-2">
        <label htmlFor="color" className="text-md">
          Select a color
        </label>

        <div className="flex flex-wrap justify-evenly gap-2">
          {COLORS.map((color) => (
            <label
              key={color.name}
              className={`h-6 w-6 cursor-pointer rounded-full ${
                watch("color") === color.name ? "ring ring-purple-600 " : ""
              } ${color.color}`}
            >
              <input
                {...register("color")}
                type="radio"
                name="color"
                value={color.name}
                className="hidden"
              />
            </label>
          ))}
        </div>
      </div>

      <div className="p-2">
        <span className="items-center   p-2">
          <button
            type="submit"
            className="rounded-lg bg-purple-500 px-2 py-1 text-white hover:bg-purple-400"
          >
            Create
          </button>
        </span>
      </div>
    </form>
  );
}

import { Fragment } from "react";
import { Dialog, Menu, Transition } from "@headlessui/react";
import { useForm } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";
import { api } from "~/utils/api";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);
import { RxCross1 } from "react-icons/rx";
import React from "react";
import LabelDropdown from "./LabelDialog";
import AddCardMemberDropdown from "./addMemberDropdown";
import { useSession } from "next-auth/react";
import { BiTrash } from "react-icons/bi";

interface TaskDialogProps {
  isOpen: boolean;
  projectId: string;
  onClose: () => void;
  initialTaskName: string;
  initialTaskDescription: string;
  initialTaskLabels: {
    id: string;
    name: string;
    color: string;
  }[];
  taskID: string;
  taskAssignees?: {
    id: string;
    name: string;
    image: string | null;
  }[];
  comments?: {
    id: string;
    content: string;
    createdAt: Date;
    author: {
      id: string;
      name: string;
      image: string | null;
    };
  }[];
}

type FormValues = {
  name: string;
  description: string;
};

type CommentFormValues = {
  comment: string;
};

export const TaskDialog = ({
  isOpen,
  projectId,
  onClose,
  initialTaskName,
  initialTaskDescription,
  initialTaskLabels,
  taskAssignees,
  comments,
  taskID,
}: TaskDialogProps) => {
  const ctx = api.useContext();

  const { data: session, status: sessionstatus } = useSession();
  const { mutate: updateTask } = api.kanbanRouter.editTask.useMutation({
    onSuccess: () => {
      void ctx.kanbanRouter.getColumns.invalidate();
    },
  });

  const { mutate: addComment } = api.kanbanRouter.addCommentToTask.useMutation({
    onSuccess: () => {
      void ctx.kanbanRouter.getColumns.invalidate();
    },
  });

  const { mutate: deleteTask } = api.kanbanRouter.deleteCard.useMutation({
    onSuccess: () => {
      void ctx.kanbanRouter.getColumns.invalidate();
    },
  });

  const handleDeleteTask = () => {
    deleteTask({
      cardId: taskID,
    });
    onClose();
  };

  const { register, handleSubmit } = useForm<FormValues>();
  const onSubmit: SubmitHandler<FormValues> = (data: {
    name: string;
    description: string;
  }) => {
    updateTask({
      taskId: taskID,
      name: data.name,
      description: data.description,
    });
  };

  const {
    register: registerComment,
    handleSubmit: handleSubmitComment,
    resetField,
  } = useForm<CommentFormValues>();

  const onSubmitComment: SubmitHandler<CommentFormValues> = (data: {
    comment: string;
  }) => {
    addComment({
      taskId: taskID,
      content: data.comment,
      author: session?.user.id as string,
    });

    // clear input
    resetField("comment");
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <Transition
      show={isOpen}
      enter="transition duration-100 ease-out"
      enterFrom="transform scale-95 opacity-0"
      enterTo="transform scale-100 opacity-100"
      leave="transition duration-75 ease-out"
      leaveFrom="transform scale-100 opacity-100"
      leaveTo="transform scale-95 opacity-0"
      as={Fragment}
    >
      <Dialog
        as="div"
        className="z-10000 fixed inset-0 overflow-y-auto"
        onClose={onClose}
        // initialFocus={null} :: add later
      >
        <div className="flex min-h-screen items-center justify-center">
          <Dialog.Overlay className="z-3 fixed inset-0 bg-black opacity-30" />

          <div className="overflow-scroll-y z-0  w-[62.5%]  rounded-lg bg-white  p-4  text-black">
            <div className="flex items-center justify-between ">
              <h3 className=" text-lg font-bold">Edit Task</h3>
              <button className="mb-3 cursor-pointer rounded-full p-1 hover:bg-gray-200">
                <RxCross1 className="text-2xl" onClick={handleClose} />
              </button>
            </div>
            <section className="flex h-full gap-3 ">
              <div className=" flex-[9] space-y-4 py-3">
                <div className="flex flex-col gap-1">
                  <Menu>
                    <main className="flex gap-8">
                      <div className="">
                        {" "}
                        <h2 className="text-gray-600">Members</h2>
                        <div className="flex flex-wrap gap-1">
                          {taskAssignees?.map((assignee) => (
                            <div
                              key={assignee.id}
                              className="flex items-center"
                            >
                              <img
                                src={assignee.image || " "}
                                alt="user"
                                className="h-8 w-8  rounded-full"
                              />
                            </div>
                          ))}

                          <AddCardMemberDropdown
                            taskID={taskID}
                            projectId={projectId}
                            logoOnly={true}
                          />
                        </div>
                      </div>
                      <div className="">
                        <h2 className="text-gray-600">Labels</h2>
                        <div className="flex flex-wrap gap-1">
                          {initialTaskLabels.map((label) => (
                            <span
                              key={label.id}
                              className={`rounded-md bg-${label.color}-500 font-extralight text-white hover:bg-${label.color}-600 `}
                            >
                              <button className="p-1 text-sm ">
                                {" "}
                                {label.name}
                              </button>
                            </span>
                          ))}
                          <LabelDropdown
                            labels={initialTaskLabels}
                            taskId={taskID}
                            logoOnly={true}
                          />
                        </div>
                      </div>
                    </main>
                  </Menu>
                </div>

                <main className="">
                  <form
                    className="border-b border-gray-300"
                    onSubmit={handleSubmit(onSubmit)}
                  >
                    <div className="mb-4">
                      <label
                        htmlFor="name"
                        className="text-md mb-1 block font-semibold text-gray-700"
                      >
                        Title
                      </label>
                      <input
                        autoComplete="off"
                        placeholder="Task Name..."
                        className=" w-full rounded-md border  border-gray-900 p-1 text-sm shadow-sm      "
                        defaultValue={initialTaskName}
                        {...register("name", { required: false })}
                      />
                    </div>
                    <div className="mb-4">
                      <label
                        htmlFor="description"
                        className="mb-1 block text-lg  font-semibold  text-gray-700"
                      >
                        Description
                      </label>
                      <textarea
                        defaultValue={initialTaskDescription}
                        rows={2}
                        placeholder="Task Description..."
                        className="text-md w-full rounded-md   border border-neutral-800 px-1 shadow-sm   "
                        {...register("description", { required: false })}
                      ></textarea>
                    </div>

                    <div className="my-4 ">
                      <button
                        type="submit"
                        className="inline-flex justify-center rounded-md border border-transparent bg-purple-500 px-4 py-2 text-sm font-medium text-white shadow-sm focus:outline-none focus:ring-2  focus:ring-offset-2 hover:bg-purple-600"
                      >
                        Save Changes
                      </button>
                    </div>
                  </form>

                  <div className="flex flex-col gap-4 ">
                    <div className="mt-4 flex justify-between text-lg">
                      <h1 className="text-xl font-bold text-gray-800">
                        Comments{" "}
                      </h1>
                    </div>
                    <form
                      onSubmit={handleSubmitComment(onSubmitComment)}
                      className="flex w-full items-center space-x-2 border-b pb-4"
                    >
                      <img
                        src={session?.user.image || " "}
                        className="h-8 w-8 rounded-full bg-black"
                      />{" "}
                      <input
                        autoComplete="off"
                        {...registerComment("comment")}
                        placeholder="Write a comment..."
                        className=" w-full rounded-md border-2 p-1  text-lg shadow-lg focus:border-purple-500"
                      />
                      <button type="submit" className="hidden">
                        Submit
                      </button>
                    </form>

                    {comments?.map((comment) => (
                      <div
                        key={comment.id}
                        className="flex flex-col justify-center  gap-1 py-1"
                      >
                        <div className="flex items-center  gap-2">
                          <img
                            src={comment.author.image || " "}
                            alt="user"
                            className="h-8 w-8  rounded-full"
                          />
                          <div className="flex flex-col">
                            <h1 className="text-sm font-semibold">
                              {comment.author.name}
                            </h1>
                            <h1 className="text-xs text-gray-500">
                              {dayjs(comment.createdAt).fromNow()}
                            </h1>
                          </div>
                        </div>
                        <div className="flex flex-col gap-1">
                          <span
                            className=" border-1 w-full rounded-lg border   
        p-1 text-sm shadow-lg"
                          >
                            {comment.content}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </main>
              </div>

              <Menu>
                <nav className="h-full flex-[2] flex-col justify-between space-y-2 py-3 ">
                  <h1 className="text-gray-500">Add to card</h1>
                  <AddCardMemberDropdown
                    taskID={taskID}
                    projectId={projectId}
                  />
                  <LabelDropdown taskId={taskID} labels={initialTaskLabels} />

                  <div className="flex flex-col gap-2">
                    <h1 className="text-gray-500">Actions</h1>
                    <button
                      onClick={handleDeleteTask}
                      className="flex items-center gap-2 bg-red-500 py-2 text-sm font-semibold text-gray-100 hover:bg-red-600 "
                    >
                      <BiTrash className="h-5 w-5" />
                      Delete Task
                    </button>
                  </div>
                </nav>
              </Menu>
            </section>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

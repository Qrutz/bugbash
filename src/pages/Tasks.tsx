import { useSession } from "next-auth/react";
import { list } from "postcss";
import React from "react";
import { api } from "~/utils/api";

export default function Tasks() {
  const { data } = useSession();

  if (!data) return null;

  const { data: getUserTasks, status } = api.userRouter.getUserTasks.useQuery({
    userId: data.user.id,
  });

  if (status === "loading") return null;
  if (!data || !getUserTasks) return null;

  const totalTasks = getUserTasks.reduce((acc, list) => {
    return acc + list.cards.length;
  }, 0);

  return (
    <>
      <section className="flex-[9]">
        <div className="flex items-center gap-2 p-5">
          <h1 className="text-3xl font-bold">Total active tasks: </h1>
          <h2 className="rounded-full bg-amber-500 px-2 text-3xl font-semibold text-black">
            {totalTasks}
          </h2>
        </div>
        <main className="flex flex-col ">
          {getUserTasks.map((list) => {
            return (
              <div className="flex flex-col   ">
                <div className="border-1 flex items-center justify-between bg-gray-800 px-4  py-4 text-sm shadow shadow-gray-950  ">
                  <span className="flex gap-2 ">
                    <h2 className="text-xl font-bold">{list.name} </h2>
                    <p className=" rounded-full bg-purple-500 px-2 text-xl  font-bold text-white ">
                      {" "}
                      {list.cards.length}{" "}
                    </p>
                  </span>
                </div>

                <div className="flex flex-col gap-1 ">
                  {list.cards.map((task) => {
                    return (
                      <div className="flex items-center justify-between bg-gray-900 px-4   py-2    ">
                        <span className="">{task.name} </span>

                        <span className="flex gap-2 ">
                          {task.labels.map((label) => {
                            return (
                              <span
                                className={`bg-${label.color}-500 rounded-lg px-2`}
                              >
                                {label.name}
                              </span>
                            );
                          })}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </main>
      </section>
    </>
  );
}

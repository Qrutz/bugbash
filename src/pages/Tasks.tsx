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

  return (
    <>
      <section className="flex-[9]">
        <div className="items-center p-4">
          <h1 className="text-2xl font-bold">My tasks</h1>
        </div>
        {getUserTasks.map((list) => {
          return (
            <div className="flex flex-col">
              <div className="flex items-center justify-between bg-gray-800 px-4 py-2 text-sm ">
                <span className="">
                  {list.name} {list.cards.length}
                </span>

                <span className="">+</span>
              </div>

              {list.cards.map((task) => {
                return (
                  <div className="flex items-center justify-between bg-gray-900 px-4 py-3 ">
                    <span className="">{task.name} </span>

                    <span className="">+</span>
                  </div>
                );
              })}
            </div>
          );
        })}
      </section>
    </>
  );
}

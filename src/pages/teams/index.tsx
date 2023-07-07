import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import Layout from "~/components/layout";
import { api } from "~/utils/api";

export default function Tasks() {
  const router = useRouter();
  const { data: session, status: sessionStatus } = useSession();
  const { data: teams, status } =
    api.projectRouter.getMembersOfAllProjects.useQuery({
      userId: session?.user.id as string,
    });

  if (status === "loading") return null;
  if (!session) return null;

  return (
    <>
      <h1 className="flex-[9]">
        {teams?.map((team) => {
          return (
            <Link href={`/teams/${team.id}`} className="flex flex-col gap-1 ">
              <div className="flex items-center justify-between bg-gray-900 px-4   py-2    ">
                <span className="">{team.name} </span>
                {team.members.map((member) => {
                  return (
                    <div
                      className="-ml-2 rounded-full border border-gray-800"
                      key={member.id}
                    >
                      <img
                        className="h-11 w-11 rounded-full"
                        src={member.image || undefined}
                        alt=""
                      />
                    </div>
                  );
                })}
              </div>
            </Link>
          );
        })}
      </h1>
    </>
  );
}

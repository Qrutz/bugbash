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
      <div className="flex flex-col px-6 py-8">
        <h2 className="text-2xl font-semibold">Chatrooms</h2>
        <main className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 sm:p-8 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {teams?.map((team) => {
            return (
              <Link
                href={`/teams/${team.id}`}
                className="flex flex-col items-center gap-4 rounded-sm bg-gray-800 px-2 py-4"
                key={team.id}
              >
                <span className="text-2xl font-semibold">{team.name}</span>
                <div className="flex gap-2">
                  {team.members.map((member) => {
                    return (
                      <div
                        className="-ml-1 rounded-full border border-gray-800"
                        key={member.id}
                      >
                        <img
                          className="h-8 w-8 rounded-full"
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
        </main>
      </div>
    </>
  );
}

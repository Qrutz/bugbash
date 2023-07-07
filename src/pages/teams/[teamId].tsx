import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import ChatInput from "~/components/ChatInput";
import Messages, { Message } from "~/components/Messages";
import Layout from "~/components/layout";
import { db } from "~/lib/db";
import { fetchRedis } from "~/lib/redis";
import { api } from "~/utils/api";

export default function Tasks() {
  const router = useRouter();
  const { teamId } = router.query as { teamId: string };
  const { data: session, status: sessionStatus } = useSession();
  const { data: teams, status } =
    api.projectRouter.getMembersOfProject.useQuery({
      projectId: teamId,
    });

  const { data: messages, status: messagesStatus } = useQuery({
    queryKey: ["messages", teamId],
    queryFn: async () => {
      const messages = await fetchRedis("zrange", `chatroom:${teamId}`, 0, -1);

      return messages.map((message: string) => JSON.parse(message) as Message);
    },
  });

  if (status === "loading") return null;
  if (messagesStatus === "loading") return null;
  if (!session) return null;

  console.log("messages", messages);

  async function sendMessage() {
    const message = "Hello World!";

    const response = await fetch("/api/message/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: message,
        author: session?.user.id as string,
        teamId: teamId,
      }),
    });

    const data = await response.json();
    console.log(data);
  }

  return (
    <div className="flex h-screen   flex-col gap-4        ">
      <div className="sticky top-0 z-[400] flex w-full flex-col space-y-4 border-b  border-gray-700 bg-gray-900 p-4">
        {" "}
        <h2 className="text-2xl font-semibold"> {teams?.name} General</h2>
        <div className="flex gap-2">
          {teams?.members.map((member) => {
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
      </div>

      <Messages
        intialMessages={messages}
        chatId={teamId}
        participants={teams?.members}
      />

      <ChatInput currentUserId={session?.user.id as string} chatId={teamId} />
    </div>
  );
}

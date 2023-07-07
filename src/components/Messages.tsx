import { User } from "@prisma/client";
import dayjs from "dayjs";
import { useSession } from "next-auth/react";
import React, { useEffect, useRef } from "react";
import { pusherClient } from "~/lib/pusher";
import { toPusherKey } from "~/lib/utils";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

export interface Message {
  id: string;
  text: string;
  createdBy: string;
  createdAt: number;
}

interface Props {
  intialMessages: Message[];
  chatId: string;
  participants:
    | {
        id: string;
        name: string;
        image: string | null;
      }[]
    | undefined;
}

export default function Messages({
  intialMessages,
  participants,
  chatId,
}: Props) {
  const { data: session } = useSession();
  const [messages, setMessages] = React.useState<Message[]>(intialMessages);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    console.log("chatId", chatId);

    // fetchOrgMessages();
    pusherClient.subscribe(toPusherKey(`chatroom:${chatId}`));

    const messageHandler = (data: Message) => {
      setMessages((messages) => [...messages, data]);
    };

    pusherClient.bind("message", messageHandler);

    return () => {
      pusherClient.unsubscribe(toPusherKey(`chatroom:${chatId}`));
      pusherClient.unbind("message", messageHandler);
    };
  }, [chatId]);

  useEffect(() => {
    // Scroll to the bottom of the messages container when new messages are added
    messagesContainerRef.current?.scrollTo({
      top: messagesContainerRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  return (
    <div ref={messagesContainerRef} className="overflow-auto scrollbar-thin ">
      <div className=" flex flex-1 flex-col  gap-4  p-4">
        {messages.map((message) => {
          const isAuthor = message.createdBy === session?.user.id;

          if (!isAuthor) {
            const authorData = participants?.find(
              (participant) => participant.id === message.createdBy
            );
            return (
              <span key={message.id} className="flex items-end gap-3">
                <img
                  className="h-10 w-10 rounded-full"
                  src={authorData?.image || undefined}
                  alt=""
                />
                <div className="flex flex-col gap-1">
                  <p className="flex gap-2 text-sm text-gray-600">
                    <h1>{authorData?.name}</h1>
                    <h1>{dayjs(message.createdAt).fromNow()}</h1>
                  </p>

                  <div className="rounded-lg bg-gray-800 p-2">
                    {message.text}
                  </div>
                </div>
              </span>
            );
          } else {
            return (
              <span
                key={message.id}
                className="flex items-end justify-end gap-3"
              >
                <div className="flex flex-col gap-1">
                  <p className="flex gap-2 text-sm text-gray-600">
                    <h1>You</h1>
                    <h1>{dayjs(message.createdAt).fromNow()}</h1>
                  </p>

                  <div className="rounded-lg bg-green-800 p-2">
                    {message.text}
                  </div>
                </div>
                <img
                  className="h-9 w-9 rounded-full"
                  src={session?.user.image || undefined}
                  alt=""
                />
              </span>
            );
          }
        })}
      </div>
    </div>
  );
}

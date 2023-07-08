/* eslint-disable */

import { nanoid } from "nanoid";
import { db } from "../../.././lib/db";
import { pusherServer } from "../../.././lib/pusher";
import { toPusherKey } from "../../.././lib/utils";
import { NextRequest, NextResponse } from "next/server";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { text, author, teamId } = req.body;
    const createdAt = Date.now();

    const chatroomKey = `chatroom:${teamId}`;

    const messageObject = {
      id: nanoid(),
      text,
      createdBy: author,
      createdAt,
    };

    const messageString = JSON.stringify(messageObject);

    pusherServer.trigger(
      toPusherKey(`chatroom:${teamId}`),
      "message",
      messageObject
    );

    await db.zadd(chatroomKey, {
      score: createdAt,
      member: messageString,
    });

    res.status(200).json({ message: "Message sent" });
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}

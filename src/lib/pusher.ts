import PusherServer from "pusher";
import PusherClient from "pusher-js";

export const pusherServer = new PusherServer({
  appId: process.env.NEXT_PUBLIC_APP_PUSHER_ID!,
  key: process.env.NEXT_PUBLIC_APP_PUSHER_KEY!,
  secret: process.env.NEXT_PUBLIC_APP_PUSHER_SECRET!,
  cluster: "eu",
});

export const pusherClient = new PusherClient(
  process.env.NEXT_PUBLIC_APP_PUSHER_KEY!,
  {
    cluster: "eu",
  }
);

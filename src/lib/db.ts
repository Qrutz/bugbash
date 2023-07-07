import { Redis } from "@upstash/redis";

export const db = new Redis({
  token:
    "AZXCACQgYzQ3ZDk0ZjktMjhiMy00MTI0LTkxZWMtNDRhMGY0MjQ2NzRhMjIzZjE2YzA0OTVhNGIwYjg1NzY1ODA5NzMxODdhMGM=",
  url: "https://eu1-vast-weasel-38338.upstash.io",
});

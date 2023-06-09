import { createTRPCRouter } from "~/server/api/trpc";
import { ProjectRouter } from "~/server/api/routers/ProjectRouter";
import { KanbanRouter } from "./routers/KanbanRouter";
import { UserRouter } from "./routers/UserRouter";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  projectRouter: ProjectRouter,
  kanbanRouter: KanbanRouter,
  userRouter: UserRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

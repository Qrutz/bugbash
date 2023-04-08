import { TRPCError } from "@trpc/server";
import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";

export const ProjectRouter = createTRPCRouter({
  getProjects: protectedProcedure
    .input(z.object({ userId: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.project.findMany({
        where: {
          members: {
            some: {
              id: input.userId,
            },
          },
        },
      });
    }),

  getProject: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.project.findUnique({
        where: {
          id: input.id,
        },
        include: {
          members: {
            include: {
              sessions: true,
            },
          },
        },
      });
    }),

  addMemberToProject: protectedProcedure
    .input(z.object({ projectId: z.string(), userId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const project = await ctx.prisma.project.findUnique({
        where: {
          id: input.projectId,
        },
      });

      if (!project) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      const user = await ctx.prisma.user.findUnique({
        where: {
          id: input.userId,
        },
      });

      if (!user) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      return ctx.prisma.project.update({
        where: {
          id: input.projectId,
        },
        data: {
          members: {
            connect: {
              id: input.userId,
            },
          },
        },
      });
    }),

  getProjectKanban: protectedProcedure
    .input(z.object({ projectId: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.prisma.kanbanBoard.findMany({
        where: {
          projectId: input.projectId,
        },
        // only return column names, ids. and for the cards, only return the name and id
        include: {
          columns: {
            select: {
              id: true,
              name: true,
              cards: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
        },
      });
    }),

  getColumnsOfKanban: protectedProcedure
    .input(z.object({ kanbanBoardId: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.prisma.column.findMany({
        where: {
          kanbanBoardId: input.kanbanBoardId,
        },
        // only return column names, ids. and for the cards, only return the name and id
        include: {
          cards: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });
    }),

  moveTask: protectedProcedure
    .input(
      z.object({
        sourceColumnId: z.string(),
        destinationColumnId: z.string(),
        taskId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.card.update({
        where: {
          id: input.taskId,
        },
        data: {
          columnId: input.destinationColumnId,
        },
      });
    }),

  createTask: protectedProcedure
    .input(
      z.object({
        projectId: z.string(),
        columnId: z.string(),
        name: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.card.create({
        data: {
          name: input.name,
          columnId: input.columnId,
        },
      });
    }),

  createColumn: protectedProcedure
    .input(
      z.object({
        kanbanBoardId: z.string(),
        name: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.column.create({
        data: {
          name: input.name,
          kanbanBoardId: input.kanbanBoardId,
        },
      });
    }),

  editTaskDescription: protectedProcedure
    .input(
      z.object({
        taskId: z.string(),
        description: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.card.update({
        where: {
          id: input.taskId,
        },
        data: {
          description: input.description,
        },
      });
    }),
});

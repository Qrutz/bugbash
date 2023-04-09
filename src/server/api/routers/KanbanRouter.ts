import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const KanbanRouter = createTRPCRouter({
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

  getColumns: protectedProcedure
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

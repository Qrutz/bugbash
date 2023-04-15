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
              description: true,
              labels: true,
              assignees: true,
              // return id, content, cardid, and the author of the comment
              comments: {
                select: {
                  id: true,
                  content: true,
                  cardId: true,
                  createdAt: true,
                  author: {
                    select: {
                      id: true,
                      name: true,
                      image: true,
                    },
                  },
                },
              },
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

  editTask: protectedProcedure
    .input(
      z.object({
        taskId: z.string(),
        name: z.string(),
        description: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.card.update({
        where: {
          id: input.taskId,
        },
        data: {
          name: input.name,
          description: input.description,
        },
      });
    }),

  addLabelToTask: protectedProcedure
    .input(
      z.object({
        taskId: z.string(),
        labelName: z.string(),
        labelColor: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.card.update({
        where: {
          id: input.taskId,
        },
        data: {
          labels: {
            create: {
              name: input.labelName,
              color: input.labelColor,
            },
          },
        },
      });
    }),

  removeLabelFromTask: protectedProcedure
    .input(
      z.object({
        taskId: z.string(),
        labelId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.card.update({
        where: {
          id: input.taskId,
        },
        data: {
          labels: {
            delete: {
              id: input.labelId,
            },
          },
        },
      });
    }),

  changeColumnName: protectedProcedure
    .input(
      z.object({
        columnId: z.string(),
        name: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.column.update({
        where: {
          id: input.columnId,
        },
        data: {
          name: input.name,
        },
      });
    }),

  deleteColumn: protectedProcedure
    .input(
      z.object({
        columnId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.column.delete({
        where: {
          id: input.columnId,
        },
      });
    }),

  //query all members of project and all members assigned to a task, return true beside the member if they are assigned to the task
  getMembers: protectedProcedure
    .input(
      z.object({
        projectId: z.string(),
        taskId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const members = await ctx.prisma.project
        .findUnique({
          where: {
            id: input.projectId,
          },
        })
        .members();

      const taskMembers = await ctx.prisma.card
        .findUnique({
          where: {
            id: input.taskId,
          },
        })
        .assignees();

      const taskMemberIds = taskMembers?.map((member) => member.id);

      return members?.map((member) => ({
        ...member,
        assigned: taskMemberIds?.includes(member.id),
      }));
    }),

  assignMemberToTask: protectedProcedure
    .input(
      z.object({
        taskId: z.string(),
        memberId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.card.update({
        where: {
          id: input.taskId,
        },
        data: {
          assignees: {
            connect: {
              id: input.memberId,
            },
          },
        },
      });
    }),

  unassignMemberFromTask: protectedProcedure
    .input(
      z.object({
        taskId: z.string(),
        memberId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.card.update({
        where: {
          id: input.taskId,
        },
        data: {
          assignees: {
            disconnect: {
              id: input.memberId,
            },
          },
        },
      });
    }),

  addCommentToTask: protectedProcedure
    .input(
      z.object({
        taskId: z.string(),
        content: z.string(),
        author: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.comment.create({
        data: {
          content: input.content,
          cardId: input.taskId,
          authorId: input.author,
        },
      });
    }),
});

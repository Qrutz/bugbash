import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const ProjectRouter = createTRPCRouter({
  getAll: protectedProcedure
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
      // only return the project if a user is a member of it, return the members together with the name and kanban code
      return ctx.prisma.project.findUnique({
        where: {
          id: input.id,
        },
        include: {
          members: true,
          kanbanBoard: {
            select: {
              id: true,
            },
          },
        },
      });
    }),

  addMemberToProject: protectedProcedure
    .input(z.object({ projectId: z.string(), name: z.string() }))
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
          name: input.name,
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
              name: input.name,
            },
          },
        },
      });
    }),

  removeMemberFromProject: protectedProcedure
    .input(z.object({ projectId: z.string(), name: z.string() }))
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
          name: input.name,
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
            disconnect: {
              name: input.name,
            },
          },
        },
      });
    }),

  createProject: protectedProcedure
    .input(z.object({ name: z.string(), userId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // create a new project with an empty kanban board
      const project = await ctx.prisma.project.create({
        data: {
          name: input.name,
          members: {
            connect: {
              id: input.userId,
            },
          },
          kanbanBoard: {
            create: {},
          },
        },
      });

      return project;
    }),

  deleteProject: protectedProcedure
    .input(z.object({ id: z.string(), userId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // check if user that is trying to delete its name is "qrutz"
      const user = await ctx.prisma.user.findUnique({
        where: {
          id: input.userId,
        },
      });

      if (user?.name !== "Qrutz") {
        throw new TRPCError({ code: "FORBIDDEN" });
      }

      const project = await ctx.prisma.project.delete({
        where: {
          id: input.id,
        },
      });

      return project;
    }),
});

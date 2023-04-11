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
});

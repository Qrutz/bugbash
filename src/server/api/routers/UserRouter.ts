import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const UserRouter = createTRPCRouter({
  getUserTasks: protectedProcedure
    .input(z.object({ userId: z.string() }))
    .query(({ ctx, input }) => {
      // look through all columns, and return the cards that have the user as an assignee
      return ctx.prisma.column.findMany({
        where: {
          cards: {
            some: {
              assignees: {
                some: {
                  id: input.userId,
                },
              },
            },
          },
        },
        include: {
          cards: {
            select: {
              id: true,
              name: true,
              description: true,
              labels: true,
            },
          },
        },
      });
    }),
});

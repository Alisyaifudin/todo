import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";

export const taskRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ctx}) => {
    const tasks = await ctx.prisma.task.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
    return tasks;
  }),
  done: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        done: z.boolean(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const updated = await ctx.prisma.task.update({
        where: { id: input.id },
        data: { completed: input.done },
      });
      return updated;
    }),
  delete: protectedProcedure.input(z.string()).mutation(async ({ input, ctx }) => {
    const deleted = await ctx.prisma.task.delete({
      where: { id: input },
    });
    return deleted;
  }),
  create: protectedProcedure
    .input(
      z.object({
        title: z.string(),
        description: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const created = await ctx.prisma.task.create({
        data: {
          title: input.title,
          description: input.description,
        },
      });
      return created;
    }),
  edit: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string(),
        description: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const edited = await ctx.prisma.task.update({
        where: { id: input.id },
        data: {
          title: input.title,
          description: input.description,
        },
      });
      return edited;
    }),
});

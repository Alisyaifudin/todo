import { z } from "zod";
import { prisma } from "~/server/db";
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";

export const taskRouter = createTRPCRouter({
  getAll: publicProcedure.query(async () => {
    const tasks = await prisma.task.findMany({
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
    .mutation(async ({ input }) => {
      const updated = await prisma.task.update({
        where: { id: input.id },
        data: { completed: input.done },
      });
      return updated;
    }),
  delete: protectedProcedure.input(z.string()).mutation(async ({ input }) => {
    const deleted = await prisma.task.delete({
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
    .mutation(async ({ input }) => {
      const created = await prisma.task.create({
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
    .mutation(async ({ input }) => {
      const edited = await prisma.task.update({
        where: { id: input.id },
        data: {
          title: input.title,
          description: input.description,
        },
      });
      return edited;
    }),
});

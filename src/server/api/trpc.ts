import { type CreateNextContextOptions } from "@trpc/server/adapters/next";
// import { prisma } from "~/server/db";
import { TRPCError, initTRPC, type inferAsyncReturnType } from "@trpc/server";
import superjson from "superjson";
import { ZodError } from "zod";
import { getServerSession } from "next-auth/next";
import { authOptions } from "~/pages/api/auth/[...nextauth]";
import { prisma } from "~/server/db";

export const createContextInner = ({ req, res }: CreateNextContextOptions) => {
  return {
    prisma,
    req,
    res,
  };
};

export const createTRPCContext = async ({
  req,
  res,
}: CreateNextContextOptions) => {
  return createContextInner({ req, res });
};

export type Context = inferAsyncReturnType<typeof createTRPCContext>;

const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

export const createTRPCRouter = t.router;

export const publicProcedure = t.procedure;

const isAuthed = t.middleware(async ({ ctx, next }) => {
  const auth = await getServerSession(ctx.req, ctx.res, authOptions);
  if (!auth || !auth.user) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
    });
  }
  return next({
    ctx: {
      auth,
      prisma: ctx.prisma,
    },
  });
});

export const protectedProcedure = t.procedure.use(isAuthed);

const isNotAuthed = t.middleware(async ({ ctx, next }) => {
  const auth = await getServerSession(ctx.req, ctx.res, authOptions);
  if (auth && auth.user) {
    throw new TRPCError({
      code: "FORBIDDEN",
    });
  }
  return next({
    ctx: {
      prisma: ctx.prisma,
    },
  });
});

export const unsignProcedure = t.procedure.use(isNotAuthed);
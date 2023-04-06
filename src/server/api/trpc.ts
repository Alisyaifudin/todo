import { type CreateNextContextOptions } from "@trpc/server/adapters/next";
import { prisma } from "~/server/db";
import { getAuth } from "@clerk/nextjs/server";
import { TRPCError, initTRPC, type inferAsyncReturnType } from "@trpc/server";
import superjson from "superjson";
import { ZodError } from "zod";
import { env } from "~/env.mjs";
import type {
  SignedInAuthObject,
  SignedOutAuthObject,
} from "@clerk/nextjs/dist/api";

interface AuthContext {
  auth: SignedInAuthObject | SignedOutAuthObject;
}

export const createContextInner = ({ auth }: AuthContext) => {
  return {
    auth,
    prisma,
  };
};

export const createTRPCContext = (opts: CreateNextContextOptions) => {
  return createContextInner({ auth: getAuth(opts.req) });
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

const isAuthed = t.middleware(({ next, ctx }) => {
  if (!ctx.auth?.userId || ctx.auth?.userId !== env.USER_ID) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
    });
  }
  return next({
    ctx: {
      auth: ctx.auth,
      prisma: ctx.prisma,
    },
  });
});

export const protectedProcedure = t.procedure.use(isAuthed);

import { createTRPCRouter, unsignProcedure } from "~/server/api/trpc";
import { schema } from "~/pages/auth/signup";
import { hashPassword } from "~/utils/hash";

export const userRouter = createTRPCRouter({
  create: unsignProcedure.input(schema).mutation(async ({ input, ctx }) => {
    const hashedPassword = await hashPassword(input.password);
    const user = await ctx.prisma.user.create({
      data: {
        email: input.email,
        password: hashedPassword,
        name: input.name,
      },
    });
    return user;
  }),
});

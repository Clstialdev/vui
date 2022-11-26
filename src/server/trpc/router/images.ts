import { z } from "zod";

import { router, publicProcedure } from "../trpc";

export const imagesRouter = router({
  vote: publicProcedure
    .input(z.object({ id: z.string(), tags: z.string().array(), vote: z.string() }))
    .mutation(({ ctx, input }) => {
        return  ctx.prisma.images.upsert({
            where: {id: input.id},
            create: {id: input.id, tags: input.tags, vote: input.vote},
            update: {tags: input.tags, vote: input.vote}
        });
    }),
});

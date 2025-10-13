// routers/snapshot.router.ts

import { z } from "zod"
import { snapshotService } from "~/server/services/abstract-machine/snapshot.service"
import { createTRPCRouter, protectedProcedure } from "../../trpc"

export const snapshotRouter = createTRPCRouter({
  create: protectedProcedure
    .input(z.object({
      machineId: z.string(),
      name: z.string().optional(),
      description: z.string().optional()
    }))
    .mutation(async ({ input, ctx }) => {
      return snapshotService.createSnapshot(
        input.machineId,
        ctx.session.user.id,
        {
          name: input.name,
          description: input.description
        }
      )
    }),

  restore: protectedProcedure
    .input(z.object({
      machineId: z.string(),
      snapshotId: z.string()
    }))
    .mutation(async ({ input, ctx }) => {
      return snapshotService.restoreFromSnapshot(
        input.machineId,
        input.snapshotId,
        ctx.session.user.id
      )
    }),

  getHistory: protectedProcedure
    .input(z.object({
      machineId: z.string()
    }))
    .query(async ({ input }) => {
      return snapshotService.getSnapshotHistory(input.machineId)
    }),

  compare: protectedProcedure
    .input(z.object({
      snapshotId1: z.string(),
      snapshotId2: z.string()
    }))
    .query(async ({ input }) => {
      return snapshotService.compareSnapshots(
        input.snapshotId1,
        input.snapshotId2
      )
    })
})
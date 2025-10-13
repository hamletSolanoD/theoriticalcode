// src/server/api/routers/usersAbstractMachine.ts
import { z } from "zod";
import { MachineType, UserMachineRole } from "@prisma/client";
import { abstractMachineService } from "~/server/services/abstract-machine/abstractMachine.service";
import { createTRPCRouter, protectedProcedure } from "../../trpc";

export const usersAbstractMachineRouter = createTRPCRouter({
  getUserMachines: protectedProcedure
    .input(
      z.object({
        userId: z.string().optional(),
        type: z.nativeEnum(MachineType).optional(),
        isArchived: z.boolean().optional(),
        role: z.nativeEnum(UserMachineRole).optional(),
        orderBy: z
          .enum(["updatedAt", "createdAt", "name"])
          .default("updatedAt"),
        orderDirection: z.enum(["asc", "desc"]).default("desc"),
        take: z.number().min(1).max(100).default(20),
        skip: z.number().min(0).default(0),
      })
    )
    .query(async ({ ctx, input }) => {
      const userId = input.userId ?? ctx.session.user.id;

      return abstractMachineService.getUserMachines(userId, {
        type: input.type,
        isArchived: input.isArchived,
        role: input.role,
        orderBy: { [input.orderBy]: input.orderDirection },
        take: input.take,
        skip: input.skip,
      });
    }),

  getMachinesByUser: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
      })
    )
    .query(async ({ input }) => {
      return abstractMachineService.getMachinesByUser(input.userId);
    }),

  getUsersWithAccessToMachine: protectedProcedure
    .input(
      z.object({
        machineId: z.string(),
      })
    )
    .query(async ({ input }) => {
      return abstractMachineService.getUsersWithAccessToMachine(
        input.machineId
      );
    }),

  getUserRoleOnMachine: protectedProcedure
    .input(
      z.object({
        userId: z.string().optional(),
        machineId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const userId = input.userId ?? ctx.session.user.id;
      return abstractMachineService.getUserRoleOnMachine(userId, input.machineId);
    }),

  hasUserAccess: protectedProcedure
    .input(
      z.object({
        userId: z.string().optional(),
        machineId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const userId = input.userId ?? ctx.session.user.id;
      return abstractMachineService.hasUserAccess(userId, input.machineId);
    }),

  getMachineStats: protectedProcedure
    .input(
      z.object({
        userId: z.string().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const userId = input.userId ?? ctx.session.user.id;
      return abstractMachineService.getMachineStats(userId);
    }),
});
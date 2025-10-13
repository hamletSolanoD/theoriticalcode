// src/server/api/routers/abstractMachine.ts
import { z } from "zod";
import { MachineType } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { abstractMachineService } from "~/server/services/abstract-machine/abstractMachine.service";
import { createTRPCRouter, protectedProcedure } from "../../trpc";

export const abstractMachineRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1).max(255),
        description: z.string().optional(),
        type: z.nativeEnum(MachineType),
        yjsState: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const yjsBuffer = Buffer.from(input.yjsState, "base64");

      return abstractMachineService.createMachine({
        name: input.name,
        description: input.description,
        type: input.type,
        yjsState: yjsBuffer,
        createdById: ctx.session.user.id,
      });
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().min(1).max(255).optional(),
        description: z.string().optional(),
        yjsState: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const userRole = await abstractMachineService.getUserRoleOnMachine(
        ctx.session.user.id,
        input.id
      );

      if (!userRole || userRole.role === "VIEWER") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "No tienes permisos para editar esta máquina",
        });
      }

      const yjsBuffer = input.yjsState
        ? Buffer.from(input.yjsState, "base64")
        : undefined;

      return abstractMachineService.updateMachine(input.id, {
        name: input.name,
        description: input.description,
        yjsState: yjsBuffer,
      });
    }),

  delete: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const userRole = await abstractMachineService.getUserRoleOnMachine(
        ctx.session.user.id,
        input.id
      );

      if (!userRole || userRole.role !== "OWNER") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Solo el propietario puede eliminar esta máquina",
        });
      }

      return abstractMachineService.deleteMachine(input.id);
    }),

  getById: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const hasAccess = await abstractMachineService.hasUserAccess(
        ctx.session.user.id,
        input.id
      );

      if (!hasAccess) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "No tienes acceso a esta máquina",
        });
      }

      return abstractMachineService.getMachineById(input.id);
    }),

  archive: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const userRole = await abstractMachineService.getUserRoleOnMachine(
        ctx.session.user.id,
        input.id
      );

      if (!userRole || userRole.role === "VIEWER") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "No tienes permisos para archivar esta máquina",
        });
      }

      return abstractMachineService.archiveMachine(input.id);
    }),

  unarchive: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const userRole = await abstractMachineService.getUserRoleOnMachine(
        ctx.session.user.id,
        input.id
      );

      if (!userRole || userRole.role === "VIEWER") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "No tienes permisos para desarchivar esta máquina",
        });
      }

      return abstractMachineService.unarchiveMachine(input.id);
    }),
});
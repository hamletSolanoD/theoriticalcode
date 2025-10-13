// src/server/services/abstractMachine.service.ts
import type { MachineType, UserMachineRole, Prisma } from "@prisma/client";
import { db } from "~/server/db";

export const abstractMachineService = {
  // ==================== USER MACHINE ACCESS ====================
  
  async getUserMachines(
    userId: string,
    options?: {
      type?: MachineType;
      isArchived?: boolean;
      role?: UserMachineRole;
      orderBy?: Prisma.AbstractMachineOrderByWithRelationInput;
      take?: number;
      skip?: number;
    }
  ) {
    const where: Prisma.AbstractMachineWhereInput = {
      owners: {
        some: {
          userId,
          ...(options?.role && { role: options.role }),
        },
      },
      ...(options?.type && { type: options.type }),
      ...(options?.isArchived !== undefined && { isArchived: options.isArchived }),
    };

    const [machines, total] = await Promise.all([
      db.abstractMachine.findMany({
        where,
        orderBy: options?.orderBy ?? { updatedAt: "desc" },
        take: options?.take,
        skip: options?.skip,
        include: {
          createdBy: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
            },
          },
          owners: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                  image: true,
                },
              },
            },
          },
          _count: {
            select: {
              snapshots: true,
            },
          },
        },
      }),
      db.abstractMachine.count({ where }),
    ]);

    return { machines, total };
  },

  async getMachinesByUser(userId: string) {
    return db.abstractMachine.findMany({
      where: {
        owners: {
          some: { userId },
        },
      },
      include: {
        owners: {
          where: { userId },
          select: { role: true },
        },
      },
    });
  },

  async getUsersWithAccessToMachine(machineId: string) {
    return db.userOnAbstractMachine.findMany({
      where: { abstractMachineId: machineId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
      },
      orderBy: { addedAt: "asc" },
    });
  },

  async getUserRoleOnMachine(userId: string, machineId: string) {
    return db.userOnAbstractMachine.findUnique({
      where: {
        userId_abstractMachineId: {
          userId,
          abstractMachineId: machineId,
        },
      },
      select: { role: true },
    });
  },

  async hasUserAccess(userId: string, machineId: string) {
    const access = await db.userOnAbstractMachine.findUnique({
      where: {
        userId_abstractMachineId: {
          userId,
          abstractMachineId: machineId,
        },
      },
    });
    return !!access;
  },

  // ==================== ABSTRACT MACHINE CRUD ====================

  async createMachine(data: {
    name: string;
    description?: string;
    type: MachineType;
    yjsState: Buffer;
    createdById: string;
  }) {
    return db.abstractMachine.create({
      data: {
        name: data.name,
        description: data.description,
        type: data.type,
        yjsState: data.yjsState,
        createdById: data.createdById,
        owners: {
          create: {
            userId: data.createdById,
            role: "OWNER",
          },
        },
      },
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        owners: true,
      },
    });
  },

  async updateMachine(
    machineId: string,
    data: {
      name?: string;
      description?: string;
      yjsState?: Buffer;
      isArchived?: boolean;
    }
  ) {
    return db.abstractMachine.update({
      where: { id: machineId },
      data: {
        ...data,
        ...(data.yjsState && { version: { increment: 1 } }),
      },
    });
  },

  async deleteMachine(machineId: string) {
    return db.abstractMachine.delete({
      where: { id: machineId },
    });
  },

  async getMachineById(machineId: string) {
    return db.abstractMachine.findUnique({
      where: { id: machineId },
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        owners: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                image: true,
              },
            },
          },
        },
        _count: {
          select: {
            snapshots: true,
          },
        },
      },
    });
  },

  async archiveMachine(machineId: string) {
    return db.abstractMachine.update({
      where: { id: machineId },
      data: { isArchived: true },
    });
  },

  async unarchiveMachine(machineId: string) {
    return db.abstractMachine.update({
      where: { id: machineId },
      data: { isArchived: false },
    });
  },
  // ==================== STATS ====================

  async getMachineStats(userId: string) {
    const [total, byType, archived] = await Promise.all([
      db.abstractMachine.count({
        where: {
          owners: { some: { userId } },
        },
      }),
      db.abstractMachine.groupBy({
        by: ["type"],
        where: {
          owners: { some: { userId } },
          isArchived: false,
        },
        _count: true,
      }),
      db.abstractMachine.count({
        where: {
          owners: { some: { userId } },
          isArchived: true,
        },
      }),
    ]);

    return { total, byType, archived };
  },
};
// services/snapshot.service.ts

import { PrismaClient } from "@prisma/client/edge"
import * as Y from "yjs"

const prisma = new PrismaClient()

const MAX_SNAPSHOTS_PER_ABSTRACT_MACHINE = 10

export const snapshotService = {
  async createSnapshot(
    machineId: string,
    userId: string,
    options?: {
      name?: string
      description?: string
    }
  ) {
    const machine = await prisma.abstractMachine.findUnique({
      where: { id: machineId },
      include: {
        snapshots: {
          orderBy: { version: 'desc' },
          take: 1
        }
      }
    })

    if (!machine) throw new Error('Máquina no encontrada')

    const ydoc = new Y.Doc()
    Y.applyUpdate(ydoc, machine.yjsState)
    const snapshot = Y.snapshot(ydoc)
    const encodedSnapshot = Y.encodeSnapshot(snapshot)

    const nextVersion = (machine.snapshots[0]?.version || 0) + 1

    const newSnapshot = await prisma.abstractMachineSnapshot.create({
      data: {
        abstractMachineId: machineId,
        yjsSnapshot: Buffer.from(encodedSnapshot),
        name: options?.name || `Versión ${nextVersion}`,
        description: options?.description,
        version: nextVersion,
        createdById: userId
      }
    })

    await this.cleanupOldSnapshots(machineId)

    return newSnapshot
  },

  async cleanupOldSnapshots(machineId: string) {
    const snapshots = await prisma.abstractMachineSnapshot.findMany({
      where: { abstractMachineId: machineId },
      orderBy: { createdAt: 'desc' },
      select: { id: true }
    })

    if (snapshots.length > MAX_SNAPSHOTS_PER_ABSTRACT_MACHINE) {
      const toDelete = snapshots.slice(MAX_SNAPSHOTS_PER_ABSTRACT_MACHINE)
      
      await prisma.abstractMachineSnapshot.deleteMany({
        where: {
          id: { in: toDelete.map(s => s.id) }
        }
      })
    }
  },

  async restoreFromSnapshot(
    machineId: string,
    snapshotId: string,
    userId: string
  ) {
    const snapshot = await prisma.abstractMachineSnapshot.findUnique({
      where: { id: snapshotId }
    })

    if (!snapshot || snapshot.abstractMachineId !== machineId) {
      throw new Error('Snapshot no encontrado')
    }

    await this.createSnapshot(machineId, userId, {
      name: `Auto-save antes de restaurar ${snapshot.name}`,
      description: 'Guardado automático antes de restore'
    })

    
    const ydoc = new Y.Doc()
    Y.applyUpdate(ydoc, snapshot.yjsSnapshot)
    
    const newState = Y.encodeStateAsUpdate(ydoc)

    await prisma.abstractMachine.update({
      where: { id: machineId },
      data: {
        yjsState: Buffer.from(newState),
        version: { increment: 1 },
        updatedAt: new Date()
      }
    })

    return { success: true, restoredFrom: snapshot.name }
  },

  async getSnapshotHistory(machineId: string) {
    return prisma.abstractMachineSnapshot.findMany({
      where: { abstractMachineId: machineId },
      orderBy: { createdAt: 'desc' },
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
            image: true
          }
        }
      }
    })
  },

  async compareSnapshots(
    snapshotId1: string,
    snapshotId2: string
  ) {
    const [snap1, snap2] = await Promise.all([
      prisma.abstractMachineSnapshot.findUnique({ where: { id: snapshotId1 } }),
      prisma.abstractMachineSnapshot.findUnique({ where: { id: snapshotId2 } })
    ])

    if (!snap1 || !snap2) throw new Error('Snapshots no encontrados')

    const doc1 = new Y.Doc()
    const doc2 = new Y.Doc()
    
    Y.applyUpdate(doc1, snap1.yjsSnapshot)
    Y.applyUpdate(doc2, snap2.yjsSnapshot)

    const json1 = doc1.toJSON()
    const json2 = doc2.toJSON()

    return {
      snapshot1: { id: snap1.id, name: snap1.name, data: json1 },
      snapshot2: { id: snap2.id, name: snap2.name, data: json2 }
    }
  }
}
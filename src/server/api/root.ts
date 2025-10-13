import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";
import { abstractMachineRouter } from "./routers/abstract-machine/abstractMachine";
import { usersAbstractMachineRouter } from "./routers/abstract-machine/usersAbstractMachine";
import { snapshotRouter } from "./routers/abstract-machine/snapshot";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
    abstractMachine: abstractMachineRouter,
    usersAbstractMachine: usersAbstractMachineRouter,
    snapshot: snapshotRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);

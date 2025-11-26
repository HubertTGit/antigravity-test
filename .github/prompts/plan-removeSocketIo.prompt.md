# Plan: Remove Socket.IO and All Usage

Removing Socket.IO will eliminate real-time synchronization between clients. Users will only see updates when they refresh or perform actions themselves. The app will remain functional for single-user scenarios but won't broadcast changes to other connected clients.

## Steps

1. **Remove Socket.IO dependencies** from `package.json` (delete `socket.io` and `socket.io-client` entries)

2. **Replace custom server** by deleting `server.js` and using Next.js default server (remove from `package.json` scripts if referenced)

3. **Remove Socket.IO emission logic** from `src/app/actions.ts` in `addTodo`, `updateTodo`, `deleteTodo`, and `toggleTodo` functions (remove `global.io` checks and `.emit()` calls)

4. **Remove Socket.IO client connection** from `src/components/todo-list.tsx` (remove import, socket useEffect, `socketId` state, and socket ID parameters from action calls)

5. **Remove global type definition** by deleting the `global.io` declaration from `src/types/global.d.ts`

## Further Considerations

1. **Update start scripts?** Check `package.json` scripts—if using `node server.js`, change to `next dev` for development and `next start` for production
2. **Install dependencies after removal?** Run `pnpm install` after editing `package.json` to clean up `node_modules` and lock file

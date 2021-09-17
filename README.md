# Getting Started

1. `npm i` or `yarn`
2. `npm run build` or `yarn build`
3. `npm run server -- <watched_dirs>` or `yarn server <watched_dirs>` or `node ./server <watched_dirs>`

# Choices Made

- To monitor directories I opted for Chokidar which is used under the hood for hot-reload scripts like Create React App.
- Rendering the tree was made simpler by the use of a PWA framework like react, recursed over file and folder components.
- The file structure is all kept in a tree. I used `tree-model` as a helper.
- Keeping the server synced with the client was done with Socket.IO. I emit the full tree on connection, then send add or remove events to the client to update its local tree, server tree is also updated for any additional client connections.
- I consciously decided not to use Typescript, since it would slow me down on a project where I don't think it matters that much given its small scope. I also refrained from using `tree structure` react components and premade libraries that would fill this exact use-case

# Known Bugs

I am going to reference the challenge sheet for this: `a file on the host is deleted, added, removed or renamed`. I will interpret deleted and removed as a redundancy.

This saved me from having to squash this bug, quite frankly im in a bind for time and did this very quickly. This leaves a "minor major" bug that I don't have time to fix.

While adding, deleting and renaming a file/folder works, moving a file or folder from one location to another does not consistently work on the front-end. I have not gotten to debug this but if I had to guess it comes either from the bombardment of events that come with moving a file and the front end misses some.

This was built and tested on Ubuntu 16.04 running on a VM on a Windows machine. I can't promise results on a Mac since I can't test it.

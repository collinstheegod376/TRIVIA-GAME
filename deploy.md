# Electric Nocturne - Deployment & Architecture Guide

This guide explains how the "No SQL / Ephemeral State" architecture works and how to seamlessly deploy it to Vercel.

---

## Part 1: How the "No SQL" Architecture Works in React

When you don’t use a database, all the action happens directly between the players' browsers using Supabase’s WebSocket connection. Here is the step-by-step lifecycle of a match:

### 1. The Connection (Supabase Presence)
When a player enters a lobby code (like `XT9-S4P`), they join a specific "Channel". 
*   **What it looks like:** `const channel = supabase.channel('room-XT9-S4P')`
*   **Presence:** As soon as they join, Supabase Presence announces to everyone else in that channel: *"Hey, Player 2 just arrived!"* The React state updates the UI to show their avatar in the grid.

### 2. The Host's Role
Since there is no centralized database holding the game rules, **one player's browser acts as the server.** Usually, the first person to create the lobby is deemed the Host. 
*   The Host's browser is responsible for keeping track of the timer, the score, and determining who won the round.
*   If the Host leaves, the game crashes (which is totally fine for quick weekend games!).

### 3. The Moves (Supabase Broadcast)
When Player 1 picks a card (e.g., using a "Rasengan" card feature):
*   Their browser sends a tiny encrypted message: `channel.send({ type: 'broadcast', event: 'move', payload: { card: 'rasengan' }})`.
*   This message goes to Supabase and is instantly bounced to Player 2's browser.
*   Player 2's browser doesn't know *what* was played (the UI hides it), it just knows Player 1 has locked in their choice.

### 4. The Resolution
Once both players have locked in their moves via Broadcast, the Host's browser compares the two choices, calculates the winner based on your logic, and fires one final Broadcast: `event: 'round_winner', payload: { winner: 'Player 1', points: 10 }`. Both screens watch this event and update the score UI simultaneously. 

When the players close the tab, the state vanishes. Total storage used: **0 bytes.**

---

## Part 2: Quick Deployment to Vercel

Since this project uses Vite and React, deploying to Vercel is incredibly fast.

### Method A: The Git Way (Recommended)
1. **Push to GitHub**: Commit your game codebase and push it to a new GitHub repository.
2. **Go to Vercel**: Log into [Vercel.com](https://vercel.com).
3. **Import Project**: Click "Add New" > "Project" and select your GitHub repository.
4. **Environment Variables**: Open your Vercel Dashboard for that project, go to the "Environment Variables" section, and add your Supabase Keys:
    *   `VITE_SUPABASE_URL` = `your-url.supabase.co`
    *   `VITE_SUPABASE_ANON_KEY` = `your-anon-key`
5. **Deploy**: Click Deploy. Vercel automatically detects it's a Vite project, builds the optimized HTML/JS, and gives you a live production URL.

### Method B: The CLI Way
If you prefer not pulling GitHub into it right now, you can deploy straight from your terminal:
1. In your terminal, run `npx vercel` (you will be prompted to log in if you haven't).
2. It will ask you a few setup questions:
    *   *Set up and deploy?* **Yes**
    *   *Link to existing project?* **No**
    *   *What's your project's name?* **electric-nocturne**
    *   *In which directory is your code located?* **./**
3. Open the Vercel dashboard online, add your Supabase Environment Variables as detailed above. 
4. Head back to your terminal and run `npx vercel --prod` to push your code directly to the live URL.

Both methods provide free HTTPS, fast CDNs, and handle your built Progressive Web App (PWA) assets perfectly so mobile users can download the game to their home screens!

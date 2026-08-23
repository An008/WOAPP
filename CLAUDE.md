# IRON PROTOCOL -- Claude Code Working File

**Live:** https://an008.github.io/WOAPP/ - **Repo:** `an008/WOAPP` - **Version:** 3.7.0

---

# PART 0 -- HOW YOU (CLAUDE) MUST USE THIS FILE

Read this section before doing anything else.

## 0.1 The operator has zero tooling installed

No git. No Node. No editor. No Android SDK. Assume nothing exists.

## 0.2 Rules for guiding setup

1. **One step at a time.** Never present Step 3 until they confirm Step 2.
2. **Granular, not verbose.** "Click the green button labelled Download" -- not a paragraph on what git is.
3. **Never assume a click landed.** End each step with what they should now see.
4. **Ask their OS first.** Windows and macOS branches differ. Do not guess.
5. **Every command in a copy-paste block, one command per block.**
6. **If a step fails, stop.** Do not proceed. Diagnose before continuing.
7. **No jargon without a concrete referent.** "Terminal" -> tell them exactly how to open it.

## 0.3 Rules for working on the code

1. **Run the QA harness before every push.** Section 4. Not optional -- a missing element ID once shipped a mission that could not be completed.
2. **ASCII only.** Section 3.1.
3. **Never put the API key in `S`.** Section 3.2.
4. **Verify deployed commit == HEAD.** Section 3.3.
5. **Prefer editing over rewriting.** Files are large; a targeted edit is safer than regenerating.

---

# PART 1 -- WHAT THIS IS

A 48-week strength-and-endurance training app for a single operator, framed as mission-readiness operations. Vanilla JS, no build step, no framework, served as static files from GitHub Pages.

**Goal of the programme:** ultra-trail endurance (Finland X), explosive power, 5 km carry with 30 kg. Hybrid model -- Russian periodisation structure (Matveyev waves, Verkhoshansky blocks) with Western autoregulation (RPE-driven load selection).

**Operator baseline:** 40yo male, 164 cm, 71.3 kg, 30.3% body fat (DEXA-calibrated). Gym access, but frequently trains with nothing.

---

# PART 2 -- ARCHITECTURE

## 2.1 Layout

```
index.html          shell, CSS, DOM skeleton, 24 script tags
sw.js               service worker (notifications only)
data-NC.json        synced operator data -- PUBLIC, never put secrets here
js/*.js             24 modules
```

## 2.2 Load order -- MUST NOT CHANGE

Plain `<script>` tags sharing one global scope. No modules, no bundler.

```
 1 config.js          repo target, users, APP_VERSION, PAT segments
 2 data-programme.js  SESSIONS (A/B/C/D/REST), PHASES, LM, MACRO_TARGETS, FEEL
 3 state.js           S, loadS/saveS, session keys, phase maths, API key store
 4 auth.js            login, cloud pull/push, showTab
 5 notifications.js   permission, reminders, service worker
 6 ai.js              callAI, buildPrompt
 7 plan.js            THE SCHEDULE AUTHORITY -- what today is
 8 field.js           BASE/FIELD loadout, resolveEx
 9 rpe.js             RPE audit
10 patterns.js        THE MODEL -- patterns, RLI ladders, mmFor
11 skips.js           skip reasons and their corrections
12 adapt.js           autoregulation, RLI progression, hiatus regression
13 nutrition.js       body fat, calories, macros
14 progress.js        merit, ranks, decay, development map
15 ui-today.js        Today screen
16 debrief.js         post-mission AI analysis
17 ui-session.js      flash cards, regroup timer, muscle map
18 ui-assessment.js   assessment, extractJSON
19 ui-journal.js      breathing, journal, history
20 recovery.js        muscle freshness
21 ui-metrics.js      Operator File
22 ui-settings.js     Setup
23 wakelock.js        screen wake lock
24 app.js             bootstrap -- MUST BE LAST
```

`index.html` is authoritative. Read it rather than trusting this list.

## 2.3 Data model

```js
S = {
  profile: {
    name, start, height, age,
    rli: {exId: 0.62},        // current load index per objective
    overrides: {},            // AI replacement objectives
    equipment: {},            // empty = bodyweight only
    loadout: 'base'|'field',
    bfReferences: [],         // DEXA scans for calibration
    // NEVER apiKey -- see 3.2
  },
  sessions: {"2026-07-28|A": {type, date, mode, exercises: {...}}},
  measurements: [], journal: {}, landmarks: [], macros: {},
  assessmentHistory: [], debriefHistory: []
}
```

Sessions are keyed **`date|type`**. Never date alone -- that bug locked the app to Mission A for days.

## 2.4 The training model

**RLI (Relative Load Index)** = effective load at the working limb ? bodyweight.

Objectives declare `{pattern, intent, rli}`. `resolveEx()` produces the actual exercise in three layers:

```
layer 0  pattern -> name/volume/load from current RLI
layer 1  FIELD variant if no gym
layer 2  AI override from a debrief
```

Same RLI gives DB bench 44 kg (BASE) or a standard push-up (FIELD) -- same stimulus, different delivery.

**Intents** gate autoregulation: `strength` (RPE 7-9), `power` (6-7, never load-escalated on low RPE, never rest-shortened), `endurance` (3-5), `support` (2-5, never escalated -- warm-ups *should* be easy).

---

# PART 3 -- HARD RULES

## 3.1 ASCII only

No byte above 0x7F in any file. Use `\u00d7` in JS strings, `&#10003;` in HTML.

**Two traps already hit:**
- `textContent` does **not** decode HTML entities. Use `\u2713`, not `&#10003;`.
- Display text must never be persisted. Store IDs and state; rebuild labels from definitions.

Block any push containing non-ASCII.

## 3.2 The API key

Lives in `localStorage['iron-ai-key']` **only**.

Never in `S`. `S` is uploaded to a **public** repo -- writing the key there publishes it. `autoSyncToGH` strips it defensively; `loadS` purges it.

Note: `config.js` contains a GitHub PAT in the public client. The operator has accepted this risk for now. Do not "fix" it without asking.

## 3.3 Deployment

GitHub Pages cancels concurrent builds. Pushing many files at once means the last build is cancelled and the `?v=` cache-buster never goes live -- browsers keep serving stale JS.

**Procedure:**
1. Push modules, ~3s apart
2. Wait ~45s
3. Push `index.html` **alone**
4. **Verify deployed SHA == HEAD.** If not, force a rebuild by nudging `index.html`.

Bump `APP_VERSION` in `config.js` and every `?v=` in `index.html` together.

## 3.4 Data integrity

- A serial needs **actions AND RPE** or it cannot be logged.
- Volume, recovery and RPE analysis count only serials carrying an RPE.
- Skipped != completed. `sessResolved` (done OR skipped) advances the plan; `sessComp` (done only) drives merit.
- Progression is **earned**: `min(calendarWeeks, completedMissions/4)`. Never calendar alone.

---

# PART 4 -- THE QA HARNESS

**Run before every push. No exceptions.**

Once local, this becomes a real test file. Until then it is `/tmp/qa.js` + a scenario appended.

It must:
1. Stub `document.getElementById` to return `null` for any ID **not** in `index.html`, and record it. *(This is the check that would have caught the dead completion button.)*
2. Click through all 5 missions x 2 loadouts to 100%, driving `fcRp`/`fcRpe`/`fcDone`/`skipRest`.
3. Assert the completion screen renders "MISSION ACCOMPLISHED".
4. Assert re-tapping cannot undo completion.
5. Render every screen and every Operator File mode.
6. Statically sweep all modules for dangling `getElementById` references.

**Harness gotchas:**
- Node 21+ ships a read-only global `navigator` -- override with `Object.defineProperty`.
- `wakeLock.request()` resolves a microtask later -- `await` a tick before asserting.
- `setInterval` is stubbed, so rest callbacks need draining via `skipRest()`.

---

# PART 5 -- SETUP FROM ZERO

> **Claude: ask which OS before starting. One step at a time. Wait for confirmation.**

## 5.0 Determine the OS

Ask: *"Are you on Windows or Mac?"* Wait. Then use only that branch.

---

## 5.1 Install Git

### Windows
1. Open your browser.
2. Go to `https://git-scm.com/download/win`
3. The download starts by itself. Wait for it to finish.
4. Open your Downloads folder.
5. Double-click the file starting with `Git-`.
6. If Windows asks "Do you want to allow this app to make changes?", click **Yes**.
7. Click **Next** on every screen. Change nothing.
8. Click **Install**.
9. Click **Finish**.
10. Tell Claude: `git done`

### macOS
1. Press `Cmd + Space`.
2. Type `terminal`
3. Press `Enter`. A black or white text window opens.
4. Paste this and press Enter:
```
git --version
```
5. If a box appears offering to install developer tools, click **Install** and wait.
6. Tell Claude what the terminal printed.

---

## 5.2 Install Node.js

### Windows
1. Go to `https://nodejs.org`
2. Click the **big green button on the left** (it says LTS).
3. Wait for the download.
4. Open Downloads, double-click the file ending `.msi`.
5. Click **Next**.
6. Tick **I accept the terms**, click **Next**.
7. Click **Next** on every remaining screen. Change nothing.
8. Click **Install**, then **Yes** if prompted.
9. Click **Finish**.
10. Tell Claude: `node done`

### macOS
1. Go to `https://nodejs.org`
2. Click the **big green button on the left** (LTS).
3. Open Downloads, double-click the `.pkg` file.
4. Click **Continue**, **Continue**, **Agree**, **Install**.
5. Enter your Mac password if asked.
6. Click **Close**.
7. Tell Claude: `node done`

---

## 5.3 Open a terminal

### Windows
1. Press the **Windows key**.
2. Type `powershell`
3. Press **Enter**.
4. A blue window opens. This is your terminal.

### macOS
1. Press `Cmd + Space`, type `terminal`, press **Enter**.

**Verify -- paste each line separately, press Enter, report the output:**
```
git --version
```
```
node --version
```
Expect something like `git version 2.4x` and `v20.x` or higher.

---

## 5.4 Install Claude Code

1. In the terminal, paste and press Enter:
```
npm install -g @anthropic-ai/claude-code
```
2. Wait. It prints many lines. This is normal.
3. When the prompt returns, paste:
```
claude --version
```
4. Report the output.

> **Claude: if this errors on Windows with a permissions message, have them close the terminal, right-click PowerShell, choose "Run as administrator", and retry.**

---

## 5.5 Clone the repository

1. Choose a folder. Paste:
```
cd ~
```
2. Paste:
```
git clone https://github.com/an008/WOAPP.git
```
3. If it asks for a username and password, stop and tell Claude -- you need a token, not a password.
4. Paste:
```
cd WOAPP
```
5. Paste:
```
ls
```
6. You should see `index.html`, `js`, `sw.js`. Report what you see.

---

## 5.6 Start Claude Code

1. Make sure the terminal shows you are in `WOAPP`.
2. Paste:
```
claude
```
3. Follow the login prompts in the browser window that opens.
4. When Claude Code is ready, type:
```
Read CLAUDE.md and summarise the deployment rules back to me.
```
5. If the summary matches Section 3.3, setup is complete.

---

## 5.7 First safe change (proves the loop works)

> **Claude: do this before any real work. It verifies the whole chain end to end.**

1. Ask Claude Code to bump `APP_VERSION` in `js/config.js` by one patch number.
2. Run the QA harness.
3. Commit:
```
git add -A
```
```
git commit -m "chore: verify local toolchain"
```
```
git push
```
4. Wait 60 seconds.
5. Open `https://an008.github.io/WOAPP/`, hard refresh, check Setup shows the new version.

If the version updated, the loop works.

---

# PART 6 -- ROADMAP

## 6.1 Android APK

**Recommended: Capacitor**, pointed at the Pages URL so git pushes still update the app live.

Rough order -- expand into granular steps only when the operator is ready:
1. `npm init` + `npm install @capacitor/core @capacitor/cli`
2. `npx cap init`
3. Set `server.url` to the Pages URL in `capacitor.config.json`
4. Install Android Studio + SDK
5. `npx cap add android`
6. Build a debug APK, sideload it

**What Capacitor unlocks:** Android Keystore (solves the API key properly), true background notifications, Health Connect for Garmin, foreground service for timers.

**Alternative: Bubblewrap/TWA** -- lighter, but still a browser, so it solves none of the above.

## 6.2 Held decisions

| Item | Status |
|---|---|
| API key encryption in git | **Held.** Waiting for Capacitor native storage. Passphrase-derived AES-GCM was the fallback design. |
| GitHub PAT in public client | **Held.** Operator accepts the risk; anonymity is the current defence. Do not change unprompted. |
| Terrain access for Missions B/D | Unconfirmed -- climb intervals and long climbs assume hills, stairs or an incline treadmill. |

## 6.3 Known gaps

- Vertical pulling cannot be truly replicated without a bar. Floor rungs exist but are a holding pattern. A doorway bar is the highest-value purchase.
- Equipment inventory is empty, so everything currently prescribes bodyweight.
- Depth jumps and true shock method are deliberately deferred to Phase 2 (shin splint history).

---

# PART 7 -- BUG PATTERNS THAT HAVE ALREADY COST TIME

Check these first when something breaks.

| Symptom | Cause found |
|---|---|
| Button does nothing | `getElementById` on an ID that does not exist -- throws on line 1, silently kills the function |
| Literal `&#10003;` on screen | HTML entity assigned via `textContent` |
| Feature silently inert | Function defined in a module but never wired into the render path |
| Only Mission A ever offered | Sessions keyed by date alone |
| Stale JS after deploy | `index.html` build cancelled by a concurrent one -- deployed SHA != HEAD |
| AI returns raw JSON | `max_tokens` too low, response truncated mid-structure |
| Recovery view always fresh | `MM` had no entry for pattern-driven objective IDs |
| Setting will not save | `onchange` fires on blur; a re-render destroys the field first. Use `oninput` |

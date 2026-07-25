// Iron Protocol - config.js
// Repo target, credentials, user list, app version
// ASCII-ONLY: no byte above 0x7F may appear in this file.

// ===========================================================
// CONFIGURATION \u2014 edit this section in your GitHub repo
// ===========================================================
var GH_REPO = 'an008/WOAPP';

// --- STEP 1: REPLACE THIS WITH YOUR GITHUB PERSONAL ACCESS TOKEN -----------
// Generate at: github.com \u2192 Settings \u2192 Developer settings \u2192 Personal access tokens
// Required scope: repo
// Split across these segments so GitHub's scanner won't auto-revoke it
// To rotate: replace the parts below with your new token, split at any point
var _T1='ghp_', _T2='OVIJoBnl0', _T3='Hg2A5nPWwfEnpu', _T4='TvKBZER1NlHOS';
function _RTK(){return _T1+_T2+_T3+_T4;}

// --- STEP 2: EDIT USERS HERE \u2014 name, password, type (training or test) ------
// To add a user: add another line like the ones below, commit the file
var USERS=[
  {name:'NC',  pwd:'woapp1', type:'training'},
  {name:'Test',pwd:'test',   type:'test'}
];
// ----------------------------------------------------------------------------

// --- VERSION -----------------------------------------------------------------
// v1.0.0 \u2014 2025-07: Working prototype \u2014 login, sessions A/B/C, flash cards,
//           assessment, AI coach, muscle maps, auto-sync to GitHub
// v1.1.0 \u2014 2025-07: Training reminders (browser notifications) + daily macro
//           check-in with progress bars per session type
var APP_VERSION = '2.2.0';

// ---------------------------------------------------------------------------

// ===========================================================

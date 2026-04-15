## Feature: Authentication (AuthScreen)
- Steps to test: Open `/`, register with a new username/password (>=8 chars), then log out and log back in.
- Expected result: Register/login calls succeed, token + username are stored in localStorage, redirect goes to `/home`.
- Pass/Fail: [ ]

## Feature: Home Dashboard (HomeScreen)
- Steps to test: Login, open `/home`, verify score card loads from backend progress endpoint.
- Expected result: Loading state appears briefly, score renders, API errors show inline red message.
- Pass/Fail: [ ]

## Feature: Learning Modules (LearnScreen)
- Steps to test: Open `/learn`, wait for module groups to load, click a topic card.
- Expected result: `GET /api/modules` returns modules grouped by difficulty; click opens `/tutor?topic=...`.
- Pass/Fail: [ ]

## Feature: AI Tutor + Progress Update (TutorScreen)
- Steps to test: Open `/tutor?topic=Neural Networks`, send a question, click Mark Complete.
- Expected result: `POST /api/tutor` returns response text; `POST /api/progress/update` succeeds for logged-in user only.
- Pass/Fail: [ ]

## Feature: Quiz Generation (QuizScreen)
- Steps to test: Open `/quiz`, enter topic and difficulty, generate quiz and answer all questions.
- Expected result: `POST /api/quiz/generate` returns 5 questions; result screen shows score and XP update call succeeds.
- Pass/Fail: [ ]

## Feature: Quiz Evaluation API
- Steps to test: Trigger manual request to `POST /api/quiz/evaluate` with question, user_answer, correct_answer.
- Expected result: Returns `is_correct` boolean and explanation text.
- Pass/Fail: [ ]

## Feature: Code Lab Evaluate + Run (CodeLabScreen)
- Steps to test: Open `/codelab`, run preset code, then click Evaluate with AI.
- Expected result: `POST /api/code/run` returns output/explanation; `POST /api/code/evaluate` returns score/feedback/fix.
- Pass/Fail: [ ]

## Feature: ML Sandbox (SandboxScreen)
- Steps to test: Open `/sandbox`, place points, click Analyze.
- Expected result: `POST /api/game/sandbox` returns narration; loading and error states render correctly.
- Pass/Fail: [ ]

## Feature: Spam Simulation (SimulateScreen)
- Steps to test: Open `/simulate`, paste email text, click Analyze Text.
- Expected result: `POST /api/simulate/spam` returns `is_spam`, `confidence`, and `reason`; verdict card and confidence bar render.
- Pass/Fail: [ ]

## Feature: Leaderboard (LeaderboardScreen)
- Steps to test: Open `/leaderboard`, verify table renders and auto-refreshes.
- Expected result: `GET /api/leaderboard` returns ranked users; mobile view supports horizontal scroll without clipping.
- Pass/Fail: [ ]

## Feature: Progress Dashboard (DashboardScreen)
- Steps to test: Open `/dashboard` after completing tutor/quiz actions.
- Expected result: `GET /api/progress/{username}` populates XP, module progress, quiz chart, and badges.
- Pass/Fail: [ ]

## Feature: Protected Route + Logout
- Steps to test: While logged out, directly open `/home`, `/quiz`, `/dashboard`; then log in and log out from navbar.
- Expected result: Logged-out access redirects to `/`; logout clears `aiml_username` and `aiml_token` from localStorage.
- Pass/Fail: [ ]

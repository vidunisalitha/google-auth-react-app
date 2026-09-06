# Google Auth React App

A React and Express application that lets users sign in with Google. The frontend uses Google Identity Services to display the Google sign-in button. The backend verifies the Google credential, stores the authenticated user in an Express session, and protects authenticated routes.

## Features

- Google sign-in with Google Identity Services
- Server-side verification of Google ID tokens
- Session-based authentication with Express
- Protected home page
- Logout support
- Success and error toast notifications
- Separate Vite frontend and Express backend
- One command to run both development servers

## Requirements

Install these tools before starting:

- Node.js 18 or newer
- npm
- A Google Cloud account

Check your versions:

```powershell
node --version
npm --version
```

## Create a Google Client ID

The application needs a Google OAuth 2.0 Client ID for a web application.

1. Open the [Google Cloud Console](https://console.cloud.google.com/).
2. Create a new project or select an existing project.
3. Open **APIs & Services**.
4. Open **OAuth consent screen**.
5. Configure the consent screen:
   - Choose **External** unless this is only for users in a Google Workspace organization.
   - Enter an application name.
   - Enter a support email.
   - Add an authorized developer contact email.
   - Save and continue through the remaining screens.
6. If the application is in testing mode, open the **Test users** section and add the Google accounts that will test the application.
7. Open **APIs & Services > Credentials**.
8. Select **Create credentials > OAuth client ID**.
9. Select **Web application** as the application type.
10. Give the client a name, such as `Google Auth React App`.
11. Under **Authorized JavaScript origins**, add the exact frontend origins used during development:

```text
http://localhost:5173
http://127.0.0.1:5173
```

12. Do not add `/login`, `/home`, or a trailing slash to these origins.
13. Click **Create** and copy the generated **Client ID**.

This application uses Google Identity Services in the browser, so an OAuth redirect URI is not required for the current sign-in-button flow. If you later add a redirect-based OAuth flow, configure its redirect URI separately.

## Project Setup

Clone the repository and enter its directory:

```powershell
git clone <repository-url>
cd google-auth-react-app
```

Install the root development dependency and both application dependencies:

```powershell
npm install
npm run install:all
```

The root `install:all` command installs dependencies in both `backend` and `frontend`.

## Environment Variables

Create or update `frontend/.env`:

```env
VITE_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
VITE_API_URL=http://localhost:5000
```

Create or update `backend/.env`:

```env
PORT=5000
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
SESSION_SECRET=replace-with-a-long-random-secret
```

Use the same Google Client ID in both files. Do not commit real credentials or session secrets to Git. The frontend variable is exposed to browser code, so it must contain only the public Google Client ID; never put a client secret in `frontend/.env`.

## Run the Application

From the repository root, start both servers with one command:

```powershell
npm run dev
```

The application will be available at:

- Frontend: http://localhost:5173
- Backend: http://localhost:5000

Open the frontend at:

```text
http://localhost:5173/login
```

The root command starts:

- Vite with `frontend/npm run dev`
- Nodemon with `backend/npm run dev`

Stop both servers with `Ctrl+C`.

## Run Servers Separately

Frontend only:

```powershell
cd frontend
npm run dev
```

Backend only:

```powershell
cd backend
npm run dev
```

## Build the Frontend

Create a production build:

```powershell
cd frontend
npm run build
```

Preview the production build locally:

```powershell
cd frontend
npm run preview
```

## Common Problems

### Google reports that the origin is not allowed

Make sure the URL in the browser exactly matches an authorized JavaScript origin in Google Cloud. For the default setup, use:

```text
http://localhost:5173
```

If Vite uses another port, add that exact origin to the OAuth client and restart the frontend.

### Google sign-in returns 403

Verify that:

- The OAuth client is a **Web application** client.
- The client ID in both `.env` files is identical to the client ID in Google Cloud.
- The current browser origin is authorized.
- Your Google account is listed as a test user when the consent screen is in testing mode.
- Vite was restarted after changing `.env`.

### The backend does not start

Run it from the backend directory or use the root command:

```powershell
cd backend
npm install
npm run dev
```

Confirm that port 5000 is available and that `backend/.env` contains `PORT`, `GOOGLE_CLIENT_ID`, and `SESSION_SECRET`.

### The initial saved-user request returns 401

When no user is logged in, `/auth/saveduser` indicates that there is no saved session. The frontend treats this as an anonymous user and displays the login page. This is expected behavior.

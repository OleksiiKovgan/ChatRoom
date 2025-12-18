# Full Stack Application (Spring Boot & Vue.js)

This repository contains a full-stack application organized as a monorepo.

- **Backend:** Java Spring Boot (located in the project root).
- **Frontend:** Vue.js + Vite (located in the `client/` subdirectory).

## 📋 Prerequisites

Ensure the following are installed on your Windows machine before starting:

- **Java JDK 17+** (Required for the Backend)
- **Node.js** (LTS version recommended)
- **pnpm** (Package manager)
  - Install command: `npm install -g pnpm`
- **Git**

---

## 📂 Project Structure

```text
├── build.gradle          # Backend configuration (Gradle)
├── package.json          # Root scripts (Backend wrappers)
├── src/                  # Backend Source Code
└── client/               # Frontend Application
    ├── package.json
    └── src/



🚀 Development: Running Locally

You will need two separate terminal windows to run the full application.
1. Start the Backend (Spring Boot)

The backend is located in the root directory.

In Terminal 1 (Root Directory):
code Powershell


# Starts the Java server using the wrapper script
pnpm dev



Wait until you see the Spring logo and "Started Application..." in the console.
2. Start the Frontend (Client)

The frontend is located in the client folder.

In Terminal 2:
code Powershell


# Navigate to the client folder
cd client

# Install dependencies (required for first run only)
npm install

# Start the Vite development server
npm run dev



The application will launch in your browser (typically at http://localhost:5173).
🛠️ Building for Production

To create optimized artifacts for deployment, follow these steps.
1. Build the Backend

This compiles the Java code into a standalone executable .jar file.

From the Root Directory:
code Powershell


pnpm build



    Output: The executable file will be generated at build/libs/your-app-name.jar.

2. Build the Frontend

This compiles the Vue code into static HTML/CSS/JS files suitable for serving.

From the Client Directory:
code Powershell


cd client
pnpm install
pnpm build



    Output: The static files will be generated in the client/dist folder.

```

Deployment (How to Run)

To run the full application in a production environment, you typically serve the Frontend through the Backend. This allows you to deploy a single file (.jar) that handles both the API and the user interface.

1. Prepare the Single Artifact

Before building the final JAR, you must move the built frontend files into the backend's static resources folder.

    Build the Frontend:
    code Powershell

cd client
pnpm build

Copy Assets:
Copy all files inside client/dist/ and paste them into src/main/resources/static/ in the root folder.
(Note: Create the static folder if it does not exist).

Build the Backend:
Return to the root directory and build the JAR. It will now include the React/Vue frontend inside it.
code Powershell

    cd ..
    pnpm build

2. Run the Application

You now have a self-contained application file. You can run this on any server that has Java installed.

Execute the JAR:
code Powershell

java -jar build/libs/your-app-name.jar

3. Access

The application will start on the configured backend port (default: 8080).

    Open your browser to: http://localhost:8080

    You will see the Vue.js frontend, communicating with the Spring Boot API on the same port.

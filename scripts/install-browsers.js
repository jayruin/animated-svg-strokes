import { spawn } from "child_process";

spawn("npx", ["playwright", "install", "--with-deps", "chromium"], { env: { ...process.env, PLAYWRIGHT_BROWSERS_PATH: 0 }, stdio: "inherit", shell: true });

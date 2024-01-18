import { spawn } from "child_process";

spawn("npx", ["playwright", "install", "--with-deps", "chromium"], { env: { PLAYWRIGHT_BROWSERS_PATH: 0 }, stdio: "inherit", shell: true });

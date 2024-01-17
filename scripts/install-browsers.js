import { spawn } from "child_process";

spawn("playwright", ["install", "--with-deps", "chromium"], { env: { PLAYWRIGHT_BROWSERS_PATH: 0 }, stdio: "inherit", shell: true });

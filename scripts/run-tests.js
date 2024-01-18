import { spawn } from "child_process";

spawn("npx", ["vitest", "run"], { env: { ...process.env, PLAYWRIGHT_BROWSERS_PATH: 0 }, stdio: "inherit", shell: true });

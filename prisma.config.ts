import { DATABASE_PUBLIC_URL } from "./src/config/env.config.js";
import { defineConfig } from "prisma/config";


export default defineConfig({
	datasource: {
		url: DATABASE_PUBLIC_URL

	}
});
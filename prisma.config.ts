import "dotenv/config";
import { defineConfig } from "prisma/config";
import appConfig from "./src/config/index";

export default defineConfig({
    schema: "prisma/schema",
    migrations: {
        path: "prisma/migrations",
    },
    datasource: {
        url: appConfig.db_url!,
    },
});

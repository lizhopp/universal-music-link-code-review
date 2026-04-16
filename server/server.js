import db from './db/client.js';
import app from "./app.js";

const PORT = process.env.PORT ?? 3000;

const REQUIRED_ENV_VARS = ["DATABASE_URL","JWT_SECRET","CORS_ORIGIN"];

const missing = REQUIRED_ENV_VARS.filter((key) => {
    const value = process.env[key];
    return !value || !value.trim();
});

if (missing.length > 0) {
    console.error(`Startup failed due to missing env variables: ${missing.join(",")}`);
    process.exit(1);
}

await db.connect();

app.listen(PORT, ()=>{
    console.log(`Listening on port ${PORT}...`);
});

import db from './db/client.js';
import app from "./app.js";

const PORT = process.env.PORT ?? 3000;

await db.connect();

app.listen(PORT, ()=>{
    console.log(`Listening on port ${PORT}...`);
});

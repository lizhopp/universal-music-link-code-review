import pg from 'pg';
const db = pg.Client(process.env(DATABASE_URL))
//.evn file has not been set up yet

export default db;
import bcrypt from 'bcrypt';
import db from '#db/client';

export async function createUser(email, password) {
    const text = 'insert into users(email, password) values($1,$2) returning *';

    const hashedPassword = await bcrypt.hash(password, 10);
    const { rows: [user] } = await db.query(text, [email, hashedPassword]);

    return user;
}

import bcrypt from 'bcrypt';
import db from '#db/client';

export async function createUser(email, password) {
    const text = 'insert into users(email, password) values($1,$2) returning *';

    const hashedPassword = await bcrypt.hash(password, 10);
    const { rows: [user] } = await db.query(text, [email, hashedPassword]);

    return user;
}

export async function getUserById(id){
    const text = 'select * from users where id=$1';

    const { rows: [user]} = await db.query(text, [id]);
    return user;
}

export async function getUser(email,password){
    const text = 'select * from users where email = $1';

    const { rows:[user] } = await db.query(text,[email]);
    if(!user) return null;

    const isValid = await bcrypt.compare(password, user.password_hash);
    if (!isValid) return null;

    return user;
}

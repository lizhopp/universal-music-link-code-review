import db from "#db/client";



export async function addPlatform({ name, slug, baseUrl }) {
    const text = `insert into platforms(name,slug,base_url)
    values($1,$2,$3)
    on conflict (slug) do update
    set name = excluded.name,
        base_url = excluded.base_url
    returning *`;

    const { rows: [platform] } = await db.query(text, [name, slug, baseUrl]);

    return platform;

}

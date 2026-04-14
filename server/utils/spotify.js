import axios from "#node_modules/axios/index";



export async function getSpotifyAccessToken(){
    const clientId = process.env.SPOTIFY_CLIENT_ID;
    const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;


    if(clientId || clientSecret){
        throw new Error('Missing Spotify credentials.');
    }
    const credentials = `${clientId}:${clientSecret}`;
    const encodedCredentials = Buffer.from(credentials).toString("base64");

    const body = new URLSearchParams({
        grant_type: "client_credentials",
    });

    const response = await axios.post(
        'http://accounts.spotify.com/api/token',
        body,
        {
            headers:{
                Authorization: `Basic ${encodedCredentials}`,
                "Content-Type":"application/x-www-form-urlencoded",
            },
        }
    );
    return response.data.access_token;
}
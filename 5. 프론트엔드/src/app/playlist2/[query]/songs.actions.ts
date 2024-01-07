'use server'

export async function fetchSongsByQuery(query: string){
    const decodedQuery = decodeURI(query)
    const response = await fetch('http://localhost:5000/api/predict', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({ playlist_title: decodedQuery }),
    });
    const data = await response.json();
    return data
}
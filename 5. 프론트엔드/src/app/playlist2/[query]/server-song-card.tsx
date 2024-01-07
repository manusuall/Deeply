import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import Link from "next/link";
import { searchMusics } from 'node-youtube-music';
// https://www.npmjs.com/package/youtube-music-api

async function getThumbnailForKeyword(keyword: string) {
    const apiUrl = 'https://www.googleapis.com/youtube/v3/search';
    const apiKey = ''; // Replace with your actual API key

    const queryString = `part=snippet&q=${encodeURIComponent(keyword)}&key=${apiKey}&maxResults=1`;

    const response = await fetch(`${apiUrl}?${queryString}`);
    const json = await response.json();

    console.log(json)

    if (json.items && json.items.length > 0) {
        const thumbnailUrl = json.items[0].snippet.thumbnails.default.url;
        return thumbnailUrl;
    }

    return null;
}



export default async function ServerSongCard({ song }: {song: string}) {
    // const songs = await searchMusics(song)
    const thumbnail = await getThumbnailForKeyword(song)
    return <>
    <Link href={`https://www.youtube.com/results?search_query=${song}`} target="_bla">
    <Card className='flex p-0'>
        <div className="w-20 bg-neutral-900">
        {
            thumbnail
                ? <img src={`${thumbnail}`} alt='img' className='object-cover h-full w-full'/>
                : <div className='rounded-lg bg-neutral-900' />
        }
        </div>
        <CardHeader className='px-0 ml-4 py-4'>
            <CardTitle>{song}</CardTitle>
            <CardDescription>DeepPly에서 생성된 음악입니다.</CardDescription>
        </CardHeader>
    </Card>
    </Link>
    </>
}



        
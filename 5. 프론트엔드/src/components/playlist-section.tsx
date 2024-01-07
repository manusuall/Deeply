
import PlaylistCard from "@/components/playlist-card"
import { searchPlaylists } from "node-youtube-music"

export default async function PlaylistSection({search} : { search: string }) {
    const playlists = await searchPlaylists(search ?? '행복한 하루')
    return <main className='py-4'>
        <section className="grid grid-cols-3 md:grid-cols-6 gap-2">
            { playlists.splice(0,6).map((playlist, idx) => <PlaylistCard key={idx} playlist={playlist}/>)}
        </section>
    </main>
}
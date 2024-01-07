'use client'

import Link from "next/link"
import { motion } from "framer-motion";
import { Badge } from "./ui/badge";

export default function PlaylistCard({playlist}: {playlist: any}) {
    return <Link href={`/playlist/${playlist.playlistId}`}  key={playlist.playlistId}>
    <motion.div className="aspect-square flex flex-col"  animate={{opacity:1}} initial={{opacity:0}} transition={{delay: 1.5, duration: 1}}>
        <motion.img src={playlist.thumbnailUrl} alt={playlist.title} className="h-full"/>
        <Badge variant={'secondary'} className="truncate text-purple-400 mt-4 text-center">{playlist.title}</Badge>
    </motion.div>
</Link>
}
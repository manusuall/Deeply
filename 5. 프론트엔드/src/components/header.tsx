import Image from "next/image";
import Link from "next/link";
import { searchPlaylists } from "node-youtube-music";

export default async function Header() {

  return <div className="fixed top-0 w-full">
    <nav className="container py-8">
        <Link href='/'>
            <Image src='/logo.svg' alt='logo' width={148} height={96}/>
        </Link>
    </nav>
    </div>
}
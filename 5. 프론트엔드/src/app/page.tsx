import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import playlists from "@/lib/songs_data_converted.json"
import Link from "next/link";
import PlaylistPage from "../components/playlist-section";
import { Play } from "next/font/google";
import Hero from "@/components/hero";
import FormAnimate from "@/components/form-animate";
import SlideText from "@/components/slide-text";



export default function Home({ searchParams }: {  searchParams: { q: string } }) {
  const { q } = searchParams;
  return (
    <main className="container overflow-hidden md:h-screen pt-24 flex flex-col justify-evenly">
      <section className="flex flex-col gap-16 py-16">
        <Hero/>
        <FormAnimate/>
      </section>
      <div className="flex flex-col gap-1 ">
        <SlideText text="이런 플레이리스트 어때요?" delay={1}/>
        <section className="flex flex-col gap-1">
          <PlaylistPage search={q}/>
        </section>
      </div>
    </main>
  )
}

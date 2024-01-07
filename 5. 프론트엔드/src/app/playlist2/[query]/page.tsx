
// 'use client'

import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { fetchSongsByQuery } from "./songs.actions"
import { searchMusics } from 'node-youtube-music';
import ServerSongCard from "./server-song-card";
import SlideText from "@/components/slide-text";

export default async function Page({ params } : { params : {query: string}}){
  const { query } = params
  const results = await fetchSongsByQuery(query)
  const decodedQuery = decodeURI(query)

  return <>
  <div className='container mx-auto py-24'>
    {
      results.length !== 0
        ? <SlideText text={`DeepPly가 생성한  '${decodedQuery}' 플레이리스트입니다.`} delay={1}/>
        : <SlideText text='플레이리스트 생성에 실패했어요 :(' delay={0.8}/>
    }
    <div className='flex flex-col gap-4 mt-4'>
      {
        results['song_titles'].map((e: any, idx: number) => <>
          <ServerSongCard song={e} key={idx}/>
          </>
          
        )
      }
    </div>
  </div>

  </>

}
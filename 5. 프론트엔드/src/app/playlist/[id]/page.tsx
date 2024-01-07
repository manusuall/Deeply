import MusicDelayedInsertCard from '@/components/music-delayed-insert-card';
import { Card } from '@/components/ui/card'
import { MusicVideo, PageType, listMusicsFromPlaylist} from 'node-youtube-music'

async function listMusics(id : any) {
    const response = await fetch(
        'https://music.youtube.com',
        {
            headers: {
                'content-type': 'application/json',
            },
            body: JSON.stringify({
                context: {
                    client: {
                        clientName: 'WEB_REMIX',
                        clientVersion: '0.1',
                        hl: 'ko',
                        gl: 'KR',
                        experimentIds: [],
                    },
                    capabilities: {},
                    request: {
                        internalExperimentFlags: [
                            {
                                key: 'force_music_enable_outertube_playlist_detail_browse',
                                value: 'true',
                            },
                        ],
                        sessionIndex: {},
                    },
                    user: {
                        enableSafetyMode: false,
                    },
                    clientScreenNonce: '',
                },
                browseId: id,
            }),
            method: 'POST',
        })
        const json = await response.json();

        const musicList = parseListMusicsFromPlaylistBody(json)
        return musicList
}

export default async function Page( {params}: {params: {id: string}}) {
    const {id} = params
    const musics = await listMusics(id)

    return <main className="container py-32 h-screen flex flex-col">
        <section className="flex flex-col gap-4 my-24">
            <h4 className="text-2xl font-bold">플레이리스트 DeepPly와 함께하세요!</h4>
        </section>
        <article className='flex flex-col gap-2'>
            {/* music listtile */}
            <MusicDelayedInsertCard musics={musics}/>
        </article>

    </main>

}

const parseMusicInPlaylistItem = (content: {
    musicResponsiveListItemRenderer: {
      thumbnail: {
        musicThumbnailRenderer: {
          thumbnail: {
            thumbnails: { url: string }[];
          };
        };
      };
      fixedColumns: {
        musicResponsiveListItemFixedColumnRenderer: {
          text: { runs: { text: string }[] };
        };
      }[];
      flexColumns: {
        musicResponsiveListItemFlexColumnRenderer: {
          text: {
            runs: {
              navigationEndpoint: { watchEndpoint: { videoId: string } };
              text: string;
            }[];
          };
        };
      }[];
      badges: {
        musicInlineBadgeRenderer: {
          icon: {
            iconType: string;
          };
        };
      }[];
    };
  }): MusicVideo | null => {
    let youtubeId;
    try {
      youtubeId =
        content.musicResponsiveListItemRenderer.flexColumns[0]
          .musicResponsiveListItemFlexColumnRenderer.text.runs[0]
          .navigationEndpoint.watchEndpoint.videoId;
    } catch (err) {}
  
    let title;
    try {
      title =
        content.musicResponsiveListItemRenderer.flexColumns[0]
          .musicResponsiveListItemFlexColumnRenderer.text.runs[0].text;
    } catch (err) {}
  
    let artists;
    try {
      artists = listArtists(
        content.musicResponsiveListItemRenderer.flexColumns[1]
          .musicResponsiveListItemFlexColumnRenderer.text.runs
      );
    } catch (err) {}
  
    let album;
    try {
      album =
        content.musicResponsiveListItemRenderer.flexColumns[2]
          .musicResponsiveListItemFlexColumnRenderer.text.runs[0].text;
    } catch (err) {}
  
    let thumbnailUrl;
    try {
      thumbnailUrl =
        content.musicResponsiveListItemRenderer.thumbnail.musicThumbnailRenderer.thumbnail.thumbnails.pop()
          ?.url;
    } catch (err) {}
  
    let duration;
    try {
      duration = {
        label:
          content.musicResponsiveListItemRenderer.fixedColumns[0]
            .musicResponsiveListItemFixedColumnRenderer.text.runs[0].text,
        totalSeconds: parseDuration(
          content.musicResponsiveListItemRenderer.fixedColumns[0]
            .musicResponsiveListItemFixedColumnRenderer.text.runs[0].text
        ),
      };
    } catch (err) {}
  
    let isExplicit;
    try {
      isExplicit = content.musicResponsiveListItemRenderer.badges.some(
        (badge) => badge.musicInlineBadgeRenderer.icon.iconType === 'EXPLICIT'
      );
    } catch (err) {
      isExplicit = false;
    }
    return {
      youtubeId,
      title,
      artists,
      album,
      thumbnailUrl,
      duration,
      isExplicit,
    };
  };

  const listArtists = (data: any[]): { name: string; id?: string }[] => {
    const artists: { name: string; id?: string }[] = [];
    data.forEach((item) => {
      if (
        item.navigationEndpoint &&
        item.navigationEndpoint.browseEndpoint
          .browseEndpointContextSupportedConfigs.browseEndpointContextMusicConfig
          .pageType === PageType.artist
      ) {
        artists.push({
          name: item.text,
          id: item.navigationEndpoint.browseEndpoint.browseId,
        });
      }
    });
    if (artists.length === 0) {
      const delimiterIndex = data.findIndex((item) => item.text === ' • ');
      if (delimiterIndex !== -1) {
        data
          .filter((item, index) => index < delimiterIndex && item.name !== ' & ')
          .forEach((item) => artists.push({ name: item.text }));
      }
    }
    return artists;
  };

  const parseDuration = (durationLabel: string): number => {
    const durationList = durationLabel.split(':');
    return durationList.length === 3
      ? parseInt(durationList[0], 10) * 3600 +
          parseInt(durationList[1], 10) * 60 +
          parseInt(durationList[2], 10)
      : parseInt(durationList[0], 10) * 60 + parseInt(durationList[1], 10);
  };
  
  const parseListMusicsFromPlaylistBody = (body: {
    contents: {
      singleColumnBrowseResultsRenderer: {
        tabs: {
          tabRenderer: {
            content: {
              sectionListRenderer: {
                contents: {
                  musicPlaylistShelfRenderer?: { contents: [] };
                  musicCarouselShelfRenderer: { contents: [] };
                }[];
              };
            };
          };
        }[];
      };
    };
  }): MusicVideo[] => {
    const content =
      body.contents?.singleColumnBrowseResultsRenderer?.tabs?.[0].tabRenderer.content
        .sectionListRenderer.contents[0];
    
    if (!content || (!content.musicPlaylistShelfRenderer && !content.musicCarouselShelfRenderer)) {
    console.error("Invalid content structure in response");
    return [];
  }    

    const { contents } =
      content?.musicPlaylistShelfRenderer ?? content?.musicCarouselShelfRenderer;
    const results: MusicVideo[] = [];
  
    contents?.forEach((content) => {
      try {
        const song = parseMusicInPlaylistItem(content);
        if (song) {
            results.push(song);
        }
      } catch (e) {
        console.error("Error parsing music item:", e);
      }
    });
    return results;
  };
import logo from './assets/logo.svg';
import './App.css';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import swal from 'sweetalert';
import type { AxiosResponse } from 'axios';
import type {
  PagingSavedTrackObject,
  SavedTrackObject,
  TrackObject,
} from './lib/spotify/model';
import { getUsersSavedTracks } from './lib/spotify/api/tracks/tracks';

const spotifyApiToken =
  'BQBWcNKR80VEYh9CN4NuPzl27YlUwl238kjGRZ1qG0sJsqR3SLTIYK940lmfksZCWf6-9gsstBIdMh_aYtTyiaTNlrsDOJohFTyK1W7fa2U34EWmCLCP9RB7quIXYt7J_6_e3yaeISbv3GNTYDZqjdmGtfV0GfPD6TQT3VOL8O6qe3H5HPcVkSMeTW1V83umBxwmoibWpaZy51dk_TqZvmUAgDDWIqwqtuMmLSOgh_o4fYNy61E4U_UolLrQtbZ3-v4BWvbewsochcYQe7IVkyZcVdJ-LPdbw25FiG_lUVZ-haifzkYZZUk42LyeBhKg0ybkjIvvdcDIZQcDSy4J0ME4eATzdIrWfGnLTNJlB2Wl5ebhMw0l4mkj7_nmut3hcORX3wIhxA';

// Deezer access token (optionnel - l'API publique ne le requiert pas pour /search)
const deezerApiToken = '';

const pickRandomTrack = (tracks: any[]) => {
  if (tracks.length === 0) return null;
  return tracks[Math.floor(Math.random() * tracks.length)]!;
};

const shuffleArray = (tracks: any[]) => {
  return tracks.sort(() => Math.random() - 0.5);
};

const getDeezerPreview = async (
  trackName: string,
  artistName: string,
): Promise<string | null> => {
  try {
    const query = encodeURIComponent(`${artistName} ${trackName}`);
    // Utiliser le proxy Vite configuré
    const url = `/api/deezer/search?q=${query}`;
    const response = await fetch(url);
    const data = await response.json();

    if (data.data && data.data.length > 0) {
      return data.data[0].preview;
    }
    return null;
  } catch (error) {
    console.error('Erreur lors de la recherche sur Deezer:', error);
    return null;
  }
};

const AlbumCover = ({ track }: { track: TrackObject | undefined }) => {
  return (
    <img
      src={track?.album?.images?.[0]?.url ?? ''}
      style={{ width: 200, height: 200 }}
    />
  );
};

const TrackButton = ({
  track,
  onClick,
}: {
  track: SavedTrackObject;
  onClick: () => void;
}) => {
  return (
    <div className="App-track-button">
      <AlbumCover track={track.track} />
      <button onClick={onClick}>{track.track?.name}</button>
    </div>
  );
};

const App = () => {
  const getTracks = async (): Promise<SavedTrackObject[]> => {
    const res: AxiosResponse<PagingSavedTrackObject> =
      await getUsersSavedTracks(
        {},
        { headers: { Authorization: `Bearer ${spotifyApiToken}` } },
      );
    return res.data.items ?? [];
  };

  const {
    data: tracks = [],
    isSuccess,
    isLoading,
  } = useQuery<SavedTrackObject[]>({
    queryKey: ['tracks'],
    queryFn: getTracks,
  });

  const [currentTrack, setCurrentTrack] = useState<
    SavedTrackObject | undefined
  >(undefined);
  const [trackChoices, setTrackChoices] = useState<SavedTrackObject[]>([]);
  const [previewUrl, setPreviewUrl] = useState<string>('');

  useEffect(() => {
    if (!tracks || tracks.length < 3) {
      return;
    }

    const rightTrack = pickRandomTrack(tracks);
    if (!rightTrack) return;

    setCurrentTrack(rightTrack);

    // Filtrer pour exclure la bonne réponse
    const availableTracks = tracks.filter(
      t => t.track?.id !== rightTrack.track?.id,
    );

    // Choisir 2 mauvaises réponses uniques
    const wrongTracks: SavedTrackObject[] = [];
    const usedIds = new Set<string>();

    while (wrongTracks.length < 2 && availableTracks.length > 0) {
      const track = pickRandomTrack(availableTracks);
      if (track && track.track?.id && !usedIds.has(track.track.id)) {
        usedIds.add(track.track.id);
        wrongTracks.push(track);
      }
    }

    const choices = shuffleArray([rightTrack, ...wrongTracks]);
    setTrackChoices(choices);
  }, [tracks]);

  useEffect(() => {
    const fetchDeezerPreview = async () => {
      if (!currentTrack?.track) return;

      const trackName = currentTrack.track.name ?? '';
      const artistName = currentTrack.track.artists?.[0]?.name ?? '';

      const preview = await getDeezerPreview(trackName, artistName);
      if (preview) {
        setPreviewUrl(preview);
      }
    };

    fetchDeezerPreview();
  }, [currentTrack]);

  const checkAnswer = (track: any) => {
    if (track.track?.id == currentTrack?.track?.id) {
      swal('Bravo !', "C'est la bonne réponse", 'success');
    } else {
      swal('Dommage !', "Ce n'est pas la bonne réponse", 'error');
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h1 className="App-title">Bienvenue sur le blind test</h1>
      </header>
      <div className="App-images">
        {isLoading || !isSuccess ? (
          'Loading...'
        ) : (
          <div>
            <div>
              {previewUrl ? (
                <audio key={previewUrl} src={previewUrl} controls autoPlay />
              ) : (
                <p>Chargement de l'extrait audio...</p>
              )}
            </div>
          </div>
        )}
      </div>
      <div className="App-buttons">
        {trackChoices
          .filter(track => track?.track)
          .map((track, index) => (
            <TrackButton
              key={index}
              track={track}
              onClick={() => checkAnswer(track)}
            />
          ))}
      </div>
    </div>
  );
};

export default App;

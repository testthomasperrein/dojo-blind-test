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

const apiToken =
  'BQCrq2xmH59ZrnMJDoC4oWmx-OX_Vue6HMs9rI3bNN5Q5t4RXInSu5pLONqxXwYjyTMn4qTMZDrsgpdwoNOGQ2AqIC20aauYRsTHG2b7NQhbsoH9A6jWF1839HBfOdZtKdVJDE4zYe0xjbkgLJ1M_XftSqIAHkuDNhwCXEAPXcuYfzlnXF683n6lLbFRESHvCmsxOApkylmzOLybPlZQLS6-z2VMEI95-7oLGnX2U0nPh3is02ehbtk1XEVBTydHrDZy9GC3dB9VgJC5ad1yX1WZRoulM3onCe_J7hPc0Wt-tzTGh-9kbvOsXqaWL-fsI6sDPAUsTtJ_ZT_nLQHp9GzQpXAuw2grAMHeqwoBtHqzupXCgnzm_-yb2zfTa3rJ9erhnhPUpg';

const pickRandomTrack = (tracks: any[]) => {
  return tracks[Math.floor(Math.random() * tracks.length)]!;
};

const shuffleArray = (tracks: any[]) => {
  return tracks.sort(() => Math.random() - 0.5);
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
        { headers: { Authorization: `Bearer ${apiToken}` } },
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

  useEffect(() => {
    if (!tracks) {
      return;
    }

    const rightTrack = pickRandomTrack(tracks);
    setCurrentTrack(rightTrack);

    const wrongTracks = [pickRandomTrack(tracks), pickRandomTrack(tracks)];
    const choices = shuffleArray([rightTrack, ...wrongTracks]);
    setTrackChoices(choices);
  }, [tracks]);

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
              <audio
                src={currentTrack?.track?.preview_url ?? ''}
                controls
                autoPlay
              />
            </div>
          </div>
        )}
      </div>
      <div className="App-buttons">
        {trackChoices.map((track, index) => (
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

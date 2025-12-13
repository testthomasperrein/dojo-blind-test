import { EpisodeObject } from "./EpisodeObject";
import { PlaylistUserObject } from "./PlaylistUserObject";
import { TrackObject } from "./TrackObject";

export type PlaylistTrackObject = {
added_at?: string;
added_by?: PlaylistUserObject;
is_local?: boolean;
track?: TrackObject | EpisodeObject;
};

import { ContextObject } from "./ContextObject";
import { DisallowsObject } from "./DisallowsObject";
import { EpisodeObject } from "./EpisodeObject";
import { TrackObject } from "./TrackObject";

export type CurrentlyPlayingObject = {
  context?: ContextObject;
  timestamp?: number;
  progress_ms?: number;
  is_playing?: boolean;
  item?: TrackObject | EpisodeObject;
  currently_playing_type?: string;
  actions?: DisallowsObject;
};

import { EpisodeObject } from "./EpisodeObject";
import { TrackObject } from "./TrackObject";

export type QueueObject = {
  currently_playing?: TrackObject | EpisodeObject;
  queue?: TrackObject | EpisodeObject[];
};

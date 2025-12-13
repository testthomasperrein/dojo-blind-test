import { ContextObject } from "./ContextObject";
import { DeviceObject } from "./DeviceObject";
import { DisallowsObject } from "./DisallowsObject";
import { EpisodeObject } from "./EpisodeObject";
import { TrackObject } from "./TrackObject";

export type CurrentlyPlayingContextObject = {
device?: DeviceObject;
repeat_state?: string;
shuffle_state?: boolean;
context?: ContextObject;
timestamp?: number;
progress_ms?: number;
is_playing?: boolean;
item?: TrackObject | EpisodeObject;
currently_playing_type?: string;
actions?: DisallowsObject;
};

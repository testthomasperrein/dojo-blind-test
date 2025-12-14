import { ContextObject } from "./ContextObject";
import { TrackObject } from "./TrackObject";

export type PlayHistoryObject = {
  track?: TrackObject;
  played_at?: string;
  context?: ContextObject;
};

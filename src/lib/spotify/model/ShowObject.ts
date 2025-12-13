import { PagingSimplifiedEpisodeObject } from "./PagingSimplifiedEpisodeObject";
import { ShowBase } from "./ShowBase";

export type ShowObject = ShowBase & {
episodes: PagingSimplifiedEpisodeObject;
};

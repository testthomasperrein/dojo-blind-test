import { ArtistObject } from "./ArtistObject";
import { CursorPagingObject } from "./CursorPagingObject";

export type CursorPagingSimplifiedArtistObject = CursorPagingObject & {
  items?: ArtistObject[];
};

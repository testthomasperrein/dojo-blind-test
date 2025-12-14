import { ArtistObject } from "./ArtistObject";
import { PagingObject } from "./PagingObject";

export type PagingArtistObject = PagingObject & {
  items?: ArtistObject[];
};

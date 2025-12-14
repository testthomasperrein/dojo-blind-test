import { ArtistDiscographyAlbumObject } from "./ArtistDiscographyAlbumObject";
import { PagingObject } from "./PagingObject";

export type PagingArtistDiscographyAlbumObject = PagingObject & {
  items?: ArtistDiscographyAlbumObject[];
};

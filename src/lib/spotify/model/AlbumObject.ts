import { AlbumBase } from "./AlbumBase";
import { CopyrightObject } from "./CopyrightObject";
import { ExternalIdObject } from "./ExternalIdObject";
import { PagingSimplifiedTrackObject } from "./PagingSimplifiedTrackObject";
import { SimplifiedArtistObject } from "./SimplifiedArtistObject";

export type AlbumObject = AlbumBase & {
  artists?: SimplifiedArtistObject[];
  tracks?: PagingSimplifiedTrackObject;
  copyrights?: CopyrightObject[];
  external_ids?: ExternalIdObject;
  genres?: string[];
  label?: string;
  popularity?: number;
};

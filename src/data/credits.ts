import type { ImageSourcePropType } from 'react-native';

/** A bundled image and the attribution its licence requires. */
export interface Credit {
  source: ImageSourcePropType;
  title: string;
  artist: string;
  licence: string;
  licenceUrl: string;
  page: string;
}

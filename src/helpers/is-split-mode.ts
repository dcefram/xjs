import { IInternal } from 'internal/types';

const isSplitMode = async (internal: IInternal): Promise<boolean> =>
  Boolean(Number(await internal.exec('GetGlobalProperty', 'splitmode')));

export default isSplitMode;

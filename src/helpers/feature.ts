import Internal from '../internal';

export const isSplitMode = async (internal: Internal): Promise<Boolean> =>
  Boolean(Number(await internal.exec('GetGlobalProperty', 'splitmode')));

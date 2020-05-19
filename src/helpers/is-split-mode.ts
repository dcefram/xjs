import Internal from '../internal';

const isSplitMode = async (internal: Internal): Promise<Boolean> =>
  Boolean(Number(await internal.exec('GetGlobalProperty', 'splitmode')));

export default isSplitMode;

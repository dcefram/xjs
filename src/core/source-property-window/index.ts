import configure from './configure';
import resize from './resize';
import setCustomTabs from './set-custom-tabs';
import setMode from './set-mode';
import setTabsOrder from './set-tabs-order';
import setVisible from './set-visible';
import send from './send';
import subscribe from './subscribe';

const sourcePropertyWindow = {
  configure,
  resize,
  setCustomTabs,
  setMode,
  setTabsOrder,
  setVisible,
  emit: send,
  on: subscribe,
};

export default sourcePropertyWindow;

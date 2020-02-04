import setMode, { MODES } from './set-mode';
import setCustomTabs from './set-custom-tabs';
import setTabsOrder from './set-tabs-order';
import setVisible from './set-visible';

export interface Config {
  mode: MODES;
  customTabs: string[];
  tabOrder: string[];
}

export default function(config: Config) {
  setMode(config.mode);
  setCustomTabs(config.customTabs);
  setTabsOrder(config.tabOrder);
  setVisible(true);
}

import getMode from './get-mode';
import setSize, {
  setMinimumWindowSize as setMinimumSize,
  setMaximumWindowSize as setMaximumSize,
} from './set-size';
import setStyle from './set-style';
import setTitle from './set-title';
import close from './close';
import minimize from './minimize';
import maximize from './maximize';
import move from './move';
export { WINDOW_STYLES } from './set-style';

const extensionWindow = {
  getMode,
  setSize,
  setMinimumSize,
  setMaximumSize,
  setStyle,
  setTitle,
  close,
  minimize,
  maximize,
  move,
};

export default extensionWindow;

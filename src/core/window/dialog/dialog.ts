import Environment from '../../../helpers/environment';
import Xjs from '../../xjs';
import Rectangle from '../../../utils/rectangle';
import calculateFlags from './calculateFlag';

export interface Config {
  url: string;
  title?: string;
  width?: number;
  height?: number;
  cookiePath?: string;
  autoClose?: boolean;
  showBorder?: boolean;
  isResizable?: boolean;
  isMinimizeActive?: boolean;
  isMaximizeActive?: boolean;
  script?: string;
}

// TODO: Add handler for custom JS, Remote, Proxy

function dialog(xjs: Xjs, config: Config) {  
  const exec = xjs._internal.exec;
  const url = config.url;
  const title = config.title || '';
  const cookiePath = config.cookiePath
    ? `<configuration cookiepath="${config.cookiePath}" />`
    : '';
  const size = Rectangle.fromDimensions(
    config.width || 655,
    config.height || 770
  );
  const calculatedFlag = calculateFlags(
    config.title,
    config.showBorder || false,
    config.isResizable || false,
    config.isMinimizeActive || false,
    config.isMaximizeActive || false
  );
  const autoClose = config.autoClose || false;
  const script = config.script || '';

  let windowParams = `cx:${config.width || 655}&cy:${config.height || 770}`;  
  if (calculatedFlag) {
    windowParams = `${windowParams}&flags:${calculatedFlag}`;
  }

  if (autoClose) {
    if (Environment.isSourceProps) {
      throw new Error('Auto dialogs are not available for config windows.');
    }

    const propertyNotAllowed = [
      'title',
      'showBorder',
      'isResizable',
      'isMinimizeActive',
      'isMaximizeActive',
      'cookiePath',
    ];

    for (let i = 0; i < propertyNotAllowed.length; i++) {
      const prop = propertyNotAllowed[i];
      if (config[prop]) {
        throw new Error(`Autoclosing dialogs cannot have a ${prop} property`);
      }
    }
  }

  if (Environment.isSourcePlugin) {
    throw new Error('Dialogs are not available for source plugins.');
  }

  function show(parseJSON: boolean = true): Promise<any> {
    return new Promise(async resolve => {
      const eventListener = (e: any) => {        
        e.target.removeEventListener(e.type, eventListener);

        const result = e.detail;

        // parse result if a valid JSON
        if (parseJSON) {
          try {
            let parseResult = JSON.parse(result);
            resolve(parseResult);
          } catch (e) {}
        }

        resolve(result);
      };

      document.addEventListener('xsplit-dialog-result', eventListener);

      if (autoClose) {
        await exec('NewAutoDialog', url, '', size.toDimensionString());
      } else {       
        const result = await exec(
          'NewDialog2',
          url,
          '',
          windowParams,
          title,
          cookiePath,
          script
        );

        // parse result if a valid JSON
        if (parseJSON) {
          try {
            let parseResult = JSON.parse(result);
            resolve(parseResult);
          } catch (e) {            
          }
        }

        resolve(result);        
      }
    });
  }

  function close(): Promise<any> {
    return new Promise(async resolve => resolve(exec('CloseDialog')));
  }

  return {
    show,
    close,
  };
}

export default dialog;

const oldOnDialogResult = window.OnDialogResult;
window.OnDialogResult = function(result: any) {
  if (Environment.isSourceProps || Environment.isExtension) {
    document.dispatchEvent(
      new CustomEvent('xsplit-dialog-result', {
        detail: result,
      })
    );
  }
  if (typeof oldOnDialogResult === 'function') {
    oldOnDialogResult(result);
  }
};

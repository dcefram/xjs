import Environment from 'helpers/environment';
import registerCallbacks from 'helpers/register-callback';
import Xjs from 'core/xjs';
import Internal from 'internal';
import { Config } from './types';

const FLAGS = {
  showBorder: 0b1,
  showTitlebar: 0b10,
  resizable: 0b100,
  showMinimize: 0b1000,
  showMaximize: 0b10000,
};

/**
 * Open a dialog window in source property window or extension window
 *
 * Example:
 * ```
 * import Xjs from '@dcefram/xjs';
 * import Dialog from '@dcefram/xjs/core/dialog';
 *
 * const xjs = new Xjs();
 * const dialog = new Dialog(xjs);
 *
 * dialog.setConfig({
 *   url: 'https://google.com',
 *   title: 'Dialog title',
 *   width: 100,
 *   height: 100,
 *   cookiePath: '',
 *   autoClose: false,
 *
 *   // Window flags
 *   showBorder: false,
 *   resizable: false,
 *   showMinimize: false,
 *   showMaximize: false,
 * });
 *
 * dialog.show();
 * ```
 */
export default class Dialog {
  private internal: Internal;
  private config: Config;
  private callback: (result: string) => void;

  constructor({ internal }: Xjs, config?: Config) {
    if (Environment.isSourcePlugin) {
      throw new Error('Dialogs cannot be used in source plugins');
    }

    this.internal = internal;

    if (config) {
      this.config = config;
    }

    this.initializeCallback();
  }

  /**
   * Set the configuration of the dialog
   *
   * @param config Dialog configuration object
   */
  setConfig(config: Config): void {
    this.config = config;
  }

  /**
   * Show the dialog
   *
   * @returns Promise<string> The value returned by the dialog. Useful for auth dialogs.
   */
  show(): Promise<string> {
    return new Promise((resolve) => {
      const { config } = this;

      this.callback = (result: string) => resolve(result);

      if (config.autoClose) {
        this.internal.exec(
          'NewAutoDialog',
          config.url,
          '',
          `${config.width},${config.height}`
        );
      } else {
        const flags = this.calculateFlags();
        const params = this.generateWindowParams(flags);

        this.internal.exec(
          'NewDialog2',
          config.url,
          '', // @TODO: Figure out what is this parameter about
          params,
          config.title || '',
          typeof config.cookiePath === 'undefined'
            ? ''
            : `<configuration cookiepath="${config.cookiePath}" />`,
          typeof config.script === 'undefined' ? '' : config.script
        );
      }
    });
  }

  close(): Promise<unknown> {
    return this.internal.exec('CloseDialog');
  }

  private calculateFlags() {
    let flag = Object.keys(FLAGS).reduce((val, key) => {
      if (this.config[key]) {
        return val | FLAGS[key];
      }

      return val;
    }, 0);

    if (
      this.config.title ||
      this.config.showMinimize ||
      this.config.showMaximize
    ) {
      flag |= FLAGS.showTitlebar;
    }

    if (this.config.isResizable) {
      flag |= FLAGS.resizable;
    }

    return flag;
  }

  private generateWindowParams(flags: number) {
    const { width, height } = this.config;
    let params = '';

    if (typeof width !== 'undefined' || typeof height !== 'undefined') {
      params = `cx:${width}&cy:${height}`;
    }

    if (flags) {
      params += `&flags:${flags}`;
    }

    return params;
  }

  private initializeCallback() {
    registerCallbacks({
      OnDialogResult: (result: string) => {
        if (
          (Environment.isSourceProps || Environment.isExtension) &&
          typeof this.callback === 'function'
        ) {
          this.callback(result);
        }
      },
      OnDialogBeforeNavigation: () => {
        // Do nothing
      },
      OnDialogLoadStart: () => {
        // Do nothing
      },
      OnDialogTitleChange: () => {
        // Do nothing
      },
      OnDialogLoadEnd: () => {
        // Do nothing
      },
    });
  }
}

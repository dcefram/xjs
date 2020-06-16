export interface Config {
  url: string;
  title?: string;
  width?: number;
  height?: number;
  cookiePath?: string;
  script?: string;
  autoClose?: boolean;

  // Flags
  showBorder?: boolean;
  showMinimize?: boolean;
  showMaximize?: boolean;
  isResizable?: boolean;
}

class Environment {
  static isSourcePlugin =
    typeof window !== 'undefined' &&
    window.external &&
    window.external['GetConfiguration'] !== undefined;

  static isSourceProps =
    typeof window !== 'undefined' &&
    window.external &&
    window.external['GetConfiguration'] === undefined &&
    window.external['GetViewId'] !== undefined &&
    window.external['GetViewId']() !== undefined;

  static isExtension =
    typeof window !== 'undefined' &&
    window.external &&
    window.external['GetConfiguration'] === undefined &&
    window.external['GetViewId'] !== undefined &&
    window.external['GetViewId']() === undefined;
}

export default Environment;

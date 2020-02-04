class Environment {
  static isSourcePlugin =
    window.external && window.external['GetConfiguration'] !== undefined;

  static isSourceProps =
    window.external &&
    window.external['GetConfiguration'] === undefined &&
    window.external['GetViewId'] !== undefined &&
    window.external['GetViewId']() !== undefined;

  static isExtension =
    window.external &&
    window.external['GetConfiguration'] === undefined &&
    window.external['GetViewId'] !== undefined &&
    window.external['GetViewId']() === undefined;
}

export default Environment;

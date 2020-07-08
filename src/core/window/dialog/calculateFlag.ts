export default function calculateFlags(
  title: string,
  showBorder: boolean,
  isResizable: boolean,
  isMinimize: boolean,
  isMaximize: boolean
): String {
  let flags = 0;
  if (showBorder) {
    flags += 1;
  }
  if (isResizable) {
    flags += 4;
  }
  if (isMinimize) {
    flags += 8;
  }
  if (isMaximize) {
    flags += 16;
  }

  if (title || isMinimize || isMaximize) {
    flags += 2;
  }

  return String(flags);
}

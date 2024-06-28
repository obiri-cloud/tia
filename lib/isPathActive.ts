export function isActive(path: string, currentPath: string, isExact?: boolean) {
    if (isExact) {
      return currentPath === path;
    }
  
    return currentPath.startsWith(path);
  }
  
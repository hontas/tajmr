export function getDisplayname(Component) {
  return Component.displayName || Component.name || 'Component';
}

export function renderView(view) {
  if (view._isRendered) {
    return;
  }

  view.render();
  view._isRendered = true;
}

export function renderView(view) {
  if (view._isRendered) {
    return;
  }

  view.render();
  view._isRendered = true;
}

export function destroyView(view, disableDetachEvents) {
  if (view.destroy) {
    // Attach flag for public destroy function internal check
    view._disableDetachEvents = disableDetachEvents;
    view.destroy();
    return;
  }

  const shouldTriggerDetach = view._isAttached && !disableDetachEvents;

  if (shouldTriggerDetach) {
    view.triggerMethod('before:detach', view);
  }

  view.remove();

  if (shouldTriggerDetach) {
    view._isAttached = false;
    view.triggerMethod('detach', view);
  }

  view._isDestroyed = true;
}

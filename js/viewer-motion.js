/* Direct manipulation for the two image viewers. Navigation stays in their own controllers. */
(() => {
  'use strict';
  const ease = 'cubic-bezier(.19,1,.22,1)';
  const identity = 'translate3d(0,0,0) rotate(0deg) scale(1)';

  function create({dialog, stage, image, reduced, onStep}) {
    if (!dialog || !stage || !image) return null;
    let pointer = null;
    let origin = null;
    let originRect = null;
    let draggedX = 0;
    let suppressUntil = 0;
    let pendingLoad = null;
    let closeDone = null;
    let closing = false;
    let animations = [];
    let ghosts = [];
    const contacts = new Set();
    stage.classList.add('has-viewer-motion');

    function clearLoad() {
      if (!pendingLoad) return;
      image.removeEventListener('load', pendingLoad);
      image.removeEventListener('error', pendingLoad);
      pendingLoad = null;
    }
    function clearVisuals() {
      clearLoad();
      animations.forEach(animation => animation.cancel());
      animations = [];
      ghosts.forEach(ghost => ghost.remove());
      ghosts = [];
      image.style.removeProperty('transform');
      image.style.removeProperty('opacity');
      stage.classList.remove('is-dragging');
      draggedX = 0;
    }
    function animate(element, frames, options) {
      if (reduced() || typeof element.animate !== 'function') return null;
      const animation = element.animate(frames, {easing: ease, ...options});
      animations.push(animation);
      animation.finished.then(() => {
        animations = animations.filter(item => item !== animation);
      }).catch(() => {});
      return animation;
    }
    function whenReady(callback) {
      clearLoad();
      if (image.complete && image.naturalWidth) { callback(); return; }
      pendingLoad = event => {
        clearLoad();
        if (event.type === 'load' && dialog.open && !closing) callback();
      };
      image.addEventListener('load', pendingLoad);
      image.addEventListener('error', pendingLoad);
    }
    function release() {
      if (pointer && stage.hasPointerCapture?.(pointer.id)) {
        const id = pointer.id;
        pointer = null;
        stage.releasePointerCapture(id);
      }
      pointer = null;
    }
    function reset() {
      release();
      clearVisuals();
    }
    function visibleRect(element) {
      if (!element?.isConnected) return null;
      const rect = element.getBoundingClientRect();
      if (rect.width < 20 || rect.height < 20 || rect.bottom < 0 || rect.top > innerHeight || rect.right < 0 || rect.left > innerWidth) return null;
      return rect;
    }
    function originTransform(rect) {
      const target = image.getBoundingClientRect();
      if (!rect || target.width < 1 || target.height < 1) return null;
      // Scale the visible artwork, not the empty space around an object-fit image.
      const fit = Math.min(target.width / image.naturalWidth, target.height / image.naturalHeight);
      const artworkWidth = image.naturalWidth * fit;
      const artworkHeight = image.naturalHeight * fit;
      const scale = Math.max(.12, Math.min(1.15, rect.width / artworkWidth, rect.height / artworkHeight));
      const x = rect.left + rect.width / 2 - target.left - target.width / 2;
      const y = rect.top + rect.height / 2 - target.top - target.height / 2;
      return `translate3d(${x}px,${y}px,0) rotate(-2deg) scale(${scale})`;
    }
    function open(source) {
      // Fixing the page preserves this thumbnail's viewport position.
      closing = false;
      closeDone = null;
      reset();
      origin = source?.matches?.('img') ? source : source?.querySelector?.('img');
      originRect = visibleRect(origin);
      if (reduced()) return;
      whenReady(() => {
        const transform = originTransform(originRect);
        animate(image, [
          {opacity: .2, transform: transform || 'translate3d(0,34px,0) rotate(-1.5deg) scale(.94)'},
          {opacity: 1, transform: identity}
        ], {duration: transform ? 420 : 320});
      });
    }
    function snapshot() {
      if (!image.complete || !image.naturalWidth) return null;
      // Use a wrapper so existing selectors for the real image cannot resize this copy.
      const copy = document.createElement('span');
      copy.className = 'viewer-motion-ghost';
      copy.setAttribute('aria-hidden', 'true');
      const rect = image.getBoundingClientRect();
      const bounds = stage.getBoundingClientRect();
      copy.style.cssText = `left:${rect.left - bounds.left + stage.scrollLeft}px;top:${rect.top - bounds.top + stage.scrollTop}px;width:${rect.width}px;height:${rect.height}px;`;
      const duplicate = new Image();
      duplicate.src = image.currentSrc || image.src;
      duplicate.alt = '';
      copy.append(duplicate);
      stage.append(copy);
      ghosts.push(copy);
      return copy;
    }
    function step(direction, render) {
      if (closing || !dialog.open) return;
      const drag = draggedX;
      reset();
      const ghost = reduced() ? null : snapshot();
      if (ghost && drag) ghost.style.transform = `translate3d(${drag}px,0,0)`;
      render();
      if (reduced()) return;
      const width = stage.clientWidth;
      if (ghost) {
        const animation = animate(ghost, [
          {opacity: .85, transform: `translate3d(${drag}px,0,0) rotate(${drag / Math.max(width, 1) * 4}deg)`},
          {opacity: 0, transform: `translate3d(${-direction * width * .65}px,0,0) rotate(${-direction * 5}deg) scale(.94)`}
        ], {duration: 280});
        animation?.finished.then(() => { ghost.remove(); ghosts = ghosts.filter(item => item !== ghost); }).catch(() => {});
      }
      whenReady(() => {
        animate(image, [
          {opacity: 0, transform: `translate3d(${direction * Math.min(width * .25, 160)}px,0,0) rotate(${direction * 2.5}deg) scale(.96)`},
          {opacity: 1, transform: identity}
        ], {duration: 360});
      });
    }
    function close(finish, immediate = false) {
      if (closing && !immediate) return;
      reset();
      closing = true;
      closeDone = finish;
      const complete = () => {
        if (!closeDone) return;
        const done = closeDone;
        closeDone = null;
        closing = false;
        clearVisuals();
        done();
      };
      if (immediate || reduced() || stage.classList.contains('is-zoomed') || !image.naturalWidth || typeof image.animate !== 'function') { complete(); return; }
      const transform = originTransform(visibleRect(origin) || originRect);
      const animation = animate(image, [
        {opacity: 1, transform: identity},
        {opacity: 0, transform: transform || 'translate3d(0,40px,0) rotate(2deg) scale(.91)'}
      ], {duration: 230});
      if (animation) animation.finished.then(complete).catch(() => {});
      else complete();
    }
    function rebound() {
      const transform = image.style.transform;
      release();
      clearVisuals();
      if (transform && !reduced()) {
        animate(image, [
          {transform},
          {transform: 'translate3d(0,0,0) rotate(0deg) scale(1)', offset: .72},
          {transform: identity}
        ], {duration: 380, easing: 'cubic-bezier(.2,.9,.25,1.18)'});
      }
    }

    stage.addEventListener('pointerdown', event => {
      if (event.pointerType === 'mouse' || closing) return;
      contacts.add(event.pointerId);
      if (contacts.size > 1 || !event.isPrimary) {
        suppressUntil = performance.now() + 600;
        rebound();
        return;
      }
      if (stage.classList.contains('is-zoomed')) { rebound(); return; }
      clearVisuals();
      pointer = {id: event.pointerId, x: event.clientX, y: event.clientY, time: performance.now(), axis: null, moved: false};
    }, {passive: true});
    stage.addEventListener('pointermove', event => {
      if (!pointer || pointer.id !== event.pointerId) return;
      const dx = event.clientX - pointer.x;
      const dy = event.clientY - pointer.y;
      if (!pointer.axis && Math.max(Math.abs(dx), Math.abs(dy)) > 8) {
        pointer.axis = Math.abs(dx) > Math.abs(dy) * 1.15 ? 'x' : 'y';
        pointer.moved = true;
        suppressUntil = performance.now() + 600;
        if (pointer.axis === 'x') stage.setPointerCapture(event.pointerId);
      }
      if (pointer.axis !== 'x') return;
      event.preventDefault();
      draggedX = Math.max(-stage.clientWidth * .9, Math.min(stage.clientWidth * .9, dx));
      if (reduced()) return;
      stage.classList.add('is-dragging');
      const tilt = Math.max(-4, Math.min(4, dx / Math.max(stage.clientWidth, 1) * 5));
      image.style.transform = `translate3d(${draggedX}px,${dy * .08}px,0) rotate(${tilt}deg) scale(.99)`;
    }, {passive: false});
    function end(event, cancelled = false) {
      contacts.delete(event.pointerId);
      if (!pointer || pointer.id !== event.pointerId) return;
      const dx = event.clientX - pointer.x;
      const dy = event.clientY - pointer.y;
      const time = Math.max(1, performance.now() - pointer.time);
      if (pointer.moved || Math.abs(dx) > 8 || Math.abs(dy) > 8) suppressUntil = performance.now() + 600;
      const horizontal = pointer.axis !== 'y' && Math.abs(dx) > Math.abs(dy) * 1.4;
      const threshold = Math.min(70, Math.max(44, stage.clientWidth * .14));
      const accepted = !cancelled && horizontal && (Math.abs(dx) >= threshold || (Math.abs(dx) > 28 && Math.abs(dx) / time > .45));
      if (accepted) {
        release();
        onStep(dx < 0 ? 1 : -1);
      } else rebound();
    }
    stage.addEventListener('pointerup', event => end(event));
    stage.addEventListener('pointercancel', event => end(event, true));
    stage.addEventListener('lostpointercapture', event => {
      // An image's implicit touch capture bubbles here when capture moves to the stage.
      if (event.target === stage && pointer?.id === event.pointerId) rebound();
    });
    // Touches may leave the stage before horizontal intent has been established.
    window.addEventListener('pointerup', event => end(event));
    window.addEventListener('pointercancel', event => end(event, true));
    const suppressClick = event => {
      if (performance.now() >= suppressUntil) return;
      event.preventDefault(); event.stopImmediatePropagation();
    };
    stage.addEventListener('click', suppressClick, true);
    stage.addEventListener('dblclick', suppressClick, true);
    window.addEventListener('resize', () => {
      if (!dialog.open) return;
      if (closing) close(closeDone, true);
      else reset();
    }, {passive: true});
    let wasReduced = reduced();
    const checkMotion = () => {
      const isReduced = reduced();
      if (isReduced && !wasReduced) {
        if (closing) close(closeDone, true);
        else reset();
      }
      wasReduced = isReduced;
    };
    new MutationObserver(checkMotion).observe(document.documentElement, {attributes: true, attributeFilter: ['class']});
    matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', checkMotion);
    return {open, step, close, reset, get closing() { return closing; }};
  }
  window.CamiloViewerMotion = {create};
})();

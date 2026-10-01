(() => {
  'use strict';

  const section = document.querySelector('#entree');
  const scene = section?.querySelector('.hero-scene');
  const canvas = document.querySelector('#hero-name-canvas');
  const video = document.querySelector('#inner-film');
  const name = document.querySelector('#name');
  const letters = ['hero-camil', 'hero-o', 'hero-rivera'].map(id => document.getElementById(id));
  const root = document.documentElement;
  if (!scene || !canvas || !video || !name || letters.some(element => !element)) {
    root.classList.remove('hero-immersion-enabled');
    return;
  }
  if (!window.IntersectionObserver || !window.ResizeObserver || !window.MutationObserver || !window.Path2D ||
      !window.requestAnimationFrame || !window.cancelAnimationFrame) {
    root.classList.remove('hero-immersion-enabled');
    return;
  }
  const context = canvas.getContext('2d', { alpha: true });
  if (!context) { root.classList.remove('hero-immersion-enabled'); return; }

  const motionPreference = matchMedia('(prefers-reduced-motion: reduce)');
  const clamp = value => Math.max(0, Math.min(1, value));
  const ease = value => { const t = clamp(value); return t * t * (3 - 2 * t); };
  const between = (value, start, end) => ease((value - start) / (end - start));
  const mix = (start, end, amount) => start + (end - start) * amount;
  let reduced = motionPreference.matches || root.classList.contains('motion-reduced');
  let visible = false;
  let dialogOpen = Boolean(document.querySelector('dialog[open]'));
  let pageActive = true;
  let failed = false;
  let dirty = true;
  let metrics = [];
  let width = 0, height = 0, resolution = 1;
  let black = '#111210', white = '#f7f7f2';
  let frame = 0, videoFrame = null, fallbackFrame = 0, lastFallbackTime = 0;
  const active = () => visible && !document.hidden && !dialogOpen && pageActive && !failed;

  function setFont(item) {
    context.font = item.font;
    context.textBaseline = 'alphabetic';
    context.textAlign = 'left';
    context.fontKerning = 'normal';
    if ('letterSpacing' in context) context.letterSpacing = `${item.spacing}px`;
  }

  function measure() {
    const bounds = scene.getBoundingClientRect();
    width = bounds.width;
    height = bounds.height;
    if (width < 1 || height < 1) return false;
    // A single transparent layer, capped to four million physical pixels.
    resolution = Math.min(devicePixelRatio || 1, 2, Math.sqrt(4000000 / (width * height)));
    const physicalWidth = Math.round(width * resolution);
    const physicalHeight = Math.round(height * resolution);
    if (canvas.width !== physicalWidth || canvas.height !== physicalHeight) {
      canvas.width = physicalWidth;
      canvas.height = physicalHeight;
    }
    const palette = getComputedStyle(root);
    black = palette.getPropertyValue('--black').trim() || black;
    white = palette.getPropertyValue('--white').trim() || white;
    metrics = letters.map(element => {
      const box = element.getBoundingClientRect();
      const style = getComputedStyle(element);
      const size = parseFloat(style.fontSize);
      const item = {
        text: element.textContent,
        font: `${style.fontStyle} ${style.fontWeight} ${style.fontSize} ${style.fontFamily}`,
        size,
        spacing: parseFloat(style.letterSpacing) || 0,
        x: box.left - bounds.left,
        y: box.top - bounds.top,
        width: box.width,
        height: box.height
      };
      setFont(item);
      const text = context.measureText(item.text);
      const ascent = text.fontBoundingBoxAscent ?? size * .8;
      const descent = text.fontBoundingBoxDescent ?? size * .2;
      item.baseline = item.y + (item.height - ascent - descent) / 2 + ascent;
      item.inkTop = item.baseline - text.actualBoundingBoxAscent;
      item.inkBottom = item.baseline + text.actualBoundingBoxDescent;
      item.centerX = item.x + (text.actualBoundingBoxRight - text.actualBoundingBoxLeft) / 2;
      item.centerY = (item.inkTop + item.inkBottom) / 2;
      item.inkWidth = text.actualBoundingBoxRight + text.actualBoundingBoxLeft;
      item.inkHeight = item.inkBottom - item.inkTop;
      item.stroke = Math.max(.8, Math.min(1.9, size * .008));
      return item;
    });
    dirty = false;
    return metrics.every(item => item.inkWidth > 0 && item.inkHeight > 0);
  }

  function text(item, fill, stroke, scale = 1) {
    setFont(item);
    context.fillStyle = fill;
    context.strokeStyle = stroke;
    context.lineWidth = item.stroke / scale;
    context.lineJoin = 'round';
    if ('letterSpacing' in context || item.spacing === 0) {
      context.strokeText(item.text, item.x, item.baseline);
      context.fillText(item.text, item.x, item.baseline);
      return;
    }
    // Preserve the designed tracking on browsers without canvas letterSpacing.
    let prefix = '';
    [...item.text].forEach((letter, index) => {
      const x = item.x + context.measureText(prefix).width + index * item.spacing;
      context.strokeText(letter, x, item.baseline);
      context.fillText(letter, x, item.baseline);
      prefix += letter;
    });
  }

  function splitPath(phase) {
    const o = metrics[1], rivera = metrics[2];
    const path = new Path2D();
    const bend = Math.sin(phase) * Math.min(9, o.inkWidth * .08);
    const lowerX = rivera.x + rivera.width * .43;
    path.moveTo(-width, -height);
    path.lineTo(o.centerX + bend, -height);
    path.bezierCurveTo(o.centerX - 13 + bend, o.centerY - o.size,
      o.centerX + 8 + bend, o.centerY - o.inkHeight * .3, o.centerX, o.centerY);
    path.bezierCurveTo(o.centerX - bend, o.centerY + o.size * .35,
      lowerX - 18 - bend, rivera.centerY - rivera.size * .25, lowerX, rivera.centerY);
    path.bezierCurveTo(lowerX + 22 + bend, rivera.centerY + rivera.size * .25,
      lowerX - bend, height, lowerX, height * 2);
    path.lineTo(-width, height * 2);
    path.closePath();
    return path;
  }

  function drawWord(item, index, progress, split) {
    const departure = between(progress, .08, .46);
    const alpha = 1 - between(progress, .16, .43);
    if (alpha <= 0) return;
    const x = index === 0 ? -width * .28 * departure : width * .34 * departure;
    const y = index === 0 ? -height * .14 * departure : height * .2 * departure;
    context.save();
    context.globalAlpha = alpha;
    context.translate(x, y);
    text(item, white, black);
    context.save();
    context.clip(split);
    text(item, black, white);
    context.restore();
    context.restore();
  }

  function drawO(progress, phase) {
    const item = metrics[1];
    const passage = between(progress, .11, .68);
    // The actual lowercase o becomes the aperture. Its interior eventually
    // exceeds the viewport diagonal, so its edge leaves in every direction.
    const opening = Math.max(10, Math.min(item.inkWidth * .55, item.inkHeight * .62));
    const largestScale = Math.hypot(width, height) / opening * 1.3;
    const scale = Math.pow(largestScale, passage);
    const centering = between(progress, .1, .45);
    const x = mix(item.centerX, width * .5, centering);
    const y = mix(item.centerY, height * .5, centering);
    const bend = Math.sin(phase) * Math.min(7, item.inkWidth * .08);
    const split = new Path2D();
    split.moveTo(item.x - item.size, item.y - item.size);
    split.lineTo(item.centerX + bend, item.y - item.size);
    split.bezierCurveTo(item.centerX - item.inkWidth * .12, item.centerY - item.inkHeight * .4,
      item.centerX + item.inkWidth * .1, item.centerY + item.inkHeight * .2,
      item.centerX - bend, item.y + item.height + item.size);
    split.lineTo(item.x - item.size, item.y + item.height + item.size);
    split.closePath();
    context.save();
    context.translate(x, y);
    context.scale(scale, scale);
    context.translate(-item.centerX, -item.centerY);
    text(item, white, black, scale);
    context.clip(split);
    text(item, black, white, scale);
    context.restore();
  }

  function clearRibbon(progress, phase) {
    if (progress >= .22) return;
    // Cutting the transparent type layer lets the original film pass in front
    // of the name, without decoding or painting a second copy of the video.
    context.save();
    context.globalCompositeOperation = 'destination-out';
    context.fillStyle = '#000';
    [metrics[0], metrics[2]].forEach((item, index) => {
      const y = item.centerY + Math.sin(phase + index * 1.8) * item.inkHeight * .15;
      const amplitude = item.inkHeight * .2;
      const thickness = Math.min(7, item.size * .025) * (1 - between(progress, .06, .22));
      const departure = between(progress, .08, .46);
      const left = item.x - item.inkHeight * .1;
      const length = item.width + item.inkHeight * .2;
      context.save();
      context.translate(index === 0 ? -width * .28 * departure : width * .34 * departure,
        index === 0 ? -height * .14 * departure : height * .2 * departure);
      context.beginPath();
      context.moveTo(left, y + amplitude * .45);
      context.bezierCurveTo(left + length * .24, y - amplitude * 1.15,
        left + length * .65, y + amplitude * .9, left + length, y - amplitude * .35);
      context.bezierCurveTo(left + length * .65, y + amplitude * .9 + thickness * .75,
        left + length * .24, y - amplitude * 1.15 + thickness * 1.55, left, y + amplitude * .45);
      context.closePath();
      context.fill();
      context.restore();
    });
    context.restore();
  }

  function render() {
    frame = 0;
    if (!active()) return;
    try {
      if (dirty && !measure()) return;
      const bounds = section.getBoundingClientRect();
      // One screen of native scroll sets the timing; the scene can release
      // before the aperture finishes so the works immediately take over.
      const rawProgress = reduced ? 0 : -bounds.top / Math.max(1, height);
      const progress = clamp(rawProgress);
      const duration = Number.isFinite(video.duration) && video.duration > 0 ? video.duration : 13;
      const phase = reduced ? 0 : video.currentTime / duration * Math.PI * 2;
      section.style.setProperty('--hero-progress', progress.toFixed(4));
      section.style.setProperty('--hero-copy-opacity', (1 - between(progress, .06, .25)).toFixed(4));
      section.style.setProperty('--hero-film-scale', (1 + .15 * between(progress, .08, .7)).toFixed(4));
      section.style.setProperty('--hero-wash', between(rawProgress, .5, 1.15).toFixed(4));
      context.setTransform(resolution, 0, 0, resolution, 0, 0);
      context.clearRect(0, 0, width, height);
      const split = splitPath(phase);
      drawWord(metrics[0], 0, progress, split);
      drawWord(metrics[2], 2, progress, split);
      clearRibbon(progress, phase);
      drawO(progress, phase);
      scene.classList.add('hero-canvas-ready');
    } catch {
      // Keep the semantic, styled heading if the compositor is unavailable.
      failed = true;
      scene.classList.remove('hero-canvas-ready');
      root.classList.remove('hero-immersion-enabled');
      section.style.setProperty('--hero-progress', '0');
      section.style.setProperty('--hero-copy-opacity', '1');
      section.style.setProperty('--hero-film-scale', '1');
      section.style.setProperty('--hero-wash', '0');
      context.clearRect(0, 0, canvas.width, canvas.height);
      stopVideoFrames();
    }
  }

  function schedule() {
    if (active() && !frame) frame = requestAnimationFrame(render);
  }
  function stopVideoFrames() {
    if (videoFrame !== null) video.cancelVideoFrameCallback?.(videoFrame);
    if (fallbackFrame) cancelAnimationFrame(fallbackFrame);
    videoFrame = null;
    fallbackFrame = 0;
  }
  function queueVideoFrame() {
    if (!active() || reduced || video.paused || video.ended) return;
    if ('requestVideoFrameCallback' in video) {
      if (videoFrame !== null) return;
      videoFrame = video.requestVideoFrameCallback(() => {
        videoFrame = null;
        schedule();
        queueVideoFrame();
      });
    } else if (!fallbackFrame) {
      fallbackFrame = requestAnimationFrame(time => {
        fallbackFrame = 0;
        if (time - lastFallbackTime >= 1000 / 24) {
          lastFallbackTime = time;
          schedule();
        }
        queueVideoFrame();
      });
    }
  }
  function syncActivity() {
    stopVideoFrames();
    if (!active()) {
      if (frame) cancelAnimationFrame(frame);
      frame = 0;
      return;
    }
    schedule();
    queueVideoFrame();
  }
  function invalidate() { dirty = true; schedule(); }
  function syncMotion() {
    reduced = motionPreference.matches || root.classList.contains('motion-reduced');
    invalidate();
    syncActivity();
  }

  new IntersectionObserver(entries => {
    visible = entries[0].isIntersecting && entries[0].intersectionRatio > 0;
    syncActivity();
  }, { threshold: 0 }).observe(scene);
  new ResizeObserver(invalidate).observe(scene);
  new ResizeObserver(invalidate).observe(name);
  new MutationObserver(syncMotion).observe(root, { attributes: true, attributeFilter: ['class'] });
  new MutationObserver(() => {
    const next = Boolean(document.querySelector('dialog[open]'));
    if (next !== dialogOpen) { dialogOpen = next; syncActivity(); }
  }).observe(document.body, { subtree: true, attributes: true, attributeFilter: ['open'] });
  motionPreference.addEventListener('change', syncMotion);
  document.addEventListener('crlanguage', invalidate);
  document.addEventListener('visibilitychange', syncActivity);
  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', invalidate);
  window.addEventListener('load', invalidate);
  window.addEventListener('pagehide', () => { pageActive = false; syncActivity(); });
  window.addEventListener('pageshow', () => { pageActive = true; invalidate(); syncActivity(); });
  for (const event of ['play', 'playing', 'pause', 'ended', 'loadeddata', 'seeked']) video.addEventListener(event, syncActivity);
  document.fonts?.ready?.then(invalidate);
})();

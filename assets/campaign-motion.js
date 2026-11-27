const figure = document.querySelector('.campaign-figure');
const pose = document.getElementById('packPose');
const canvas = document.getElementById('packOrbit');
const replay = document.getElementById('replayPackMotion');
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
const gsap = window.gsap;

if (figure && pose && canvas && replay && gsap) {
  let timeline;
  let animationId = 0;
  let orbit;
  let orbitLoading;
  let visible = false;
  let played = false;
  let startTimer;

  function stop() {
    animationId++;
    timeline?.revert();
    timeline = null;
    canvas.hidden = true;
  }

  function loadOrbit() {
    orbitLoading ??= import('./pack-orbit.js').then(module => module.createPackOrbit(canvas)).catch(() => null);
    return orbitLoading;
  }

  async function play() {
    if (!visible || document.hidden) return;
    clearTimeout(startTimer);
    played = true;
    stop();
    if (reduced.matches) {
      timeline = gsap.timeline({ onComplete: stop });
      timeline.to('.campaign-light', { opacity: .52, duration: .22, repeat: 1, yoyo: true });
      return;
    }
    const id = animationId;
    // Start the photo motion promptly if the browser is still loading WebGL.
    const effect = await Promise.race([
      loadOrbit(),
      new Promise(resolve => setTimeout(resolve, 180))
    ]);
    if (id !== animationId || reduced.matches || !visible || document.hidden) return;
    orbit = effect ?? orbit;
    const sweep = { progress: 0 };
    if (orbit) {
      canvas.hidden = false;
      orbit.resize();
    }
    timeline = gsap.timeline({ onComplete: stop });
    timeline
      .to(pose, { transformPerspective: 850, rotationY: -12, rotationZ: -1.5, duration: .46, ease: 'power2.inOut' }, 0)
      .to(pose, { rotationY: 10, rotationZ: 1.2, duration: .8, ease: 'sine.inOut' }, .46)
      .to(pose, { rotationY: 0, rotationZ: 0, duration: .64, ease: 'power3.out' }, 1.26);
    if (orbit) {
      timeline.to(sweep, {
        progress: 1,
        duration: 1.55,
        ease: 'none',
        onUpdate: () => orbit.draw(sweep.progress)
      }, .15);
    }
  }

  const observer = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting && entry.intersectionRatio >= .25;
    if (!visible) {
      clearTimeout(startTimer);
      stop();
    } else if (!played && !reduced.matches && !document.hidden) {
      loadOrbit();
      startTimer = setTimeout(play, 1700);
    }
  }, { threshold: .25 });
  observer.observe(figure);
  replay.addEventListener('click', play);
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      clearTimeout(startTimer);
      stop();
    } else if (visible && !played && !reduced.matches) {
      startTimer = setTimeout(play, 1700);
    }
  });
  reduced.addEventListener('change', () => {
    if (reduced.matches) {
      clearTimeout(startTimer);
      stop();
    }
  });
  replay.hidden = false;
}

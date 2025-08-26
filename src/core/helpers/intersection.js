const EVENT_IN  = 'intersection.enter';
const EVENT_OUT = 'intersection.exit';
const OBSERVER  = Symbol();

// intersection
export function intersection (ratio) {
  const event     = (kind) => {
    setTimeout(() =>
      (this.svg?._el || this).dispatchEvent(new CustomEvent(
          kind,
          {bubbles : true, cancelable : true, composed : true}
        )
      ), 50);
  }
  let initial     = true;
  let intersected = false;
  if (this[OBSERVER]) {
    this[OBSERVER].disconnect();
  }
  this[OBSERVER] = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting && entry.intersectionRatio >= ratio) {
        if (!intersected) {
          intersected = true;
          event(EVENT_IN);
        }
      } else {
        if (intersected || initial) {
          intersected = false;
          event(EVENT_OUT);
        }
      }
    });
    initial = false;
  }, {
    "root"       : null,
    "rootMargin" : "0px",
    "threshold"  : Array(21).fill(0).map((x, y) => y * 0.05)
  });
  this[OBSERVER].observe(this._el || this);
}

export default intersection;
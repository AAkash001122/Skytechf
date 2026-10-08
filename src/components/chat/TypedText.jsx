import { useEffect, useRef, useState } from 'react';

/** Reveals `text` a few characters at a time. `instant` shows it all at once (reduced motion or already read). */
export default function TypedText({ text, instant = false, onTick, onDone }) {
  const [count, setCount] = useState(instant ? text.length : 0);
  const done = useRef(onDone);
  const tick = useRef(onTick);
  done.current = onDone;
  tick.current = onTick;

  useEffect(() => {
    if (count >= text.length) {
      done.current?.();
      return undefined;
    }
    const id = setTimeout(() => {
      setCount((c) => Math.min(text.length, c + 2));
      tick.current?.();
    }, 16);
    return () => clearTimeout(id);
  }, [count, text]);

  return (
    <>
      <span aria-hidden="true">{text.slice(0, count)}</span>
      {count < text.length && <span aria-hidden="true" className="caret ml-0.5 inline-block h-3.5 w-1.5 translate-y-0.5 bg-accent" />}
      <span className="sr-only">{text}</span>
    </>
  );
}

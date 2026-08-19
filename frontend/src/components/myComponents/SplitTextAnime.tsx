// @ts-nocheck
import { useEffect, useRef } from 'react';
import { createTimeline, stagger } from 'animejs';
import { splitText } from 'animejs'; // Or animejs/text if this fails

export default function SplitTextAnime({ englishText, japaneseText, className = "", isActive = true }) {
  const containerRef = useRef(null);
  const animationRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current || !isActive) {
       if (containerRef.current && !isActive) {
          // Reset when not active to hide it or keep it hidden before animating
          containerRef.current.style.opacity = '0';
       }
       return;
    }

    containerRef.current.style.opacity = '1';
    // Reset to plain text before splitting
    const jpnHtml = japaneseText ? `<br><span style="font-size: 1.15em; display: inline-block; margin-top: 0.1em;">${japaneseText}</span>` : '';
    containerRef.current.innerHTML = `${englishText}${jpnHtml}`;

    let split;
    try {
        split = splitText(containerRef.current, {
          words: { wrap: 'clip' },
          chars: true,
        });
    } catch (e) {
        // Fallback if splitText from 'animejs' is not found, try importing dynamically or handle it
        console.error("splitText error:", e);
        return;
    }

    const { words, chars } = split;

    if (animationRef.current) {
      animationRef.current.pause();
    }

    animationRef.current = createTimeline({
      defaults: { ease: 'inOut(3)', duration: 650 }
    })
    .add(words, {
      y: [($el) => (+$el.dataset.line % 2 ? '100%' : '-100%'), '0%'],
    }, stagger(125))
    .add(chars, {
      y: [($el) => (+$el.dataset.line % 2 ? '100%' : '-100%'), '0%'],
    }, stagger(10, { from: 'random' }))
    .init();

    return () => {
      if (animationRef.current) {
        animationRef.current.pause();
      }
    };
  }, [englishText, japaneseText, isActive]);

  return (
    <div className={className} ref={containerRef} style={{ opacity: 0 }}>
      {/* React renders initial state, useEffect overwrites it */}
      {englishText}
      {japaneseText && (
        <>
          <br />
          <span style={{ fontSize: '1.15em', display: 'inline-block', marginTop: '0.1em' }}>{japaneseText}</span>
        </>
      )}
    </div>
  );
}

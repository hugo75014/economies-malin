'use client';

import { useEffect } from 'react';

/**
 * Removes the preview platform's floating ball + any other injected branding
 * that doesn't belong to the user's actual product.
 *
 * Safe to use: no-op if elements don't exist.
 */
export default function PlatformBrandingRemover() {
  useEffect(() => {
    const remove = () => {
      // Remove the floating ball
      const ball = document.getElementById('minimax-floating-ball');
      if (ball) ball.remove();

      // Remove any other platform-injected elements
      const other = document.querySelectorAll('[data-minimax-ball]');
      other.forEach((el) => el.remove());

      // Also try to remove inline-styled platform brand
      const candidates = document.querySelectorAll('div, a, span');
      candidates.forEach((el) => {
        const text = el.textContent?.trim() ?? '';
        if (
          (text === 'Created by MiniMax Agent' || text === 'Created by MiniMax') &&
          el.children.length === 0
        ) {
          el.remove();
        }
      });
    };

    // Run on mount + on every navigation
    remove();
    const observer = new MutationObserver(remove);
    observer.observe(document.body, { childList: true, subtree: true });

    // Also run periodically for the first 5 seconds (in case of late injection)
    const interval = setInterval(remove, 500);
    setTimeout(() => clearInterval(interval), 5000);

    return () => {
      observer.disconnect();
      clearInterval(interval);
    };
  }, []);

  return null;
}

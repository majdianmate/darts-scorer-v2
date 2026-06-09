import { useEffect, useState } from "react";

import { GravityStarsBackground } from "#/components/animate-ui/components/backgrounds/gravity-stars";

export function GravityStarsLayer() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <GravityStarsBackground
      className="pointer-events-none fixed inset-0 z-[3] text-primary opacity-[0.38] mix-blend-soft-light dark:opacity-30 dark:mix-blend-screen"
      starsOpacity={0.8}
      glowIntensity={16}
      starsCount={90}
    />
  );
}

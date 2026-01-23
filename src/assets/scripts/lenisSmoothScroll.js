import "@styles/lenis.css";

import Lenis from "lenis";

// Script to handle Lenis library settings for smooth scrolling
// https://github.com/darkroomengineering/lenis
// Lenis instance is created for side effects (autoRaf: true enables automatic RAF)
new Lenis({
    autoRaf: true,
});
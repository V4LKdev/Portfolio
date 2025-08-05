// Quick debug script to check moonlight theme variables
// ...removed console.log...
const root = document.documentElement;
const styles = getComputedStyle(root);

const glowVars = [
  "--theme-menu-glow",
  "--theme-title-glow",
  "--theme-social-glow",
  "--theme-atmospheric-glow",
];

glowVars.forEach((varName) => {
  const value = styles.getPropertyValue(varName);
  // ...removed console.log...
});

// Check theme attribute (should always be moonlight)
// ...removed console.log...

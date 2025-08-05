// Quick debug script to check moonlight theme variables
console.log("Moonlight theme variables check:");
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
  console.log(`${varName}: ${value}`);
});

// Check theme attribute (should always be moonlight)
console.log("Current theme:", root.getAttribute("data-theme"));

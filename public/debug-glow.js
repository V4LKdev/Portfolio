// Quick debug script to check theme variables
console.log("Theme variables check:");
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

// Also check theme attribute
console.log("Current theme:", root.getAttribute("data-theme"));

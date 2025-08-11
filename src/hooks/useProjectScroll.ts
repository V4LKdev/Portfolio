import { useCallback } from "react";

/**
 * Centralized hook for smooth scrolling behavior in project details.
 * Handles dynamic offset calculation for sticky headers and provides
 * consistent scrolling with breathing room.
 */
export const useProjectScroll = () => {
  const scrollToAnchor = useCallback((anchorId: string) => {
    // Debug: log anchor scroll attempt
    // eslint-disable-next-line no-console
    console.log('[useProjectScroll] scrollToAnchor called with:', anchorId);
    const targetElement = document.getElementById(anchorId);
    if (!targetElement) {
      // eslint-disable-next-line no-console
      console.warn(`[useProjectScroll] Element with id "${anchorId}" not found`);
      return;
    } else {
      // eslint-disable-next-line no-console
      console.log('[useProjectScroll] Found element:', targetElement);
      const rect = targetElement.getBoundingClientRect();
      // eslint-disable-next-line no-console
      console.log('[useProjectScroll] Element rect:', rect);
      // eslint-disable-next-line no-console
      console.log('[useProjectScroll] Element offsetHeight:', targetElement.offsetHeight, 'offsetTop:', targetElement.offsetTop, 'display:', getComputedStyle(targetElement).display, 'visibility:', getComputedStyle(targetElement).visibility);
    }

    // Find the sticky header element dynamically
    // Look for elements with common sticky header selectors
    const stickyHeader = 
      document.querySelector('[data-sticky-header]') || // Preferred: explicit data attribute
      document.querySelector('.sticky-header') ||        // Class-based fallback
      document.querySelector('header[class*="sticky"]') || // Header with sticky in class
      document.querySelector('[class*="sticky"][class*="header"]'); // Any element with both sticky and header in class

    let headerHeight = 0;
    if (stickyHeader) {
  // Get the real-time height of the sticky header
  const rect = stickyHeader.getBoundingClientRect();
  headerHeight = rect.height;
  // eslint-disable-next-line no-console
  console.log('[useProjectScroll] Sticky header found. Height:', headerHeight);
    } else {
      // eslint-disable-next-line no-console
      console.warn('[useProjectScroll] No sticky header found. Using default offset.');
      // Fallback to a reasonable default if no sticky header is detected
      headerHeight = 64; // 4rem equivalent
    }

    // Add breathing room margin (16px = 1rem)
    const scrollMargin = 16;
    const totalOffset = headerHeight + scrollMargin;

    // Calculate the final scroll position
  // Use offsetTop for more reliable scrolling
  const targetScrollPosition = targetElement.offsetTop - totalOffset;
  // eslint-disable-next-line no-console
  console.log('[useProjectScroll] Calculated scroll position (offsetTop):', targetScrollPosition);

    // Perform the smooth scroll
    window.scrollTo({
      top: Math.max(0, targetScrollPosition), // Ensure we don't scroll above the page
      behavior: 'smooth'
    });
    // eslint-disable-next-line no-console
    console.log('[useProjectScroll] Scrolling to:', targetScrollPosition, 'for anchor:', anchorId);
  }, []);

  return {
    scrollToAnchor
  };
};

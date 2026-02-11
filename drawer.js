/**
 * Mobile Drawer Menu
 * Handles the mobile navigation drawer with accordion sections
 */

(function() {
  'use strict';

  // Elements
  const burgerMenu = document.getElementById('burger-menu');
  const drawer = document.getElementById('mobile-drawer');
  const drawerOverlay = document.getElementById('drawer-overlay');
  const drawerClose = document.getElementById('drawer-close');
  const sectionButtons = document.querySelectorAll('.drawer-section-btn');
  
  // State
  let isOpen = false;
  let focusedElementBeforeOpen = null;

  /**
   * Open the drawer
   */
  function openDrawer() {
    if (isOpen) return;

    // Save currently focused element
    focusedElementBeforeOpen = document.activeElement;

    // Add active classes
    drawer.classList.add('active');
    drawerOverlay.classList.add('active');
    document.body.classList.add('drawer-open');

    // Update ARIA
    drawer.setAttribute('aria-hidden', 'false');
    burgerMenu.setAttribute('aria-expanded', 'true');

    // Set focus to close button
    setTimeout(() => {
      drawerClose.focus();
    }, 100);

    isOpen = true;
  }

  /**
   * Close the drawer
   */
  function closeDrawer() {
    if (!isOpen) return;

    // Remove active classes
    drawer.classList.remove('active');
    drawerOverlay.classList.remove('active');
    document.body.classList.remove('drawer-open');

    // Update ARIA
    drawer.setAttribute('aria-hidden', 'true');
    burgerMenu.setAttribute('aria-expanded', 'false');

    // Restore focus
    if (focusedElementBeforeOpen) {
      focusedElementBeforeOpen.focus();
    }

    isOpen = false;
  }

  /**
   * Toggle accordion section
   */
  function toggleSection(button) {
    const isExpanded = button.getAttribute('aria-expanded') === 'true';
    const contentId = button.getAttribute('aria-controls');
    const content = document.getElementById(contentId);

    if (!content) return;

    if (isExpanded) {
      // Close section
      button.setAttribute('aria-expanded', 'false');
      content.classList.remove('active');
    } else {
      // Close all other sections first (optional: comment out for multiple sections open)
      sectionButtons.forEach(btn => {
        if (btn !== button) {
          btn.setAttribute('aria-expanded', 'false');
          const otherContentId = btn.getAttribute('aria-controls');
          const otherContent = document.getElementById(otherContentId);
          if (otherContent) {
            otherContent.classList.remove('active');
          }
        }
      });

      // Open this section
      button.setAttribute('aria-expanded', 'true');
      content.classList.add('active');
    }
  }

  /**
   * Handle keyboard navigation
   */
  function handleKeyDown(event) {
    if (!isOpen) return;

    // ESC key to close
    if (event.key === 'Escape') {
      closeDrawer();
    }

    // Tab key for focus trap (simple implementation)
    if (event.key === 'Tab') {
      const focusableElements = drawer.querySelectorAll(
        'button, a, input, [tabindex]:not([tabindex="-1"])'
      );
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (event.shiftKey) {
        // Shift + Tab
        if (document.activeElement === firstElement) {
          event.preventDefault();
          lastElement.focus();
        }
      } else {
        // Tab
        if (document.activeElement === lastElement) {
          event.preventDefault();
          firstElement.focus();
        }
      }
    }
  }

  /**
   * Initialize event listeners
   */
  function init() {
    // Burger menu click
    if (burgerMenu) {
      burgerMenu.addEventListener('click', () => {
        if (isOpen) {
          closeDrawer();
        } else {
          openDrawer();
        }
      });
    }

    // Close button click
    if (drawerClose) {
      drawerClose.addEventListener('click', closeDrawer);
    }

    // Overlay click
    if (drawerOverlay) {
      drawerOverlay.addEventListener('click', closeDrawer);
    }

    // Accordion section buttons
    sectionButtons.forEach(button => {
      button.addEventListener('click', () => {
        toggleSection(button);
      });
    });

    // Keyboard events
    document.addEventListener('keydown', handleKeyDown);

    // Close drawer when clicking internal links (anchors)
    const drawerLinks = drawer.querySelectorAll('a[href^="#"]');
    drawerLinks.forEach(link => {
      link.addEventListener('click', () => {
        setTimeout(closeDrawer, 100);
      });
    });
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();

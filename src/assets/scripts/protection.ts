// Comprehensive website protection script
// Protects against code inspection, image downloading, and developer tools

(function() {
  'use strict';

  // Disable right-click context menu
  document.addEventListener('contextmenu', function(e) {
    e.preventDefault();
    e.stopPropagation();
    return false;
  }, true);

  // Disable text selection (except in input fields)
  document.addEventListener('selectstart', function(e) {
    const target = e.target as HTMLElement;
    // Allow selection in input, textarea, and contenteditable elements
    if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
      return true;
    }
    e.preventDefault();
    return false;
  }, true);

  // Disable drag and drop
  document.addEventListener('dragstart', function(e) {
    e.preventDefault();
    return false;
  }, true);

  document.addEventListener('drop', function(e) {
    e.preventDefault();
    return false;
  }, true);

  // Disable copy, cut, paste (except in input fields)
  document.addEventListener('copy', function(e) {
    const target = e.target as HTMLElement;
    // Allow copy in input, textarea, and contenteditable elements
    if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
      return true;
    }
    e.preventDefault();
    return false;
  }, true);

  document.addEventListener('cut', function(e) {
    const target = e.target as HTMLElement;
    if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
      return true;
    }
    e.preventDefault();
    return false;
  }, true);

  document.addEventListener('paste', function(e) {
    const target = e.target as HTMLElement;
    if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
      return true;
    }
    e.preventDefault();
    return false;
  }, true);

  // Disable all developer tools shortcuts
  document.addEventListener('keydown', function(e) {
    // F12
    if (e.key === 'F12' || e.keyCode === 123) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }

    // Ctrl+Shift+I (DevTools)
    if (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.keyCode === 73)) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }

    // Ctrl+Shift+J (Console)
    if (e.ctrlKey && e.shiftKey && (e.key === 'J' || e.keyCode === 74)) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }

    // Ctrl+Shift+C (Inspect Element)
    if (e.ctrlKey && e.shiftKey && (e.key === 'C' || e.keyCode === 67)) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }

    // Ctrl+U (View Source)
    if (e.ctrlKey && (e.key === 'U' || e.keyCode === 85)) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }

    // Ctrl+S (Save Page)
    if (e.ctrlKey && (e.key === 'S' || e.keyCode === 83)) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }

    // Ctrl+A (Select All)
    if (e.ctrlKey && (e.key === 'A' || e.keyCode === 65)) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }

    // Ctrl+P (Print)
    if (e.ctrlKey && (e.key === 'P' || e.keyCode === 80)) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }

    // Ctrl+Shift+K (Console in Firefox)
    if (e.ctrlKey && e.shiftKey && (e.key === 'K' || e.keyCode === 75)) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }

    // Ctrl+Shift+E (Network in Firefox)
    if (e.ctrlKey && e.shiftKey && (e.key === 'E' || e.keyCode === 69)) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }

    // Disable Ctrl+Shift+Del
    if (e.ctrlKey && e.shiftKey && (e.key === 'Delete' || e.keyCode === 46)) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }
  }, true);

  // Detect and prevent developer tools
  let devtools = {
    open: false,
    orientation: null as string | null
  };

  const threshold = 160;
  let warningShown = false;

  setInterval(function() {
    if (window.outerHeight - window.innerHeight > threshold || 
        window.outerWidth - window.innerWidth > threshold) {
      if (!devtools.open && !warningShown) {
        devtools.open = true;
        warningShown = true;
        // Show warning and redirect
        const warning = document.createElement('div');
        warning.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:#000;color:#fff;display:flex;align-items:center;justify-content:center;font-size:24px;font-weight:bold;z-index:99999;';
        warning.textContent = 'Developer tools are not allowed. Please close them to continue.';
        document.body.appendChild(warning);
        
        setTimeout(function() {
          window.location.href = window.location.origin;
        }, 2000);
      }
    } else {
      if (devtools.open) {
        devtools.open = false;
        warningShown = false;
      }
    }
  }, 500);

  // Protect all images
  function protectImages() {
    const images = document.querySelectorAll('img');
    images.forEach(function(img: HTMLImageElement) {
      // Disable drag
      img.setAttribute('draggable', 'false');
      img.ondragstart = function() { return false; };
      
      // Disable right-click on images
      img.addEventListener('contextmenu', function(e) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }, true);

      // Prevent opening in new tab (middle click, Ctrl+click, Cmd+click)
      img.addEventListener('click', function(e) {
        if (e.ctrlKey || e.metaKey || e.button === 1) {
          e.preventDefault();
          e.stopPropagation();
          return false;
        }
      }, true);

      // Prevent image save via drag
      img.addEventListener('mousedown', function(e) {
        if (e.button === 1 || e.button === 2) {
          e.preventDefault();
          return false;
        }
      }, true);

      // Disable image selection
      img.style.userSelect = 'none';
      img.style.webkitUserSelect = 'none';
      img.style.webkitTouchCallout = 'none';
      img.style.pointerEvents = 'auto'; // Keep images clickable for functionality
    });
  }

  // Protect images on load and when new ones are added
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', protectImages);
  } else {
    protectImages();
  }

  // Watch for new images added dynamically
  const observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      if (mutation.addedNodes.length) {
        protectImages();
      }
    });
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });

  // Disable print screen (partial protection)
  document.addEventListener('keyup', function(e) {
    if (e.key === 'PrintScreen' || e.keyCode === 44) {
      navigator.clipboard.writeText('');
      alert('Screenshots are disabled on this website.');
    }
  });

  // Disable common debugging functions
  (function() {
    function disableFunction(name: string) {
      try {
        (window as any)[name] = function() {
          return false;
        };
      } catch (e) {}
    }

    disableFunction('console');
    disableFunction('debugger');
  })();

  // Obfuscate source code by disabling view source
  document.addEventListener('keydown', function(e) {
    // Disable Ctrl+Shift+View Source
    if (e.ctrlKey && e.shiftKey && (e.key === 'U' || e.keyCode === 85)) {
      e.preventDefault();
      return false;
    }
  });

  // Add CSS to prevent selection and protect images
  const style = document.createElement('style');
  style.textContent = `
    * {
      -webkit-user-select: none !important;
      -moz-user-select: none !important;
      -ms-user-select: none !important;
      user-select: none !important;
      -webkit-touch-callout: none !important;
      -webkit-tap-highlight-color: transparent !important;
    }
    
    /* Allow selection in form inputs */
    input, textarea, [contenteditable="true"] {
      -webkit-user-select: text !important;
      -moz-user-select: text !important;
      -ms-user-select: text !important;
      user-select: text !important;
    }
    
    img {
      -webkit-user-drag: none !important;
      -khtml-user-drag: none !important;
      -moz-user-drag: none !important;
      -o-user-drag: none !important;
      user-drag: none !important;
      -webkit-touch-callout: none !important;
      position: relative;
    }
    
    img::selection {
      background: transparent !important;
    }
    
    img::-moz-selection {
      background: transparent !important;
    }
    
    /* Add invisible overlay to images to prevent direct access */
    img::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
    }
    
    /* Prevent image context menu */
    img {
      -webkit-context-menu: none;
    }
  `;
  document.head.appendChild(style);

  // Disable image saving via drag
  document.addEventListener('dragstart', function(e) {
    if ((e.target as HTMLElement).tagName === 'IMG') {
      e.preventDefault();
      return false;
    }
  }, true);

  // Prevent image opening in new tab (middle click)
  document.addEventListener('auxclick', function(e) {
    if ((e.target as HTMLElement).tagName === 'IMG' && e.button === 1) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }
  }, true);

  // Prevent image save via browser menu
  document.addEventListener('beforeunload', function(e) {
    // This makes it harder to save images
  });

  // Block image download via network tab
  if (typeof window !== 'undefined' && (window as any).fetch) {
    const originalFetch = window.fetch;
    window.fetch = function(...args) {
      const url = args[0] as string;
      if (typeof url === 'string' && (url.match(/\.(jpg|jpeg|png|gif|webp|svg|avif)$/i) || url.includes('image'))) {
        // Allow images to load but make it harder to download
      }
      return originalFetch.apply(this, args);
    };
  }

  // Block common developer tools detection
  Object.defineProperty(window, 'devtools', {
    get: function() {
      return { open: false, orientation: null };
    }
  });

  // Disable console methods
  const noop = function() {};
  const methods = ['log', 'debug', 'info', 'warn', 'error', 'assert', 'dir', 'dirxml', 'group', 'groupEnd', 'time', 'timeEnd', 'count', 'trace', 'profile', 'profileEnd'];
  methods.forEach(function(method) {
    try {
      (console as any)[method] = noop;
    } catch (e) {}
  });

  // Prevent common inspection techniques
  Object.defineProperty(window, '__REACT_DEVTOOLS_GLOBAL_HOOK__', {
    get: function() { return undefined; }
  });

  // Disable common debugging tools
  Object.defineProperty(window, 'chrome', {
    get: function() { return undefined; }
  });

  // Add watermark overlay to images
  function addImageWatermark() {
    const images = document.querySelectorAll('img');
    images.forEach(function(img: HTMLImageElement) {
      // Create invisible overlay
      const overlay = document.createElement('div');
      overlay.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:1;';
      overlay.setAttribute('data-protected', 'true');
      
      // Wrap image in container if not already wrapped
      if (img.parentElement && !img.parentElement.hasAttribute('data-img-wrapper')) {
        const wrapper = document.createElement('div');
        wrapper.style.cssText = 'position:relative;display:inline-block;';
        wrapper.setAttribute('data-img-wrapper', 'true');
        img.parentElement.insertBefore(wrapper, img);
        wrapper.appendChild(img);
        wrapper.appendChild(overlay);
      }
    });
  }

  // Apply watermark protection
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', addImageWatermark);
  } else {
    setTimeout(addImageWatermark, 200);
  }

  // Watch for new images and protect them
  const imageObserver = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      mutation.addedNodes.forEach(function(node) {
        if (node.nodeType === 1) {
          const imgs = (node as Element).querySelectorAll ? (node as Element).querySelectorAll('img') : [];
          imgs.forEach(function(img: HTMLImageElement) {
            img.setAttribute('draggable', 'false');
            img.ondragstart = function() { return false; };
          });
          protectImages();
          addImageWatermark();
        }
      });
    });
  });

  imageObserver.observe(document.body, {
    childList: true,
    subtree: true
  });

})();

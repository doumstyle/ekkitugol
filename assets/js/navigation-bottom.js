document.addEventListener('DOMContentLoaded', function () {
  var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
  var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
    // Customize placement for bottom navigation if not already set correctly
    if (window.innerWidth < 576 && tooltipTriggerEl.closest('#navigation')) {
        // For items in the bottom nav, ensure tooltip is on top
        // if data-bs-placement is not already 'top'
        if (tooltipTriggerEl.getAttribute('data-bs-placement') !== 'top') {
            tooltipTriggerEl.setAttribute('data-bs-placement', 'top');
        }
    } else if (tooltipTriggerEl.closest('#navigation')) {
        // For sidebar, ensure 'right' if not already set
         if (tooltipTriggerEl.getAttribute('data-bs-placement') !== 'right') {
            tooltipTriggerEl.setAttribute('data-bs-placement', 'right');
        }
    }
    return new bootstrap.Tooltip(tooltipTriggerEl);
  });
});
/**
 * Checks and adjusts the visibility of mobile buttons based on window dimensions.
 */
function checkMobileButtonsVisibility() {
    const movementMobile = document.getElementById('movementMobile');
    const attackMobile = document.getElementById('attackMobile');
    if (window.innerWidth >= 1200 && window.innerHeight >= 1300) {
      movementMobile.classList.remove('d-none');
      attackMobile.classList.remove('d-none');
    } else {
      movementMobile.classList.add('d-none');
      attackMobile.classList.add('d-none');
    }
  }
  
  window.addEventListener('resize', checkMobileButtonsVisibility);
  
  window.addEventListener('load', checkMobileButtonsVisibility);
  
window.addEventListener('DOMContentLoaded', addListeners);

function addListeners() {
  $('.goTop').click(goTop);
}

function goTop() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
}

if (typeof window.Swiper === 'function') { //prevent js error in pricing page
  const swiper = new Swiper('.swiper', {
    // Optional parameters
    spaceBetween: 24,
    slidesPerView: 1,
    /* loop: true, */
    /* autoplay: {
      delay: 5000,
    }, */
    breakpoints: {
      768: {
        slidesPerView: 2
      },
      992: {
        slidesPerView: 3
      }
    },
    
    // If we need pagination
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },
    
    // Navigation arrows
    /*navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },*/
    
  });
}

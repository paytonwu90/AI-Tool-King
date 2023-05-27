window.addEventListener('DOMContentLoaded', addListeners);
window.addEventListener('DOMContentLoaded', getWorks);
window.addEventListener('resize', renderFilterBtn);

let filter = {
  modal: '',
  type: ''
};

function addListeners() {
  $('.goTop').on('click', goTop);

  $('.accordion').on('click', '.accordion-button', function () {
    $('.accordion-button.collapsed').closest('.accordion-item').removeClass('border-white');
    $('.accordion-button:not(.collapsed)').closest('.accordion-item').addClass('border-white');
  });

  $(document).on('click', e => {
    const target = e.target;
    const filterBtn = $('#filterBtn');
    const filterMenu = $('#filterMenu');
    const sortBtn = $('#sortBtn');
    const sortMenu = $('#sortMenu');
    if (filterBtn.has(target).length == 0 && !filterBtn.is(target) &&
        filterMenu.has(target).length == 0 && !filterMenu.is(target)) {
      //點擊範圍不在此按鈕內
      closeMenu(filterBtn);
    }
    if (sortBtn.has(target).length == 0 && !sortBtn.is(target) &&
        sortMenu.has(target).length == 0 && !sortMenu.is(target)) {
      //點擊範圍不在此按鈕內
      closeMenu(sortBtn);
    }
  });

  $('#filterBtn, #sortBtn').on('click', function(e) {
    toggleMenu($(this));
  });
  $('#sortMenu').on('click', '.menu-item', function(e) {
    const target = e.target;
    $('#sortBtn-text').text(target.textContent);
    toggleMenu($('#sortBtn'));
  });

  $('#filterMenu').on('click', '.menu-item', function(e) {
    const target = $(e.target);
    if (target.hasClass('active')) {
      target.removeClass('active');
      if (target.data('filterModal')) {
        filter.modal = '';
      } else if (target.data('filterType')) {
        filter.type = '';
      }
    } else {
      target.closest('.menu-content').find('.menu-item').removeClass('active');
      target.addClass('active');
      if (target.data('filterModal')) {
        filter.modal = target.data('filterModal');
      } else if (target.data('filterType')) {
        filter.type = target.data('filterType');
      }
    }

    renderFilterBtn();
  });
}

/**
 * @param {jQuery} button 
 */
function toggleMenu(button) {
  if (!button) return;
  const menuName = button.data('menu');
  if (!menuName) return;
  const menu = $(`#${menuName}`);
  if (!menu) return;

  button.toggleClass('active');

  const buttonRect = button.get(0).getBoundingClientRect();
  const windowScrollTop = getWindowScrollTop();

  if (button.hasClass('active')) {
    const windowHeight = getWindowHeight();
    if (buttonRect.top > windowHeight / 2) {
      //button 的位置太下面了，menu 要往上展開
      
      //清除 menu 的 height, max-height 以取得 menu 的實際高度
      menu.css({height: '', maxHeight: ''});
      //console.log('展開前 menu height:', menu.height(), ', rect:', menu.get(0).getBoundingClientRect().height);
      const menuRealHeight = menu.height();

      //計算 menu 最多能展開多少高度
      const menuMaxHeight = Math.min(buttonRect.top - 10, menuRealHeight);
      const animateStartTop = buttonRect.top + windowScrollTop;
      const animateEndTop = animateStartTop - menuMaxHeight;

      menu.css('display', 'block');
      menu.css('top', animateStartTop + 'px');
      menu.css('left', buttonRect.left + 'px');
      menu.css('maxHeight', '0');
      menu.animate({maxHeight: menuMaxHeight + 'px', top: animateEndTop + 'px'}, 'fast');

      //不能直接設定 menu height 而應該要設 max-height，因為 menu height 可能會比 window height 小
    } else {
      //往下展開的話不用計算，直接用 slideDown 就可以了
      menu.css('top', buttonRect.bottom + windowScrollTop + 'px');
      menu.css('left', buttonRect.left + 'px');
      menu.css('maxHeight', windowHeight - buttonRect.bottom - 10 + 'px'); //max-height = button bottom 到視窗底部的距離
      menu.slideDown('fast');
    }
  } else {
    menu.fadeOut(200);
  }
}
function closeMenu(button) {
  if (!button || !button.hasClass('active')) return;
  const menuName = button.data('menu');
  if (!menuName) return;
  const menu = $(`#${menuName}`);
  if (!menu) return;

  menu.fadeOut(200);
  button.removeClass('active');
}

function renderFilterBtn() {
  const button = $('#filterBtn');
  let text = '';
  let filterCount = 0;
  if (filter.modal) {
    text += filter.modal;
    filterCount++;
  }
  if (filter.type) {
    text += (text.length > 0 ? '、' : '') + filter.type;
    filterCount++;
  }
  if (filterCount > 0) {
    button.addClass('selected');
    if (breakpointUp('xl')) $('#filterBtn-txt').text(text);
    else $('#filterBtn-txt').text('篩選');
    $('#filterBtn-count').text(filterCount);
  }
  else {
    button.removeClass('selected');
    $('#filterBtn-txt').text('篩選');
  }
}

function getWorks() {
  /* axios.get('https://2023-engineer-camp.zeabur.app/api/v1/works?page=2&search=安安')
    .then((response) => console.log(response.data['ai_works']))
    .catch((error) => console.log(error)); */
}

function goTop() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
}

function getWindowScrollTop() {
  return window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
}
function getWindowHeight() {
  return window.innerHeight;
}
function breakpointUp(breakpoint) {
  const windowWidth = window.innerWidth;
  if (breakpoint === 'sm') return windowWidth >= 576;
  if (breakpoint === 'md') return windowWidth >= 768;
  if (breakpoint === 'lg') return windowWidth >= 992;
  if (breakpoint === 'xl') return windowWidth >= 1200;
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

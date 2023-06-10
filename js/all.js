window.addEventListener('DOMContentLoaded', addListeners);
window.addEventListener('DOMContentLoaded', getData);
window.addEventListener('resize', renderFilterBtn);

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
  $('#filterBtn').on('click', function() {
    const menuItems = $('.menu-item', '#filterMenu');
    menuItems.each(function() {
      const item = $(this);
      if (item.data('filterType') === query.type) item.addClass('active');
      else item.removeClass('active');
    });
  });
  $('#sortMenu').on('click', '.menu-item', function(e) {
    const target = e.target;
    $('#sortBtn-text').text(target.textContent);
    query.sort = Number(target.dataset.sort);
    closeMenu($('#sortBtn'));
    getData();
  });

  $('#filterMenu').on('click', '.menu-item', function(e) {
    const target = $(e.target);
    if (target.hasClass('active')) {
      target.removeClass('active');
      if (target.data('filterType')) {
        query.type = '';
      }
    } else {
      target.closest('.menu-content').find('.menu-item').removeClass('active');
      target.addClass('active');
      if (target.data('filterType') || target.data('filterType')==='') {
        query.type = target.data('filterType');
      }
    }

    query.page = 1; //reset page

    renderFilterBtn();
    renderTypeNav();
    getData();
  });

  $('#work').on('click', '.work-type', function(e) {
    query.type = $(e.target).data('filterType');
    query.page = 1; //reset page
    renderTypeNav();
    renderFilterBtn();
    getData();
  });

  $('#search').on('keydown', function(e) {
    if (e.key !== 'Enter') return;
    query.search = this.value;
    getData();
  });

  $('#typeNav').on('click', '.nav-link', function(e) {
    query.type = $(e.target).data('filterType');
    query.page = 1; //reset page
    renderTypeNav();
    renderFilterBtn();
    getData();
  });

  $('.pagination').on('click', '.page-link', function(e) {
    const target = $(e.target);
    if (e.target.tagName === 'SPAN') return;
    query.page = Number(target.text());
    getData();
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
  if (query.type) {
    text += query.type;
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

function renderTypeNav() {
  const selectedType = query.type;
  const links = $('.nav-link', '#typeNav');
  links.each(function() {
    let link = $(this);
    if (link.data('filterType') !== selectedType) {
      link.removeClass('active');
    } else {
      link.addClass('active');
    }
  });
}

function renderWorks() {
  let content = '';

  worksData.forEach(function(work) {
    content += `<div class="col-md-6 col-lg-4 mb-3 mb-md-6">
      <div class="card hover-zoomImage h-100 overflow-hidden">
        <div class="overflow-hidden">
          <img src="${work.imageUrl}" alt="${work.title}" class="card-img-top">
        </div>
        <div class="card-body d-flex flex-column p-0">
          <div class="flex-grow-1 py-4 px-8 border-bottom">
            <div class="d-flex justify-content-between align-items-center mb-3">
              <h4 class="fs-6 mb-0 me-3">${work.title}</h4>
              <a href="${work.link}" target="_blank" class="link-black"><span class="material-icons d-block">open_in_new</span></a>
            </div>
            
            <p class="fs-8 text-dark">${work.description}</p>
          </div>
          <ul class="list-group list-group-flush">
            <li class="list-group-item d-flex justify-content-between align-items-center py-4 px-8">
              <span class="fw-bold">AI 模型</span>
              <span>${work.model}</span>
            </li>
            <li class="list-group-item d-flex justify-content-between align-items-center py-4 px-8">
              <a href="javascript:;" class="work-type link-black" data-filter-type="${work.type}">#${work.type}</a>
              <a href="javascript:;" class="link-black"><span class="material-icons d-block">share</span></a>
            </li>
          </ul>
        </div>
      </div>
    </div>`;
  });

  $('#work').html(content);
}

function renderPages() {
  const pagination = $('.pagination');
  const totalPages = pagesData.total_pages;
  const currentPage = pagesData.current_page;

  let content = '';
  for (let i = 1; i <= totalPages; i++) {
    if (i > 5) {
      content += `<li class="page-item">
        <a class="page-link" href="javascript:;" aria-label="Next">
          <span class="material-icons" aria-hidden="true">keyboard_arrow_right</span>
        </a>
      </li>`;
      break;
    }
    content += i==currentPage ? `<li class="page-item active" aria-current="page"><span class="page-link">${i}</span></li>`
               : `<li class="page-item"><a class="page-link" href="javascript:;">${i}</a></li>`;
  }

  pagination.html(content);
}

let query = {
  type: '',
  sort: 0,
  page: 1,
  search: ''
};

let worksData = []
let pagesData = {}

function getData() {
  const apiUrl = `https://2023-engineer-camp.zeabur.app/api/v1/works?sort=${query.sort}&page=${query.page}` +
                  `${query.type ? `&type=${query.type}` : ''}` +
                  `${query.search ? `&search=${query.search}` : ''}`;
  //console.log('apiUrl:', apiUrl);
  axios.get(apiUrl)
    .then((response) => {
      //console.log('作品資料:', response.data.ai_works.data);
      //console.log('頁數資料:', response.data.ai_works.page);

      worksData = response.data.ai_works.data;
      pagesData = response.data.ai_works.page;

      renderWorks();
      renderPages();
    })
    .catch((error) => console.log(error));
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

const API_KEY = "8c8e1a50-6322-4135-8875-5d40a5420d86";
const API_URL_POPULAR =
  "https://kinopoiskapiunofficial.tech/api/v2.2/films/top?type=TOP_100_POPULAR_FILMS&page=1";
const API_URL_BEST =
  "https://kinopoiskapiunofficial.tech/api/v2.2/films/top?type=TOP_250_BEST_FILMS&page=1";
const API_URL_SEARCH =
  "https://kinopoiskapiunofficial.tech/api/v2.1/films/search-by-keyword?keyword=";
const API_URL_MOVIE_DETAILS =
  "https://kinopoiskapiunofficial.tech/api/v2.2/films/";
const API_URL_POPULAR_CATALOG =
  "https://kinopoiskapiunofficial.tech/api/v2.2/films/top?type=TOP_100_POPULAR_FILMS&page=";
const API_URL_BEST_CATALOG =
  "https://kinopoiskapiunofficial.tech/api/v2.2/films/top?type=TOP_250_BEST_FILMS&page=";

const btnActual = document.querySelector(".catalog-actual__top");
const btnBest = document.querySelector(".catalog-alltime__top");

const pagesList = document.getElementsByClassName("pages__list-item__link");
const pageLink = document.querySelector(".pages__list-item__link");
const pageLink1 = document.querySelector("#page-1");
const pageLink2 = document.querySelector("#page-2");
const pageLink3 = document.querySelector("#page-3");
const pageLink4 = document.querySelector("#page-4");
const pageLink5 = document.querySelector("#page-5");
const pageLink6 = document.querySelector("#page-6");
const pageLink7 = document.querySelector("#page-7");
const pageLink8 = document.querySelector("#page-8");
const pageLink9 = document.querySelector("#page-9");
const pageLink10 = document.querySelector("#page-10");

getMovies(API_URL_POPULAR);
markerUrl = "pop";
pageLink1.classList.add("selected__page");
// btnActual.classList.remove("not-selected")
btnBest.classList.add("not-selected");

// Подключение к API и загрузка .json ответа в константу respData
async function getMovies(url) {
  const resp = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      "X-API-KEY": API_KEY,
    },
  });
  const respData = await resp.json();
  showMovies(respData);
  console.log(respData);
}

function getClassByRate(vote) {
  if (vote >= 7) {
    return "green";
  } else if (vote > 5) {
    return "orange";
  } else {
    return "red";
  }
}

// Генерация каталога фильмов при загрузке/перезагрузке сайта
function showMovies(data) {
  const moviesEl = document.querySelector(".movies");

  // Очищаем предыдущие фильмы
  document.querySelector(".movies").innerHTML = "";

  // Генерация каталога фильмов их полученного ответа от API
  data.films.forEach((movie) => {
    const movieEl = document.createElement("div");
    movieEl.classList.add("movie");
    movieEl.innerHTML = `
      <div class="movie__cover-inner">
        <img
          src="${movie.posterUrlPreview}"
          class="movie__cover"
          alt="${movie.nameRu}"
        />

        <div class="movie__cover--darkened" id="darkened"></div>
        <div class="movie__cover-container" id="btn-container">
          <span class="move__on btn__cover" id="move__on">Просмотр</span>
          <span class="description btn__cover" id="description">Описание</span>
        </div>

      </div>
      <div class="movie__info">
        <div class="movie__title">${movie.nameRu}</div>
        <div class="movie__category">${movie.genres.map(
          (genre) => ` ${genre.genre}`
        )}</div>
        ${
          movie.rating &&
          `
        <div class="movie__average movie__average--${getClassByRate(
          movie.rating
        )}">${movie.rating}</div>
        <div class="movie__year">${movie.year}</div>
        `
        }
      </div>
        `;

    // Анимация работы всплывающих кнопок Просмотр и Описание на карточке фильма
    const darkened = movieEl.querySelector(".movie__cover--darkened");
    const btnContainer = movieEl.querySelector(".movie__cover-container");
    const moveOn = movieEl.querySelector(".move__on");
    const description = movieEl.querySelector(".description");

    darkened.onmouseenter = (event) => {
      btnContainer.classList.add("visible");
      moveOn.classList.add("visible");
      description.classList.add("visible");
    };
    moveOn.onmouseenter = (event) => {
      btnContainer.classList.add("visible");
      moveOn.classList.add("visible");
      description.classList.add("visible");
    };
    description.onmouseenter = (event) => {
      btnContainer.classList.add("visible");
      moveOn.classList.add("visible");
      description.classList.add("visible");
    };

    description.onmouseleave = (event) => {
      moveOn.classList.remove("visible");
      description.classList.remove("visible");
    };

    moveOn.onmouseleave = (event) => {
      moveOn.classList.remove("visible");
      description.classList.remove("visible");
    };

    darkened.onmouseleave = (event) => {
      btnContainer.classList.remove("visible");
      moveOn.classList.remove("visible");
      description.classList.remove("visible");
    };
    // конец анимации

    // Добавление событий на открытие плеера и модального окна
    description.addEventListener("click", () =>
      setTimeout(() => {
        openModal(movie.filmId);
      }, 100)
    );
    moveOn.addEventListener("click", () =>
      openPlayer(movie.filmId, movie.nameRu, movie.year)
    );

    // Добавление карточки фильма в каталог moviesEl
    moviesEl.appendChild(movieEl);
  });
}




///// Работа формы поиска
const form = document.querySelector("form");
const search = document.querySelector(".header__search");

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const apiSearchUrl = `${API_URL_SEARCH}${search.value}`;
  if (search.value) {
    getMovies(apiSearchUrl);
  }
}); // конец работы формы поиска



///// Player
const playerEl = document.querySelector(".kinobox_player");

async function openPlayer(id, nameFilm, year) {
  playerEl.classList.remove("hidden");

  new Kinobox(".kinobox_player", {
    search: {
      kinopoisk: `${id}`,
      // imdb: 'tt0816692',
      // title: 'Интерстеллар'
    },
    menu: {
      default: "menuList",
      mobile: "menuButton",
      format: "{N} :: {T} ({Q})",
      limit: 5,
      open: false,
    },
    players: {
      bazon: {
        enable: true,
        // position: 1,
        token: "{token}",
      },
      alloha: {
        enable: true,
        // position: 2,
        token: "{token}",
      },
      // ...
    },
    params: {
      all: {
        poster: "https://example.org/poster.jpg",
        autoplay: 0,
      },
      alloha: {
        autoplay: 0,
      },
      // ...
    },
    hide: ["videocdn", "collaps"],
    order: ["bazon", "alloha"],
  }).init();

  window.scrollTo({ top: 0, behavior: "smooth" });

  // Генерация названия фильма и кнопки "Описание" над плеером
  const kinoboxHeader = document.querySelector(".kinobox__header");
  kinoboxHeader.innerHTML = "";
  kinoboxHeader.classList.remove("hidden");

  const kinoboxHeaderContent = document.createElement("div");
  kinoboxHeaderContent.classList.add("kinobox__header-content");
  kinoboxHeaderContent.innerHTML = `
    <span class="film__name">${nameFilm}</span>
    <span class="btn__description btn__player">Описание</span>
    <span class="btn__player-hidden btn__player">Скрыть плеер</span>
    <span class="btn__player-visible btn__player hidden">Показать плеер</span>

    
  `; // <span class="film_year">${year}</span> // Можно добавить год выхода фильма к названию фильма

  btnDescription = kinoboxHeaderContent.querySelector(".btn__description");
  btnClosePlayer = kinoboxHeaderContent.querySelector(".btn__player-hidden");
  btnOpenPlayer = kinoboxHeaderContent.querySelector(".btn__player-visible");
  btnDescription.addEventListener("click", () => {
    openModal(id);
  });

  btnClosePlayer = kinoboxHeaderContent.querySelector(".btn__player-hidden");
  btnClosePlayer.addEventListener("click", () => {
    playerEl.classList.add("hidden");
    btnClosePlayer.classList.add("hidden");
    btnOpenPlayer.classList.remove("hidden");
  });

  btnOpenPlayer = kinoboxHeaderContent.querySelector(".btn__player-visible");
  btnOpenPlayer.addEventListener("click", () => {
    playerEl.classList.remove("hidden");
    btnClosePlayer.classList.remove("hidden");
    btnOpenPlayer.classList.add("hidden");
  });

  kinoboxHeader.appendChild(kinoboxHeaderContent);
}

///// Modal window
const modalEl = document.querySelector(".modal");

async function openModal(id) {
  const resp = await fetch(API_URL_MOVIE_DETAILS + id, {
    headers: {
      "Content-Type": "application/json",
      "X-API-KEY": API_KEY,
    },
  });
  const respData = await resp.json();

  modalEl.classList.add("modal--show");
  document.body.classList.add("stop-scrolling");

  modalEl.innerHTML = `
    <div class="modal__card">
      <img class="modal__movie-backdrop" src="${respData.posterUrl}" alt="">
      <div class="modal__movie-container">
          <h2>
            <span class="modal__movie-title">${respData.nameRu}</span>
            <span class="modal__movie-release-year"> — ${respData.year}</span>
          </h2>
          <ul class="modal__movie-info">
            <div class="loader"></div>
            <li class="modal__movie-genre"><span class="modal__movie-suptitle">Жанр:</span> ${respData.genres.map(
              (el) => `<span> ${el.genre}</span>`
            )}</li>
            ${
              respData.filmLength
                ? `<li class="modal__movie-runtime"><span class="modal__movie-suptitle">Время:</span> ${respData.filmLength} минут</li>`
                : ""
            }
            <li class="modal__movie-overview"><span class="modal__movie-suptitle">Описание:</span> </br> ${
              respData.description
            }</li>
          </ul>
          <button type="button" class="modal__button-close">Закрыть</button>
      </div>
    </div>
  `;
  const btnClose = document.querySelector(".modal__button-close");
  btnClose.addEventListener("click", () => closeModal());
}

function closeModal() {
  modalEl.classList.remove("modal--show");
  document.body.classList.remove("stop-scrolling");
}

window.addEventListener("click", (e) => {
  if (e.target === modalEl) {
    closeModal();
  }
});

window.addEventListener("keydown", (e) => {
  if (e.keyCode === 27) {
    closeModal();
  }
});



///// Работа кнопок каталогов
window.addEventListener("click", (e) => {
  if (e.target === btnActual) {

    // Очищаем предыдущие фильмы
    document.querySelector(".movies").innerHTML = "";

    // Подгружаем карточки с фильмами
    getMovies(API_URL_POPULAR);
    btnBest.classList.add("not-selected");
    btnActual.classList.remove("not-selected");
    defaultPages();
    pageLink1.classList.add("selected__page");
    markerUrl = "pop";
  }
});

window.addEventListener("click", (e) => {
  if (e.target === btnBest) {

    // Очищаем предыдущие фильмы
    document.querySelector(".movies").innerHTML = "";

    // Подгружаем карточки с фильмами
    getMovies(API_URL_BEST);
    btnActual.classList.add("not-selected");
    btnBest.classList.remove("not-selected");
    defaultPages();
    pageLink1.classList.add("selected__page");
    markerUrl = "best";
  }
});



///// Работа страниц каталогов

// Очищение номеров страниц от активного класса
function defaultPages() {
    for (var i = 0; i < pagesList.length; i++) {
      pagesList[i].className = pagesList[i].className.replace('selected__page','');   
    }
}

// Генерация страницы каталога
function newPageCatalog(page) {
  defaultPages();
  document.querySelector(".movies").innerHTML = "";
  var num = Number(page.textContent);
  if (markerUrl === "pop") {
    let getLink = API_URL_POPULAR_CATALOG + num;
    // Подгружаем карточки с фильмами
    getMovies(getLink);
    btnActual.classList.remove("not-selected")
    btnBest.classList.add("not-selected")
    markerUrl = "pop";
  } else if (markerUrl === "best") {
      let getLink = API_URL_BEST_CATALOG + num;
      // Подгружаем карточки с фильмами
      getMovies(getLink);
      btnActual.classList.add("not-selected")
      btnBest.classList.remove("not-selected")
      markerUrl === "best";
    } 
  page.classList.add("selected__page")
}



window.addEventListener("click", (e) => {
  if (e.target === pageLink1) {
    e.preventDefault();
    newPageCatalog(pageLink1);
  }
});

window.addEventListener("click", (e) => {
  if (e.target === pageLink2) {
    e.preventDefault();
    newPageCatalog(pageLink2);
  }
});

window.addEventListener("click", (e) => {
  if (e.target === pageLink3) {
    e.preventDefault();
    newPageCatalog(pageLink3);
  }
});

window.addEventListener("click", (e) => {
  if (e.target === pageLink4) {
    e.preventDefault();
    newPageCatalog(pageLink4);
  }
});

window.addEventListener("click", (e) => {
  if (e.target === pageLink5) {
    e.preventDefault();
    newPageCatalog(pageLink5);

  }
});

window.addEventListener("click", (e) => {
  if (e.target === pageLink6) {
    e.preventDefault();
    newPageCatalog(pageLink6);

  }
});

window.addEventListener("click", (e) => {
  if (e.target === pageLink7) {
    e.preventDefault();
    newPageCatalog(pageLink7)

  }
});

window.addEventListener("click", (e) => {
  if (e.target === pageLink8) {
    e.preventDefault();
    newPageCatalog(pageLink8)

  }
});

window.addEventListener("click", (e) => {
  if (e.target === pageLink9) {
    e.preventDefault();
    newPageCatalog(pageLink9)

  }
});

window.addEventListener("click", (e) => {
  if (e.target === pageLink10) {
    e.preventDefault();
    newPageCatalog(pageLink10)

  }
});






// Почему не работают варианты ниже? Событие в таком автоматизированном формате не может обрабатываться?


// function defaultPages() {
  /////// НЕ рабочий алгоритм удаления классов
  // pagesList.forEach(page=> {
  //   page.classList.remove("selected__page");    
  // })  
  /////// Рабочий алгоритм удаления классов
  // for (var i = 0; i < pagesList.length; i++) {
  //   pagesList[i].className = pagesList[i].className.replace('selected__page','');   
  // }
// }



// window.addEventListener("click", (e) => {
//   pagesList.forEach( page => {
//     if (e.target === page) {
      
//       document.querySelector(".movies").innerHTML = "";
//       var num = Number(page.textContent);

//       let getLink = API_URL_POPULAR_CATALOG + num;

//       // Подгружаем карточки с фильмами
//       getMovies(getLink);  
//     }
//   })

// });

// let pagesList = document.querySelectorAll('.pages__list-item__link');
// pagesList.forEach(page => {
//   page.onclick = () => { 
//     console.log(page);
//     document.querySelector(".movies").innerHTML = "";
//       let num = parseInt(page.textContent);

//       let getLink = API_URL_POPULAR_CATALOG + num;

//       // Подгружаем карточки с фильмами
//       getMovies(getLink);  
//   };
// });

// let pagesList = document.querySelectorAll('.pages__list-item__link');

// for (i = 0, len = pagesList.length; i < len; i++) {
//   pagesList[i].onclick = function() {
//     this.style.backgroundColor = 'red';
//     // document.querySelector(".movies").innerHTML = "";
//     // let num = parseInt(page.textContent);

//     // let getLink = API_URL_POPULAR_CATALOG + num;

//     //   // Подгружаем карточки с фильмами
//     // getMovies(getLink);  
//   };
// }


  // window.addEventListener("click", (e) => {
  //   if (e.target === pagesList) {
  //     e.preventDefault();
  //     pagesList.forEach(page => {
  //       if (e.target === page) {
  //         e.preventDefault();
  //     // Очищаем предыдущие фильмы
  //     document.querySelector(".movies").innerHTML = "";
  //     var num = parseInt(page.textContent);
  //     console.log(num);

  //     const getLink = API_URL_POPULAR_CATALOG + num;
  //     // Подгружаем карточки с фильмами
  //     getMovies(getLink);
  //       } 
  //     })
      
  //   }
  // });
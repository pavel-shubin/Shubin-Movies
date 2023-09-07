const API_KEY = "8c8e1a50-6322-4135-8875-5d40a5420d86";
const API_URL_POPULAR =
    "https://kinopoiskapiunofficial.tech/api/v2.2/films/top?type=TOP_100_POPULAR_FILMS&page=1";
const API_URL_SEARCH =
    "https://kinopoiskapiunofficial.tech/api/v2.1/films/search-by-keyword?keyword=";
const API_URL_MOVIE_DETAILS = "https://kinopoiskapiunofficial.tech/api/v2.2/films/"

getMovies(API_URL_POPULAR);

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
    // console.log(respData)
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
        <div class="movie__cover--darkened"></div>
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
    movieEl.addEventListener("click", () => openModal(movie.filmId))
    moviesEl.appendChild(movieEl);
  });
}

// Работа формы поиска
const form = document.querySelector("form");
const search = document.querySelector(".header__search");

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const apiSearchUrl = `${API_URL_SEARCH}${search.value}`;
  if (search.value) {
    getMovies(apiSearchUrl);

    // search.value = "";
  }
});

// Modal
const modalEl = document.querySelector(".modal");
const playerEl = document.querySelector(".kinobox_player")

async function openModal(id) {
  const resp = await fetch(API_URL_MOVIE_DETAILS + id, {
    headers: {
      "Content-Type": "application/json",
      "X-API-KEY": API_KEY,
    },
  });
  const respData = await resp.json();
  
  playerEl.classList.remove("hidden")
  // modalEl.classList.add("modal--show");
  // document.body.classList.add("stop-scrolling");

  new Kinobox('.kinobox_player', {
    search: {
        kinopoisk: `${id}`,
        // imdb: 'tt0816692',
        // title: 'Интерстеллар'
    },
    menu: {
        default: 'menuList',
        mobile: 'menuButton',
        format: '{N} :: {T} ({Q})',
        limit: 5,
        open: false,
    },
    players: {
        alloha: {
            enable: true,
            position: 1,
            token: '{token}'
        },
        kodik: {
            enable: false,
            position: 2,
            token: '{token}'
        },
        // ...
    },
    params: {
        all: {
            poster: 'https://example.org/poster.jpg',
        },
        alloha: {
            autoplay: 1
        },
        kodik: {
            hide_selectors: true
        },
        // ...
    },
    hide: ['videocdn', 'collaps'],
    order: ['kodik', 'alloha'],
  }).init();

  
  // modalEl.innerHTML = `
  //   <div class="modal__card">
  //     <img class="modal__movie-backdrop" src="${respData.posterUrl}" alt="">
  //     <h2>
  //       <span class="modal__movie-title">${respData.nameRu}</span>
  //       <span class="modal__movie-release-year"> - ${respData.year}</span>
  //     </h2>
  //     <ul class="modal__movie-info">
  //       <div class="loader"></div>
  //       <li class="modal__movie-genre">Жанр - ${respData.genres.map((el) => `<span>${el.genre}</span>`)}</li>
  //       ${respData.filmLength ? `<li class="modal__movie-runtime">Время - ${respData.filmLength} минут</li>` : ''}
  //       <li >Сайт: <a class="modal__movie-site" href="${respData.webUrl}">${respData.webUrl}</a></li>
  //       <li class="modal__movie-overview">Описание - ${respData.description}</li>
  //     </ul>
  //     <button type="button" class="modal__button-close">Закрыть</button>
  //   </div>
  // `

  window.scrollTo({top: 0, behavior: 'smooth'});


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
})

window.addEventListener("keydown", (e) => {
  if (e.keyCode === 27) {
    closeModal();
  }
})
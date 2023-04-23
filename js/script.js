const global = {
    currentPage: window.location.pathname,
    search: {
        term: '',
        type: '',
        page: 1,
        totalPages: 1
    }
}

// fetch data from tmdb api

async function fetchData(endpoint) {
    showSpinner()
    const apiKey = '5aeccd4b580201f53436d491200ea899'
    const apiURL = `https://api.themoviedb.org/3/`
    const response = await fetch(`${apiURL}${endpoint}?api_key=${apiKey}&language=en-US`)
    const data = await response.json()
    hideSpinner()
    return data
}

async function search() {
    const query = window.location.search
    const urlParams = new URLSearchParams(query)
    
    global.search.type = urlParams.get('type')
    global.search.term = urlParams.get('search-term')

    if(global.search.term !== '') {
        const { results, total_pages, page } = await searchAPI()
        
        if (results.length === 0) {
            showAlert('No results found')
        }

        displaySearch(results)

        document.querySelector('#search-term').value = ''

    } else {
        showAlert('Please enter a search term')
    }
    
}

function displaySearch(results) {
    const container = document.querySelector('#search-results')
    results.forEach(results => {
        const card = document.createElement('div')
        card.classList.add('card')
        card.innerHTML = `
        <a href="${global.search.type}-details.html?id=${results.id}">
          ${
            results.poster_path
            ? `<img
            src="https://image.tmdb.org/t/p/w500/${results.poster_path}"
            class="card-img-top"
            alt="${global.search.type === 'movie' ? results.title :
            results.name}"
          />` : `<img
          src=""
          class="card-img-top"
          alt="${global.search.type === 'movie' ? results.title :
          results.name}"
        />`
          }
        </a>
        <div class="card-body">
          <h5 class="card-title">${global.search.type === 'movie' ? results.title :
          results.name}</h5>
          <p class="card-text">
            <small class="text-muted">Release: ${global.search.type === 'movie' ? results.release_date : results.first_air_date}</small>
          </p>
        </div>
        `
        container.appendChild(card)
    })
}

async function searchAPI() {
    showSpinner()
    const apiKey = '5aeccd4b580201f53436d491200ea899'
    const apiURL = `https://api.themoviedb.org/3/`
    const response = await fetch(`${apiURL}search/${global.search.type}?api_key=${apiKey}&language=en-US&query=${global.search.term}`)
    const data = await response.json()
    hideSpinner()
    return data
}

function showAlert(message) {
    const alert = document.createElement('div')
    alert.classList.add('alert')
    alert.appendChild(document.createTextNode(message))

    document.querySelector('#alert').appendChild(alert)

    setTimeout(() => {
        document.querySelector('#alert').removeChild(alert)
    }, 3000)
}

function addCommas(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

async function slider() {
    const { results } = await fetchData('movie/now_playing')
    console.log(results)
    
    results.forEach(movie => {
        const sliderCard = document.createElement('div')
        sliderCard.classList.add('swiper-slide')
        
        sliderCard.innerHTML =
        `
        <a href="movie-details.html?id=${movie.id}">
        <img ${movie.poster_path ? `src="https://image.tmdb.org/t/p/w500/${movie.poster_path}"` : `src="images/no-image.jpg"`} alt="${movie.title}" />
        </a>
        <h4 class="swiper-rating">
        <i class="fas fa-star text-secondary"></i> ${movie.vote_average} / 10
        </h4>
        
        `
        document.querySelector('.swiper-wrapper').appendChild(sliderCard)
        initSwiper()
    })
}

function initSwiper() {
    const swiper = new Swiper('.swiper', {
        slidesPerView: 1,
        spaceBetween: 20,
        freeMode: true,
        loop: false,
        autoplay: {
            delay: 5000,
            disableOnInteraction: true
        },
        breakpoints: {
            500: {
                slidesPerView: 2
            },
            750: {
                slidesPerView: 3
            },
            1000: {
                slidesPerView: 4
            },
            1250: {
                slidesPerView: 5
            }
        }
    })
}

async function getTvShowDetails() {
    const id = window.location.search.split('=')[1]
    const show = await fetchData(`tv/${id}`)

    console.log(show)

    backdrop('tv', show.backdrop_path)

    const display = document.createElement('div')

    display.innerHTML =
    `
        <div class="details-top">
        <div>
        ${
            show.poster_path ?
            `<img
            src="https://image.tmdb.org/t/p/w500/${show.poster_path}"
            class="card-img-top"
            alt="${show.name}"
            />` :
            `<img
            src="images/no-image.jpg"
            class="card-img-top"
            alt="${show.name}"
            />`
        }
        </div>
        <div>
        <h2>${show.name}</h2>
        <p>
            <i class="fas fa-star text-primary"></i>
            ${Math.round(show.vote_average * 10) / 10} / 10
        </p>
        <p class="text-muted">Release Date: ${show.first_air_date}</p>
        <p>
            ${show.overview}
        </p>
        <h5>Genres</h5>
        <ul class="list-group">
        ${
            show.genres.map(genre => `<li class="list-group-item">${genre.name}</li>`).join(' ')
        }
        </ul>
        <a href="${show.homepage}" target="_blank" class="btn">Visit Show Homepage</a>
        </div>
    </div>
    <div class="details-bottom">
        <h2>Show Info</h2>
        <ul>
        <li><span class="text-secondary">Number Of Episodes:</span> ${show.number_of_episodes}</li>
        <li>
            <span class="text-secondary">Last Episode To Air:</span> ${show.last_episode_to_air.name}
        </li>
        <li><span class="text-secondary">Status:</span> ${show.status}</li>
        </ul>
        <h4>Production Companies</h4>
        <div class="list-group">${show.production_companies.map(company => `${company.name},`).join(' ').slice(0, -1)}</div>
    </div>
    `

    document.querySelector('#show-details').appendChild(display)
}

async function getMovieDetails() {
    const id = window.location.search.split('=')[1]
    const movie = await fetchData(`movie/${id}`)
    
    const card = document.createElement('div')

    backdrop('movie', movie.backdrop_path)

    console.log(movie)

    card.innerHTML = 
    `
        <div class="details-top">
        <div>
        ${
            movie.poster_path ?
            `<img
            src="https://image.tmdb.org/t/p/w500/${movie.poster_path}"
            class="card-img-top"
            alt="${movie.title}"
            />` :
            `<img
            src="images/no-image.jpg"
            class="card-img-top"
            alt="${movie.title}"
            />`
        }
        </div>
        <div>
        <h2>${movie.title}</h2>
        <p>
            <i class="fas fa-star text-primary"></i>
            ${Math.round(movie.vote_average * 10) / 10} / 10
        </p>
        <p class="text-muted">Release Date: ${movie.release_date}</p>
        <p>
            ${movie.overview}
        </p>
        <h5>Genres</h5>
        <ul class="list-group">
            ${
                movie.genres.map(genre => `<li class="list-group-item">${genre.name}</li>`).join(' ')
            }
        </ul>
        <a href="${movie.homepage}" target="_blank" class="btn">Visit Movie Homepage</a>
        </div>
    </div>
    <div class="details-bottom">
        <h2>Movie Info</h2>
        <ul>
        <li><span class="text-secondary">Budget:</span> $${addCommas(movie.budget)}</li>
        <li><span class="text-secondary">Revenue:</span> $${addCommas(movie.revenue)}</li>
        <li><span class="text-secondary">Runtime:</span> ${movie.runtime} minutes</li>
        <li><span class="text-secondary">Status:</span> ${movie.status}</li>
        </ul>
        <h4>Production Companies</h4>
        <div class="list-group">${movie.production_companies.map(company => `${company.name},`).join(' ').slice(0, -1)}</div>
    </div>
    `
    document.querySelector('#movie-details').appendChild(card)
}

function backdrop(type, input) {
    const backdrop = document.createElement('div')
    backdrop.style.backgroundImage = `url(https://image.tmdb.org/t/p/original${input})`
    backdrop.style.backgroundSize = 'cover';
    backdrop.style.backgroundPosition = 'center';
    backdrop.style.backgroundRepeat = 'no-repeat';
    backdrop.style.height = '100vh';
    backdrop.style.width = '100vw';
    backdrop.style.position = 'absolute';
    backdrop.style.top = '0';
    backdrop.style.left = '0';
    backdrop.style.zIndex = '-1';
    backdrop.style.opacity = '0.1';

    type === 'movie' ? document.querySelector('#movie-details').appendChild(backdrop) : document.querySelector('#show-details').appendChild(backdrop)
}

async function displayPopularTvShows() {
    const container = document.querySelector('#popular-shows')
    const { results } = await fetchData('tv/popular')
    results.forEach(show => {
        const card = document.createElement('div')
        card.classList.add('card')
        card.innerHTML = 
        `
        <div class="card">
          <a href="tv-details.html?id=${show.id}">
            <img
            ${
                show.poster_path ?
                `<img
                    src="https://image.tmdb.org/t/p/w500/${show.poster_path}"
                    class="card-img-top"
                    alt="${show.name}" 
                />` :
                `<img
                src=""
                class="card-img-top"
                alt="${show.name}"
                />` 
            }
          </a>
          <div class="card-body">
            <h5 class="card-title">${show.name}</h5>
            <p class="card-text">
              <small class="text-muted">Aired: ${show.first_air_date}</small>
            </p>
          </div>
        </div>
        `
        container.appendChild(card)
    })
}

async function displayPopularMovies() {
    const container = document.querySelector('#popular-movies')
    const { results } = await fetchData('movie/popular')
    results.forEach(movie => {
        const card = document.createElement('div')
        card.classList.add('card')
        card.innerHTML = `
        <a href="movie-details.html?id=${movie.id}">
          ${
            movie.poster_path
            ? `<img
            src="https://image.tmdb.org/t/p/w500/${movie.poster_path}"
            class="card-img-top"
            alt="${movie.title}"
          />` : `<img
          src=""
          class="card-img-top"
          alt="${movie.title}"
        />`
          }
        </a>
        <div class="card-body">
          <h5 class="card-title">${movie.title}</h5>
          <p class="card-text">
            <small class="text-muted">Release: ${movie.release_date}</small>
          </p>
        </div>
        `
        container.appendChild(card)
    })
}

function highlightLink() {
    const links = document.querySelectorAll('.nav-link')
    links.forEach(link => {
        if (link.getAttribute('href') === global.currentPage) {
            link.classList.add('active')
        }
    })
}

function showSpinner() {
    const spinner = document.querySelector('.spinner')
    spinner.classList.add('show')
}

function hideSpinner() {
    const spinner = document.querySelector('.spinner')
    spinner.classList.remove('show')
}

function init() {
    switch (global.currentPage) {
        case '/':
        case '/index.html':
            displayPopularMovies()
            slider()
            break;
        case '/movie-details.html':
            getMovieDetails()
            break;
        case '/search.html': 
            search()
            break;
        case '/shows.html':
            displayPopularTvShows()
            break;
        case '/tv-details.html':
            getTvShowDetails()
            break;
    }

    highlightLink()
}



document.addEventListener('DOMContentLoaded', init)
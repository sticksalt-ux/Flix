const global = {
    currentPage: window.location.pathname,
}

// fetch data from tmdb api

async function fetchData(endpoint) {
    const apiKey = '5aeccd4b580201f53436d491200ea899'
    const apiURL = `https://api.themoviedb.org/3/`
    const response = await fetch(`${apiURL}${endpoint}?api_key=${apiKey}&language=en-US`)
    const data = await response.json()
    return data
}

async function displayPopularMovies() {
    const container = document.querySelector('#popular-movies')
    const { results } = await fetchData('movie/popular')
    console.log(results)
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
            alt="Movie Title"
          />` : `<img
          src=""
          class="card-img-top"
          alt="Movie Title"
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

function init() {
    switch (global.currentPage) {
        case '/':
        case '/index.html':
            displayPopularMovies()
            break;
        case '/movie-details.html':
            console.log('Movie Details')
            break;
        case '/search.html': 
            console.log('Search')
            break;
        case '/shows.html':
            console.log(global.currentPage)
            break;
        case '/tv-details.html':
            console.log(global.currentPage)
            break;
    }

    highlightLink()
}



document.addEventListener('DOMContentLoaded', init)
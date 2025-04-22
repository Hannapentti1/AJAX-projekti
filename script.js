const theaterSelect = document.getElementById('theaterSelect');
const searchInput = document.getElementById('searchInput');
const movieContainer = document.getElementById('movieContainer');
const dateInput = document.getElementById('dateInput');
const apiKey = 'your-omdb-api-key'; // Replace with your actual OMDb API key.
const proxyUrl = 'https://cors-anywhere.herokuapp.com/'; // Use a proxy for CORS issues.

let moviesData = [];

// Fetch XML data
async function fetchXML(url) {
  const response = await fetch(proxyUrl + url); // Use proxy for CORS.
  const text = await response.text();
  return new window.DOMParser().parseFromString(text, "text/xml");
}

// Load theaters from Finnkino API
async function loadTheaters() {
  const xml = await fetchXML('http://www.finnkino.fi/xml/TheatreAreas');
  const areas = xml.querySelectorAll('TheatreArea');

  theaterSelect.innerHTML = '<option value="">Valitse teatteri</option>';

  areas.forEach(area => {
    const id = area.querySelector('ID').textContent;
    const name = area.querySelector('Name').textContent;
    const option = document.createElement('option');
    option.value = id;
    option.textContent = name;
    theaterSelect.appendChild(option);
  });
}

// Load movies for a specific theater and date
async function loadMovies(theaterId, date) {
  if (!theaterId) return;

  const url = `http://www.finnkino.fi/xml/Schedule/?area=${theaterId}&dt=${date}`;
  const xml = await fetchXML(url);
  const shows = xml.querySelectorAll('Show');

  moviesData = Array.from(shows).map(show => ({
    title: show.querySelector('Title').textContent,
    image: show.querySelector('EventLargeImagePortrait').textContent,
    genres: show.querySelector('Genres')?.textContent || "Unknown",
    theater: show.querySelector('Theatre').textContent,
    startTime: new Date(show.querySelector('dttmShowStart').textContent).toLocaleString()
  }));

  displayMovies(moviesData);
}

// Display movies in the container
function displayMovies(movies) {
  const searchTerm = searchInput.value.toLowerCase();
  const filteredMovies = movies.filter(movie =>
    movie.title.toLowerCase().includes(searchTerm)
  );

  movieContainer.innerHTML = filteredMovies.length
    ? filteredMovies.map(movie => `
      <div class="movie">
        <img src="${movie.image}" alt="${movie.title}">
        <h3>${movie.title}</h3>
        <p><strong>Genres:</strong> ${movie.genres}</p>
        <p><strong>Theater:</strong> ${movie.theater}</p>
        <p><strong>Showtime:</strong> ${movie.startTime}</p>
      </div>
    `).join('')
    : '<p>No movies found.</p>';
}

// Fetch movie details from OMDb API
async function fetchMovieDetails(title) {
  const url = `https://www.omdbapi.com/?t=${encodeURIComponent(title)}&apikey=${apiKey}`;
  const response = await fetch(url);
  const data = await response.json();

  if (data.Response === 'True') {
    console.log('Movie Details:', data);
  } else {
    console.error('Error fetching movie data:', data.Error);
  }
}

// Event listeners
theaterSelect.addEventListener('change', () => {
  const theaterId = theaterSelect.value;
  const selectedDate = dateInput.value || new Date().toISOString().split('T')[0];
  loadMovies(theaterId, selectedDate);
});

dateInput.addEventListener('change', () => {
  const theaterId = theaterSelect.value;
  const selectedDate = dateInput.value;
  if (theaterId) {
    loadMovies(theaterId, selectedDate);
  }
});

searchInput.addEventListener('input', () => {
  displayMovies(moviesData);
});

// Initialize
loadTheaters();
dateInput.valueAsDate = new Date();


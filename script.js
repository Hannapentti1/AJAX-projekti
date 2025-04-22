const theaterSelect = document.getElementById('theaterSelect');
const searchInput = document.getElementById('searchInput');
const movieContainer = document.getElementById('movieContainer');
const dateInput = document.getElementById('dateInput');
const apiKey = 'your-omdb-api-key'; // Lisää oma OMDB API-avain tähän.

let moviesData = []; // Elokuvien data talletetaan tänne

// Apufunktio XML-datan hakemiseen
async function fetchXML(url) {
  const response = await fetch(url);
  const text = await response.text();
  return new window.DOMParser().parseFromString(text, "text/xml");
}

// Lataa teatterialueet
async function loadTheaters() {
  const xml = await fetchXML("http://localhost:3000/theatre-areas"); // Käytä proxy-reittiä
  const areas = xml.querySelectorAll("TheatreArea");

  theaterSelect.innerHTML = '<option value="">Valitse teatteri</option>';

  areas.forEach((area) => {
    const id = area.querySelector("ID").textContent;
    const name = area.querySelector("Name").textContent;
    const option = document.createElement("option");
    option.value = id;
    option.textContent = name;
    theaterSelect.appendChild(option);
  });
}

// Lataa elokuvat aikataulun mukaan
async function loadMovies(theaterId, date) {
  if (!theaterId) return;

  const url = `http://localhost:3000/schedule?area=${theaterId}&date=${date}`; // Käytä proxy-reittiä
  const xml = await fetchXML(url);
  const shows = xml.querySelectorAll("Show");

  moviesData = Array.from(shows).map((show) => ({
    title: show.querySelector("Title").textContent,
    image: show.querySelector("EventLargeImagePortrait").textContent,
    genres: show.querySelector("Genres")?.textContent || "Unknown",
    theater: show.querySelector("Theatre").textContent,
    startTime: new Date(
      show.querySelector("dttmShowStart").textContent
    ).toLocaleString(),
  }));

  displayMovies(moviesData);
}

// Näytä elokuvat käyttöliittymässä
function displayMovies(movies) {
  const searchTerm = searchInput.value.toLowerCase();
  const filteredMovies = movies.filter((movie) =>
    movie.title.toLowerCase().includes(searchTerm)
  );

  movieContainer.innerHTML = filteredMovies.length
    ? filteredMovies
        .map(
          (movie) => `
      <div class="movie">
        <img src="${movie.image}" alt="${movie.title}">
        <h3>${movie.title}</h3>
        <p><strong>Genres:</strong> ${movie.genres}</p>
        <p><strong>Theater:</strong> ${movie.theater}</p>
        <p><strong>Showtime:</strong> ${movie.startTime}</p>
      </div>
    `
        )
        .join("")
    : "<p>No movies found.</p>";
}

// Hae yksittäisen elokuvan tiedot OMDB:ltä
async function fetchMovieDetails(title) {
  const url = `http://www.omdbapi.com/?t=${encodeURIComponent(title)}&apikey=${apiKey}`;
  const response = await fetch(url);
  const data = await response.json();

  if (data.Response === "True") {
    console.log("Movie Details:", data);
    displayMovieDetails(data);
  } else {
    console.log("Error fetching movie data:", data.Error);
  }
}

// Näytä yksityiskohtaiset elokuvatiedot
function displayMovieDetails(data) {
  const movieDetailDiv = document.createElement("div");
  movieDetailDiv.className = "movie-detail";

  movieDetailDiv.innerHTML = `
    <h2>${data.Title}</h2>
    <img src="${data.Poster}" alt="${data.Title}" />
    <p><strong>Plot:</strong> ${data.Plot}</p>
    <p><strong>Rating:</strong> ${data.imdbRating}</p>
    <p><strong>Released:</strong> ${data.Released}</p>
  `;

  movieContainer.appendChild(movieDetailDiv);
}

// Tapahtumankuuntelijat
theaterSelect.addEventListener("change", () => {
  const theaterId = theaterSelect.value;
  const selectedDate = dateInput.value || new Date().toISOString().split("T")[0]; // Oletuspäivämäärä
  loadMovies(theaterId, selectedDate);
});

dateInput.addEventListener("change", () => {
  const theaterId = theaterSelect.value;
  const selectedDate = dateInput.value;
  if (theaterId) {
    loadMovies(theaterId, selectedDate);
  }
});

searchInput.addEventListener("input", () => {
  displayMovies(moviesData); // Suodata elokuvat hakutermillä
});

// Lataa teatterit alussa
loadTheaters();

// Aseta oletuspäivämäärä
dateInput.valueAsDate = new Date();

// Testaa OMDB-tiedot (poista tämä tuotantokäytöstä)
fetchMovieDetails("Inception");


const theaterSelect = document.getElementById('theaterSelect');
const searchInput = document.getElementById('searchInput');
const movieContainer = document.getElementById('movieContainer');
const dateInput = document.getElementById('dateInput');
const apiKey = 'a025fbba'; 

let moviesData = []; 

async function fetchXML(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status}`);
    }
    const text = await response.text();
    const xml = new window.DOMParser().parseFromString(text, "text/xml");
    console.log("XML-tiedosto ladattu:", xml);
    return xml;
  } catch (error) {
    console.error("Virhe ladattaessa XML-tiedostoa:", error);
    alert("Tietojen lataaminen epäonnistui.");
  }
}

// Teattereiden lataaminen
async function loadTheaters() {
  try {
    const xml = await fetchXML('http://www.finnkino.fi/xml/TheatreAreas');
    if (!xml) {
      console.error("Teatterialueiden lataaminen epäonnistui.");
      return;
    }

    const areas = xml.querySelectorAll('TheatreArea');
    if (areas.length === 0) {
      console.error("Teatterialueita ei löytynyt.");
    }

    theaterSelect.innerHTML = '<option value="">Valitse teatteri</option>';

    areas.forEach(area => {
      const id = area.querySelector('ID').textContent;
      const name = area.querySelector('Name').textContent;
      const option = document.createElement('option');
      option.value = id;
      option.textContent = name;
      theaterSelect.appendChild(option);
    });
  } catch (error) {
    console.error("Virhe ladattaessa teattereita:", error);
  }
}

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

document.addEventListener("DOMContentLoaded", () => {
  loadTheaters();
  dateInput.valueAsDate = new Date();
});



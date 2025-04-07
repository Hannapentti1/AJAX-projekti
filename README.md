# 🎬 Movie Information App

A responsive and stylish movie information web application that uses live data from the Finnkino REST API. Users can browse currently playing movies in various Finnish theatres, view showtimes, and search movies with custom input.

## 🌐 Live Features

- Select a **theatre** from a dropdown list
- View **ongoing movies** at the selected theatre
- See **movie posters**, **descriptions**, and **showtimes**
- Clean and responsive **layout and styling**
- **Custom search input** for filtering movie titles *(Bonus feature)*

## 📡 Data Source

This app uses the **Finnkino REST API** for real-time movie and schedule information.

- Theatre list: `http://www.finnkino.fi/xml/TheatreAreas/`
- Schedule: `http://www.finnkino.fi/xml/Schedule/?area=<TheatreID>`
- API Docs: [Finnkino XML Feed](http://www.finnkino.fi/xml)

## 🚀 How to Run

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/movie-info-app.git
   cd movie-info-app

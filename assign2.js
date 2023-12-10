const url = 'https://www.randyconnolly.com/funwebdev/3rd/api/music/songs-nested.php';

function fetchData() {
    return fetch(url)
        .then(response => {
            if (!response.ok) {
                console.error('Network response was not ok');
                return Promise.resolve(null);
            }
            return response.json();
        })
        .then(data => {
            if (data !== null) {
                localStorage.setItem('songData', JSON.stringify(data));
            }
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
}


//checking if the data is already in the local storage
function getSongData() {
  const storedData = localStorage.getItem('songData');

  if (storedData) {
    return JSON.parse(storedData);
  } else {
    return fetchData().then(() => {
      return [];
    });
  }
}

//searches for the filtered song option and return the list of songs
function getFilteredSongs() {
  const titleFilter = document.querySelector('#title').value.toLowerCase();
  const selectedRadio = document.querySelector('input[name="searchType"]:checked');
  const inputFieldName = selectedRadio ? selectedRadio.value : '';

  if (inputFieldName === 'title') {
    return getSongData().filter(song => song.title.toLowerCase().includes(titleFilter));
  }

  const inputField = document.querySelector(`#${inputFieldName}`);

  if (!inputField) {
    console.error("Input Field not found");
    return [];
  }

  const filterValue = inputField.value.toLowerCase();

  return getSongData().filter(song => {
    const fieldValue = (inputFieldName === 'artist') ? song.artist.name.toLowerCase() :
                       (inputFieldName === 'genre') ? song.genre.name.toLowerCase() : '';

    return fieldValue.includes(filterValue);
  });
}

//rendering the song list on load
function renderSongList() {
  const songListElement = document.querySelector('#songTable');

  const songData = getSongData();
  const tbody = songListElement.querySelector('tbody');
  tbody.innerHTML = '';

  songData.forEach(song => {
      const row = tbody.insertRow();

      row.insertCell(0).textContent = song.title;
      row.insertCell(1).textContent = song.artist.name;
      row.insertCell(2).textContent = song.year;
      row.insertCell(3).textContent = song.genre.name;
      row.insertCell(4).textContent = song.details.popularity;

      const addToPlaylistButtonCell = row.insertCell(5);
      const addToPlaylistButton = document.createElement('button');
      addToPlaylistButton.textContent = 'Add to Playlist';
      addToPlaylistButton.addEventListener('click', () => addToPlaylist(song));
      addToPlaylistButtonCell.appendChild(addToPlaylistButton);

      row.addEventListener('click', () => showSingleSongView(song));
  });
}


//populating the select menus
function populateSelectMenus() {
   const songData = getSongData();
   const artistSelect = document.querySelector('#artist');
   const genreSelect = document.querySelector('#genre');
 
   artistSelect.innerHTML = '<option value="">All Artists</option>';
   genreSelect.innerHTML = '<option value="">All Genres</option>';
 
   const uniqueArtists = new Set();
   const uniqueGenres = new Set();
 
   songData.forEach(song => {
     uniqueArtists.add(song.artist.name);
     uniqueGenres.add(song.genre.name);
   });
 
   uniqueArtists.forEach(artist => {
     const option = document.createElement('option');
     option.value = artist;
     option.textContent = artist;
     artistSelect.appendChild(option);
   });
 
   uniqueGenres.forEach(genre => {
     const option = document.createElement('option');
     option.value = genre;
     option.textContent = genre;
     genreSelect.appendChild(option);
   });
 }
//applies the filters based on which option is chosen
 function applyFilters() {
  const titleFilter = document.querySelector('#title').value.toLowerCase();
  const selectedRadio = document.querySelector('input[name="searchType"]:checked');

  if (!selectedRadio) {
    console.error("No radio button selected");
    return;
  }

  const inputFieldName = selectedRadio.value; 

  if (inputFieldName === 'title') {
    const filteredSongs = getSongData().filter(song => song.title.toLowerCase().includes(titleFilter));
    renderFilteredSongs(filteredSongs);
    return;
  }

  const inputField = document.querySelector(`#${inputFieldName}`); 

  if (!inputField) {
    console.error("Input Field not found");
    return;
  }

  const filterValue = inputField.value.toLowerCase();

  const filteredSongs = getSongData().filter(song => {
    const fieldValue = (inputFieldName === 'artist') ? song.artist.name.toLowerCase() :
                       (inputFieldName === 'genre') ? song.genre.name.toLowerCase() : '';

    return fieldValue.includes(filterValue);
  });

  renderFilteredSongs(filteredSongs);
}


function renderFilteredSongs(filteredSongs) {
const songListElement = document.querySelector('#songTable');
const tbody = songListElement.querySelector('tbody');
const singlesong = document.querySelector('#single-song-view');

  while (tbody.firstChild) {
    tbody.removeChild(tbody.firstChild);
  }

  filteredSongs.forEach(song => {
    const row = tbody.insertRow();

    row.insertCell(0).textContent = song.title;
    row.insertCell(1).textContent = song.artist.name;
    row.insertCell(2).textContent = song.year;
    row.insertCell(3).textContent = song.genre.name;
    row.insertCell(4).textContent = song.details.popularity;
    singlesong.style.display = 'none';
  });
}

function clearFilters() {

   document.querySelector('#title').value = '';
   document.querySelector('#artist').value = '';
   document.querySelector('#genre').value = '';

   renderSongList();
 }

 function sortSongs(sortField) {
  const songListElement = document.querySelector('#songTable');
  const tbody = songListElement.querySelector('tbody');
  const rows = Array.from(tbody.querySelectorAll('tr'));

  const sortOrder = songListElement.getAttribute('data-sort-order') === 'asc' ? 'desc' : 'asc';

  rows.sort((rowA, rowB) => {
    const cellA = rowA.cells[getColumnIndex(sortField)].textContent.toLowerCase();
    const cellB = rowB.cells[getColumnIndex(sortField)].textContent.toLowerCase();

    return sortOrder === 'asc' ? cellA.localeCompare(cellB) : cellB.localeCompare(cellA);
  });

  songListElement.setAttribute('data-sort-order', sortOrder);

  tbody.innerHTML = '';

  rows.forEach(row => {
    tbody.appendChild(row);
  });
}

function getColumnIndex(columnName) {
  const headers = Array.from(document.querySelectorAll('#songTable th'));
  return headers.findIndex(header => header.textContent.toLowerCase() === columnName.toLowerCase());
}

function showSingleSongView(song) {
  const singleSongView = document.querySelector('#single-song-view');

  document.querySelector('#song-aname').textContent = song.title;
  document.querySelector('#song-genre').textContent = song.genre.name;
  document.querySelector('#song-year').textContent = song.year;
  document.querySelector('#song-duration').textContent = song.details.duration;
  document.querySelector('#song-bpm').textContent = song.details.bpm;
  document.querySelector('#song-energy').textContent = song.analytics.energy;
  document.querySelector('#song-danceability').textContent = song.analytics.danceability;
  document.querySelector('#song-liveness').textContent = song.analytics.liveness;
  document.querySelector('#song-valence').textContent = song.analytics.valence;
  document.querySelector('#song-acousticness').textContent = song.analytics.acousticness;
  document.querySelector('#song-speechiness').textContent = song.analytics.speechiness;
  document.querySelector('#song-popularity').textContent = song.details.popularity;
  
  selectedSong = song;
  
  singleSongView.style.display = 'flex'; 
  document.querySelector('#search').style.display = 'none';
  document.querySelector('#song-list').style.display = 'none';
  
  createRadarChart(song.analytics);
}

function createRadarChart(songDetails) {
  const radarChartContainer = document.querySelector('#radarChart');

  const existingChart = Chart.getChart(radarChartContainer);
  if (existingChart) {
    existingChart.destroy();
  }

  const radarChart = new Chart(radarChartContainer, {
    type: 'radar',
    data: {
      labels: ['Danceability', 'Energy', 'Valence', 'Speechiness', 'Loudness', 'Liveness'],
      datasets: [
        {
          label: 'Song Metrics',
          data: [
            songDetails.danceability,
            songDetails.energy,
            songDetails.valence,
            songDetails.speechiness,
            songDetails.loudness,
            songDetails.liveness,
          ],
          fill: true,
          backgroundColor: 'rgba(255, 255, 0, 0.2)', // Yellow background
          borderColor: 'rgb(255, 255, 0)', // Yellow border
          pointBackgroundColor: 'rgb(255, 255, 0)', // Yellow point
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: 'rgb(255, 255, 0)',
          point
        },
      ],
    },
  },
 
  );
}



function closeSingleSongView() {
  const singleSongView = document.querySelector('#single-song-view');

  singleSongView.style.display = 'none';
  document.querySelector('#search-section').style.display = 'block';
  document.querySelector('#song-list').style.display = 'block';
}


// Playlist View >>>>>>>>
function closeSonglist() {
  document.querySelector('#songTable').style.display = 'none';
  
    document.querySelector('#search').style.display = 'none';
    document.querySelector('#song-list').style.display = 'none';
    document.querySelector('#playlist-view').style.display='inline';
    document.querySelector('#radarChart').style.display = 'none';
    document.querySelector('#song-details-container').style.display = 'none';
}


let playlist = [];

function addToPlaylist(song) {
 
  if (song && song.title) {
      playlist.push(song);
      selectedSong = song; 
      document.querySelector('#single-song-view').style.display = 'none';
      renderPlaylist();
      
  } else {
      console.error("Invalid song object:", song);
  }
}

function removeFromPlaylist(index) {
    playlist.splice(index, 1);
    renderPlaylist();
}

function clearPlaylist() {
  playlist = [];
  renderPlaylist();
}

function credits() {
  var x = document.getElementById("creditsbutton");
        if (x.style.display === "none") {
            x.style.display = "block";
        } else {
            x.style.display = "none";
        }
}

function renderPlaylist() {
  const playlistTable = document.querySelector('#playlistTable tbody');
  const playlistSummary = document.querySelector('#playlist-summary');
  const popup = document.querySelector('#popup');


  playlistTable.innerHTML = '';

  playlist.forEach((song, index) => {
      const row = playlistTable.insertRow();
      row.insertCell(0).textContent = song.title;
      row.insertCell(1).textContent = song.artist.name;
      row.insertCell(2).textContent = song.year;
      row.insertCell(3).textContent = song.genre.name;
      row.insertCell(4).textContent = song.details.popularity;

      const removeCell = row.insertCell(5);
      const removeButton = document.createElement('button');
      removeButton.textContent = 'Remove';
      removeButton.addEventListener('click', () => removeFromPlaylist(index));
      removeCell.appendChild(removeButton);
  });

  playlistSummary.textContent = `Playlist summary: ${playlist.length} songs`;

  if (playlist.length > 0) {
      popup.textContent = 'Song added to playlist!';
      popup.classList.add('show');
      setTimeout(() => {
          popup.classList.remove('show');
      }, 3000);
  }
}

let selectedSong;

document.addEventListener('DOMContentLoaded', function () {
  fetchData().then(() => {
    renderSongList();
    renderPlaylist();
    populateSelectMenus();
    

    const filterButton = document.querySelector('#filterButton');
    if (filterButton) {
      filterButton.addEventListener('click', applyFilters);
    }

    const PlaylistButton = document.querySelector('#PlaylistButton');
          PlaylistButton.addEventListener('click', closeSonglist);



  const clearButton = document.querySelector('#clearButton');
  if (clearButton) {
    clearButton.addEventListener('click', clearFilters);
  }

  const headers = document.querySelectorAll('#songTable th');
  headers.forEach(header => {
    header.addEventListener('click', () => sortSongs(header.textContent));
  });

  const songListElement = document.querySelector('#songTable tbody');
  songListElement.addEventListener('click', (event) => {
      const clickedRow = event.target.closest('tr');
  
      if (event.target.tagName.toLowerCase() === 'button') {
          return;
      }
  
      if (clickedRow) {
          songListElement.querySelectorAll('tr').forEach(row => row.classList.remove('selected'));
  
          clickedRow.classList.add('selected');
  
          const songIndex = Array.from(songListElement.children).indexOf(clickedRow);
          const songData = getSongData();
          const selectedSong = songData[songIndex];
          showSingleSongView(selectedSong);
      }
  });
  

  // Adding event listener for the Close View button
  const closeViewButton = document.querySelector('#closeViewButton');
  closeViewButton.addEventListener('click', closeSingleSongView);

  const addToPlaylistButton = document.querySelector('#addToPlaylistButton');
  if (addToPlaylistButton) {
      addToPlaylistButton.addEventListener('click', () => {
          if (selectedSong) {
              addToPlaylist(selectedSong);
          } else {
              console.error('No song selected to add to the playlist');
          }
      });
  }
  

  const filteredSongListElement = document.querySelector('#filteredSongList tbody');
  if (filteredSongListElement) {
    filteredSongListElement.addEventListener('click', (event) => {
      if (event) {
        const clickedRow = event.target.closest('tr');
        const songIndex = Array.from(filteredSongListElement.children).indexOf(clickedRow);
        const filteredSongs = getFilteredSongs();
        const selectedSong = filteredSongs[songIndex];
  
        showSingleSongView(selectedSong);
      
      }
    });
  }
});
});

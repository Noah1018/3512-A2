async function fetchData() {

   const response = await fetch('https://www.randyconnolly.com/funwebdev/3rd/api/music/songs-nested.php');
   const data = await response.json();
   localStorage.setItem('songData', JSON.stringify(data));
 }
 
 function getSongData() {
   const storedData = localStorage.getItem('songData');
 
   if (storedData) {
     return JSON.parse(storedData);
   } else {
     fetchData(); 
     return [];
   }
 }
 
 function renderSongList() {
   const songListElement = document.querySelector('#songTable');
 
   const songData = getSongData();
 
   songListElement.querySelector('tbody').innerHTML = '';
 
   songData.forEach(song => {
     const row = songListElement.querySelector('tbody').insertRow();
 
     row.insertCell(0).textContent = song.title;
     row.insertCell(1).textContent = song.artist.name;
     row.insertCell(2).textContent = song.year;
     row.insertCell(3).textContent = song.genre.name;
     row.insertCell(4).textContent = song.details.popularity;
   });
 }

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

 function applyFilters() {
  const titleFilter = document.querySelector('#title').value.toLowerCase();
  const selectedRadio = document.querySelector('input[name="searchType"]:checked');
  
  if (!selectedRadio) {
      console.error("No radio button selected");
      return;
  }

  const inputFieldId = selectedRadio.value;

  if (inputFieldId === 'title') {
      const filteredSongs = getSongData().filter(song => song.title.toLowerCase().includes(titleFilter));
      renderFilteredSongs(filteredSongs);
      return;
  }

  const inputField = document.getElementById(inputFieldId);

  if (!inputField) {
      console.error("Input Field not found");
      return;
  }

  const filterValue = inputField.value.toLowerCase();
  
  const filteredSongs = getSongData().filter(song => {
      const fieldValue = (inputFieldId === 'artist') ? song.artist.name.toLowerCase() :
                         (inputFieldId === 'genre') ? song.genre.name.toLowerCase() : '';

      return fieldValue.includes(filterValue);
  });

  renderFilteredSongs(filteredSongs);
}


 function renderFilteredSongs(filteredSongs) {
   const songListElement = document.querySelector('#songTable');
 
   songListElement.querySelector('tbody').innerHTML = '';
 
   filteredSongs.forEach(song => {
     const row = songListElement.querySelector('tbody').insertRow();
 
     row.insertCell(0).textContent = song.title;
     row.insertCell(1).textContent = song.artist.name;
     row.insertCell(2).textContent = song.year;
     row.insertCell(3).textContent = song.genre.name;
     row.insertCell(4).textContent = song.details.popularity;
 
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

document.addEventListener('DOMContentLoaded', function () {
  renderSongList(); 
  populateSelectMenus(); 

  const filterButton = document.querySelector('#filterButton');
  if (filterButton) {
    filterButton.addEventListener('click', applyFilters);
  }

  const clearButton = document.querySelector('#clearButton');
  if (clearButton) {
    clearButton.addEventListener('click', clearFilters);
  }

  const headers = document.querySelectorAll('#songTable th');
  headers.forEach(header => {
    header.addEventListener('click', () => sortSongs(header.textContent));
  });
});
 


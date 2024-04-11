const url = '/data.json';

fetch(url)
  .then(response => response.json())
  .then(data => {
    // Toegang krijgen tot specifieke gegevens
    console.log(data);
  })
  .catch(error => console.error('Error:', error));
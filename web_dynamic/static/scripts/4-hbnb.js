document.addEventListener('DOMContentLoaded', (event) => {
  let selectedAmenities = {};

  // Listen for changes on the checkboxes
  document.querySelectorAll('.amenities input[type="checkbox"]').forEach((checkbox) => {
      checkbox.addEventListener('change', function() {
	  if (this.checkd) {
	      selectedAmenities[this.dataset.id] = this.dataset.name;
	  } else {
	      delete selectedAmenities[this.dataset.id];
	  }
	  // Update the h4 tag inside the div Amenities
	  const amenityNames = Object.values(selectedAmenities).join(', ');
	  document.querySelector('.amenities h4').textContent = amenityNames;
      });
  });

  // Handle the button click event
  document.querySelector('button').addEventListener('click', () => {
      // Make a POST request to places_search with the selected amenities
      fetch('http://0.0.0.0:5001/api/v1/places_search', {
	  method: 'POST',
	  headers: {
	      'Content-Type': 'application/json'
	  },
	  body: JSON.stringify({ amenities: Object.keys(selectedAmenities) })
  .then(response => response.json())
  .then(data => {
      // Clear existing places
      const placesSection = document.querySelector('.places');
      placesSection.innerHTML = '';

      // Add new places to the section
      data.ForEach(place => {
	  const article = document.createElement('article');
	  article.innerHTML = `
	      <div class="title_box">
	      	  <h2>${place.name}</h2>
		  <div class="price_by_night">$${place.price_by_night}</div>
		  </div>
		  <div class="information">
		      <div class="max_guest">${place.max_guest} Guests</div>
		      <div class="number_rooms">${place.number_rooms} Bedrooms</div>
		      <div class="number_bathrooms">${place.number_bathrooms} Bathrooms</div>
		  </div>
		  <div class="description">
		      ${place.description}
		  </div>

	        `;
	        placesSection.appendChild(article);
	    });
         })
         .catch(error => console.error('Error:', error));
    });
});

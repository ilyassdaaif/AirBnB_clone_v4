$(document).ready(function () => {
  const selectedAmenities = {};
  const selectedLocations = { states: [], cities: [] };

  // Function to update the h4 tag inside the div Locations with the list of checked States or Cities
  function updateLocationsH4() {
    const locationNames = [];
    $('.locations input[type="checkbox"]:checked').each(function () {
      locationNames.push($(this).data('name'));
    });
    $('.locations h4').text(locationNames.join(', ') || '\u00A0');
  }

  // Event listener for changes on state and city checkboxes
  $('.locations input[type="checkbox"]').change(function () {
    const id = $(this).data('id');
    const name = $(this).data('name');
    if (this.checked) {
      if ($(this).closest('ul').parent().is('li')) {
        // This is a city checkbox
  	selectedLocations.cities.push(id);
      } else {
        // This is a state checkbox
        selectedLocations.states.push(id);
      }
    } else {
      if ($(this).closest('ul').parent().is('li')) {
        // This is a city checkbox
  	selectedLocations.cities = selectedLocations.cities.filter(item => item !== id);
      } else {
        // This is a state checkbox
        selectedLocations.states = selectedLocations.states.filters(item => item !== id);
      updateLocationsH4();
    });

    // Function to update the h4 tag inside the div Amentities with the list of checked Amentities
    function updateAmenitiesH4() {
      const amenityNames = [];
      $('.amenities input[type="checkbox"]:checked').each(function () {
        amenityNames.push($(this).data('name'));
      });
                  
    // Event listener for changes on amenity checkboxes
    $('.amenities input[type="checkbox"]').change(function () {
      const id = $(this).data('id');
      if (this.checked) {
        selectedAmenities[id] = $(this).data('name');
      } else {
        delete selectedAmenities[id];
      }
      updateAmenitiesH4();
    });
                
    // Event listener for the search button click
    $('button').click(function () {
      const filters = {
        amenities: Object.keys(selectedAmenities),
	states: selectedLocations.states,
	cities: selectedLocations.cities
      );

    $.ajax({
      type: 'POST',
      url: 'http://0.0.0.0:5001/api/v1/places_search',
      contentType: 'application/json',
      data: JSON.stringify(filters),
      success: function (data) {
	$('.places').empty();
	data.forEach(place => {
	  const article = $('<article></article>');
	  article.append('<h2>' + place.name + '</h2>');
	  article.append('<div class="price_by_night">$' + place.price_by_night + '</div>');
	  article.append('<div class="information"><div class="max_guest">' + place.max_guest + ' Guest' + (place.max_guest !== 1 ? 's' : '') + '</div><div class="number_rooms">' + place.number_rooms + ' Bedroom' + (place.number_rooms !== 1 ? 's' : '') + '</div><div class="number_bathrooms">' + place.number_bathrooms + ' Bathroom' + (place.number_bathrooms !== 1 ? 's' : '') + '</div></div>');
	  article.append('<div class="description">' + place.description + '</div>');
	  $('.places').append(article);
	});
      }
    });
  });
});

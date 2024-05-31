$(document).ready(function() {
    // Initialize an empty dictionary to store checked amenities
    var checkedAmenities = {};

    // Listen for changes on each input checkbox tag
    $('input[type="checkbox"]').change(function() {
	var amenityId = $(this).data('id');
	var amenityName = $(this).data('name');
	
	if ($(this).is(":checked")) {
	    checkedAmenities[amenityId] = amenityName;
	} else {
	    delete checkedAmenities[amenityId];
	}
	
	// Update the h4 tag inside the div Amentities with the list of Amenities checked
	var amenitiesList = Object.values(checkedAmenities).join(', ');
	$('.amenities h4').text(amenitiesList);
    });
});

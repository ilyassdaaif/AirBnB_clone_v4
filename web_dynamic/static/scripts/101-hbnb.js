$(document).ready(function () {
  const selected = { amenities: {}, states: [], cities: [] };

  function updateH4(selector, items) {
    const names = items.map(id => $(`${selector} input[data-id="${id}"]`).data('name'));
    $(selector).find('h4').text(names.join(', ') || '\u00A0');
  }

  function handleChange(selector, key) {
    $(`${selector} input[type="checkbox"]`).change(function () {
      const id = $(this).data('id');
      if (this.checked) {
	key === 'amenities' ? selected[key][id] = $(this).data('name') : selected[key].push(id);
      } else {
	key === 'amenities' ? delete selected[key][id] : selected[key] = selected[key].filter(item => item !== id);
      }
      updateH4(selector, key === 'amenities' ? Object.keys(selected[key]) : selected[key]);
    });
  }

  handleChange('.locations', 'states');
  handleChange('.locations', 'cities');
  handleChange('.amenities', 'amenities');

  $('button').click(function () {
    const filters = {
      amenities: Object.keys(selected.amenities),
      states: selected.states,
      cities: selected.cities
    };

    $.post('http://0.0.0.0:5001/api/v1/places_search', JSON.stringify(filters), function (data) {
      $('.places').empty();
      data.forEach(place => {
	const article = ${`
	  <article>
	    <h2>${place.name}</h2>
	    <div class="price_by_night">$${place.price_by_night}</div>
	    <div class="information">
	      <div class="max_guest">${place.max_guest} Guest${place.max_guest !== 1 ? 's' : ''}</div>
	      <div class="number_rooms">${place.number_rooms} Bedroom${place.number_rooms !== 1 ? 's' : ''}</div>
	      <div class="number_bathrooms">${place.number_bathrooms} Bathroom${place.number_bathrooms !== 1 ? 's' : ''}</div>
	    </div>
	    <div class="description">${place.description}</div>
	    <h2>Reviews <span class="toggle-reviews" data-place-id="${place.id}" style="cursor: pointer; color: blue;">show</span></h2>
	    <div class="reviews style="display: none;"</div>
	  </article>
	`);
        $('.places').append(article);
      });
    });
  });

  $(document).on('click', '.toggle-reviews', function () {
    const span = $(this);
    const reviewsDiv = span.closest('article').find('.reviews');

    if (span.text() === 'show') {
      $.get(`http://0.0.0.0:5001/api/v1/places/${span.data('place-id')}/reviews`, function (data) {
	reviewsDiv.empty();
	data.forEach(review => {
	  const reviewElement = $(`<div class="review"><h3>${review.user_id}</h3><p>${review.text}</p></div>`);
	  reviewsDiv.append(reviewElement);
	});
	span.text('hide');
	reviewsDiv.show();
      });
    } else {
      span.text('show');
      reviewsDiv.hide().empty();
    }
  });
});

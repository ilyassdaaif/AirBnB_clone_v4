#!/usr/bin/python3
"""
Flask App that integrates with AirBnB static HTML Template
"""
from flask import Flask, render_template
from models import storage
import uuid

# Flask setup
app = Flask(__name__)
app.url_map.strict_slashes = False
port = 5000
host = '0.0.0.0'

# Generate UUID for cache busting
cache_id = uuid.uuid4()

@app.teardown_appcontext
def teardown_db(exception):
    """
    After each request, this method calls `.close()` on
    the current SQLAlchemy Session.
    """
    storage.close()

@app.route('/4-hbnb')
def hbnb_filters():
    """
    Handles request to custom template with states, cities & amenities
    """
    # Retrieve data from storage
    states = storage.all('State').values()
    amenities = storage.all('Amenity').values()
    places = storage.all('Place').values()
    users = storage.all('User').values()

    return render_template('4-hbnb.html',
                           cache_id=cache_id,
                           states=states,
                           amenities=amenities,
                           places=places,
                           users=users)

if __name__ == "__main__":
    """
    Main Flask App
    """
    app.run(host=host, port=port)

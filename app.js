document.getElementById('trackNumber').addEventListener('click', function () {
    const phoneNumber = document.getElementById('phoneInput').value;
    const numverifyApiKey = '93542842912e43493f8f9c51037e8508'; //  Numverify API key
    const positionStackApiKey = '5f8d8e76458c9841a0844bacfa487081'; //  PositionStack API key

    // Validating the phone number using Numverify API
    fetch(`https://apilayer.net/api/validate?access_key=${numverifyApiKey}&number=${phoneNumber}`)
        .then(response => response.json())
        .then(data => {
            const resultDiv = document.getElementById('result');

            if (data && data.valid) {
                resultDiv.innerHTML = `
                    <h2>Phone Number Information:</h2>
                    <p style="color: #fff"><strong>Phone:</strong> ${data.number}</p>
                    <p style="color: #fff"><strong>Country:</strong> ${data.country_name}</p>
                    <p style="color: #fff"><strong>Location:</strong> ${data.location}</p>
                    <p style="color: #fff"><strong>Carrier:</strong> ${data.carrier}</p>
                `;

                // Get the country name and fetch geolocation
                const country = data.country_name;

                return fetch(`http://api.positionstack.com/v1/forward?access_key=${positionStackApiKey}&query=${encodeURIComponent(country)}`);
            } else {
                resultDiv.innerHTML = `<p style="color:red;">Error: Invalid phone number or no location found.</p>`;
                throw new Error('Invalid phone number or no location found.');
            }
        })
        .then(response => response.json())
        .then(geoData => {
            const resultDiv = document.getElementById('result');

            if (geoData && geoData.data && geoData.data.length > 0) {
                const latitude = geoData.data[0].latitude;
                const longitude = geoData.data[0].longitude;

                resultDiv.innerHTML += `
                    <p style="color:red;"><strong>Latitude:</strong> ${latitude}</p>
                    <p style="color:red;"><strong>Longitude:</strong> ${longitude}</p>
                `;

                // Initialize the map
                initMap(latitude, longitude);
            } else {
                resultDiv.innerHTML += `<p style="color:red;">Error: Geolocation data not found.</p>`;
                throw new Error('Geolocation data not found.');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            const resultDiv = document.getElementById('result');
            resultDiv.innerHTML = `<p style="color:red;">Error: ${error.message}</p>`;
        });
});

// Function to initialize Google Map
function initMap(lat, lng) {
    const map = new google.maps.Map(document.getElementById("map"), {
        zoom: 10,
        center: { lat: lat, lng: lng },
    });

    // Add a marker at the provided latitude and longitude
    new google.maps.Marker({
        position: { lat: lat, lng: lng },
        map: map,
    });
}

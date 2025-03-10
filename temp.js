function submitCountry() {
    const countryName = document.getElementById('countryName').value;

    if (!countryName) {
        document.getElementById('errorMessage').textContent = 'Please enter a country name.';
        return;
    }

    // Clear previous error messages
    document.getElementById('errorMessage').textContent = '';

    // Fetch data from the REST Countries API

    fetch(`https://restcountries.com/v3.1/name/${countryName}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Country does not exist');
            }
            return response.json();
        })
        .then(data => {
            const country = data[0];  // We take the first country in case of multiple matches
            const capital = country.capital ? country.capital[0] : 'No capital available';
            const population = country.population;
            const region = country.region || 'No region available';
            const flag = country.flags.svg || '';

            // Update DOM with the country information
            document.getElementById('capital').textContent = `Capital: ${capital}`;
            document.getElementById('population').textContent = `Population: ${population}`;
            document.getElementById('region').textContent = `Region: ${region}`;

            // Update the flag, and ensure it's displayed on a new line
            const flagImg = document.getElementById('flag');
            flagImg.src = flag;

            // Handle bordering countries (neighbours)
            const neighboursList = document.getElementById('borderingCountriesList');
            neighboursList.innerHTML = ''; // Clear previous neighbours

            const neighbours = country.borders || [];
            neighbours.forEach(borderCode => {
                fetch(`https://restcountries.com/v3.1/alpha/${borderCode}`)
                    .then(response => response.json())
                    .then(neighbourData => {
                        const neighbour = neighbourData[0];
                        const neighbourName = neighbour.name.common;
                        const neighbourFlag = neighbour.flags.svg;

                        const listItem = document.createElement('li');
                        listItem.innerHTML = `${neighbourName} <br> <img src="${neighbourFlag}" alt="${neighbourName}" width="100" />`;  // Display flag on a new line
                        neighboursList.appendChild(listItem);
                    })
                    .catch(err => console.error('Error fetching neighbour data:', err));
            });
        })
        .catch(error => {
            // Display error message if the fetch operation fails
            document.getElementById('errorMessage').textContent = error.message;
        });
}

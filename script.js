function submitCountry() {
    const countryName = document.getElementById('countryName').value;

    if (!countryName) {
        document.getElementById('errorMessage').textContent = 'Please enter a country name.';
        return;
    }

    document.getElementById('errorMessage').textContent = '';


    fetch(`https://restcountries.com/v3.1/name/${countryName}?fullText=true`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Country does not exist');
            }
            return response.json();
        })
        .then(data => {
            const country = data[0]; 
            const capital = country.capital[0];
            const population = country.population;
            const region = country.region;
            const flag = country.flags.svg;

            document.getElementById('capital').textContent = `Capital: ${capital}`;
            document.getElementById('population').textContent = `Population: ${population}`;
            document.getElementById('region').textContent = `Region: ${region}`;
            const flagImg = document.getElementById('flag');
            flagImg.src = flag;

            const neighboursList = document.getElementById('borderingCountriesList');
            neighboursList.innerHTML = ''; 

            const neighbours = country.borders || [];
            neighbours.forEach(borderCode => {
                fetch(`https://restcountries.com/v3.1/alpha/${borderCode}`)
                    .then(response => response.json())
                    .then(neighbourData => {
                        const neighbour = neighbourData[0];
                        const neighbourName = neighbour.name.common;
                        const neighbourFlag = neighbour.flags.svg;

                        const listItem = document.createElement('li');
                        listItem.innerHTML = `${neighbourName} <br> <img src="${neighbourFlag}" alt="${neighbourName}" width="200" />`;
                        neighboursList.appendChild(listItem);
                    })
                    .catch(err => console.error('Error while fetching data of neighbouring countries:', err));
            });
        })
        .catch(error => {
            document.getElementById('errorMessage').textContent = error.message;
        });
    }

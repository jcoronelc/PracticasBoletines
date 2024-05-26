
populateCountries();

async function populateCountries() {
    const countries = await fetchCountries();
    const countrySelect = document.getElementById('country');
    countries.forEach(iter => {
        const option = document.createElement('option');
        option.value = iter.country;
        option.textContent = iter.country;
        countrySelect.appendChild(option);
    });
}

async function populateStates(countryCode) {
    try {
        const countryData = await fetchStates(countryCode);
        const states = countryData.states;
        console.log('Estados de', countryCode, ':', states);

        const stateSelect = document.getElementById('state');
        stateSelect.innerHTML = '';

        if (states.length > 0) {
            states.forEach(state => {
                const option = document.createElement('option');
                option.value = state.name;
                option.textContent = state.name;
                stateSelect.appendChild(option);
            });
        } else {
            const option = document.createElement('option');
            option.value = '';
            option.textContent = 'No se encontraron estados';
            stateSelect.appendChild(option);
        }
    } catch (error) {
        console.error('Error al obtener los estados:', error);
    }
}

async function populateCities(countryName, stateCode) {
    try {
        const countryData = await fetchCities(countryName, stateCode);
        const cities = countryData;
        console.log('Ciudades de', stateCode, ':', cities);

        const citySelect = document.getElementById('city');
        citySelect.innerHTML = '';

        if (countryData.length > 0) {
            countryData.forEach(iter => {
                const option = document.createElement('option');
                option.value = iter;
                option.textContent = iter;
                citySelect.appendChild(option);
            });
        } else {
            const option = document.createElement('option');
            option.value = '';
            option.textContent = 'No se encontraron estados';
            citySelect.appendChild(option);
        }
    } catch (error) {
        console.error('Error al obtener los estados:', error);
    }
}

document.getElementById('country').addEventListener('change', async (event) => {
    const selectedCountry = event.target.value;
    populateStates(selectedCountry);
});

document.getElementById('state').addEventListener('change', async (event) => {
    const selectedState = event.target.value;
    const selectedCountry = document.getElementById('country').value;
    populateCities(selectedCountry, selectedState);
});

async function fetchCountries() {
    try {
        const response = await fetch('https://countriesnow.space/api/v0.1/countries');
        if (!response.ok) {
            throw new Error('Error al obtener la lista de países');
        }
        const data = await response.json();
        console.log('Datos de países:', data.data);
        return data.data;
    } catch (error) {
        console.error('Error al obtener la lista de países:', error);
        return [];
    }
}

async function fetchStates(countryName) {
    const url = 'https://countriesnow.space/api/v0.1/countries/states';
    const data = {
        country: countryName
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error('Failed to fetch states');
        }

        const responseData = await response.json();
        return responseData.data;
    } catch (error) {
        console.error('Error fetching states:', error.message);
        return [];
    }
}

async function fetchCities(countryName, stateName) {
    const url = 'https://countriesnow.space/api/v0.1/countries/state/cities';
    const data = {
        country: countryName,
        state: stateName
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error('Failed to fetch cities');
        }

        const responseData = await response.json();
        return responseData.data;
    } catch (error) {
        console.error('Error fetching cities by state:', error.message);
        return [];
    }
}

document.addEventListener('DOMContentLoaded', function () {
    var btnAgregarPersona = document.getElementById('btnAgregarPersona');
    var btnListaPersonas = document.getElementById('btnListaPersonas');

    var sectionAgregarPersona = document.getElementById('agregarPersona');
    var sectionListaPersonas = document.getElementById('listaPersonas');

    btnAgregarPersona.addEventListener('click', function () {
        sectionAgregarPersona.style.display = 'block';
        sectionListaPersonas.style.display = 'none';
    });

    btnListaPersonas.addEventListener('click', function () {
        sectionAgregarPersona.style.display = 'none';
        sectionListaPersonas.style.display = 'block';
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('submitForm');
    const personListLocal = document.getElementById('personList');
    const personListSession = document.getElementById('personListSessionBody');

    let currentIndex = null;
    let currentStorage = null;

    function cargarPersonas() {
        cargarPersonasDeAlmacenamiento('personas', personListLocal, localStorage);
        cargarPersonasDeAlmacenamiento('personasSession', personListSession, sessionStorage);
    }

    function cargarPersonasDeAlmacenamiento(key, tableElement, storage) {
        const personas = JSON.parse(storage.getItem(key)) || [];
        tableElement.innerHTML = '';

        personas.forEach((persona, index) => {
            const row = document.createElement('tr');

            ['name', 'lastName', 'cedula', 'phone', 'mail', 'dateofbirth', 'country', 'state', 'city', 'address1'].forEach(key => {
                const cell = document.createElement('td');
                cell.textContent = persona[key];
                row.appendChild(cell);
            });

            const cellActions = document.createElement('td');
            const dropdownDiv = document.createElement('div');
            dropdownDiv.classList.add('dropdown');

            const dropdownButton = document.createElement('button');
            dropdownButton.classList.add('btn', 'btn-secondary');
            dropdownButton.type = 'button';
            dropdownButton.setAttribute('data-toggle', 'dropdown');
            dropdownButton.setAttribute('aria-haspopup', 'true');
            dropdownButton.setAttribute('aria-expanded', 'false');
            dropdownButton.style.backgroundColor = '#0e7490';

            const iconSpan = document.createElement('span');
            iconSpan.classList.add('bi', 'bi-three-dots-vertical');
            dropdownButton.appendChild(iconSpan);

            const dropdownMenu = document.createElement('ul');
            dropdownMenu.classList.add('dropdown-menu');

            const actualizarItem = document.createElement('li');
            actualizarItem.classList.add('dropdown-item', 'actualizar');
            actualizarItem.textContent = 'Actualizar';
            actualizarItem.href = '#';

            actualizarItem.addEventListener('click', () => {
                actualizarPersona(index, storage);
                const modal = document.getElementById('modalUpdatePerson');
                const modalInstance = new bootstrap.Modal(modal);
                modalInstance.show();
            });

            const eliminarItem = document.createElement('li');
            eliminarItem.classList.add('dropdown-item', 'eliminar');
            eliminarItem.href = '#';
            eliminarItem.textContent = 'Eliminar';
            eliminarItem.addEventListener('click', () => {
                eliminarPersona(index, storage);
                showAlert('Persona eliminada exitosamente', 'success');
            });

            dropdownMenu.appendChild(actualizarItem);
            dropdownMenu.appendChild(eliminarItem);
            dropdownDiv.appendChild(dropdownButton);
            dropdownDiv.appendChild(dropdownMenu);
            cellActions.appendChild(dropdownDiv);

            dropdownButton.addEventListener('click', () => {
                dropdownMenu.classList.toggle('show');
            });

            row.appendChild(cellActions);

            tableElement.appendChild(row);
        });
    }

    function actualizarPersona(index, storage) {
        const personas = JSON.parse(storage.getItem(storage === localStorage ? 'personas' : 'personasSession')) || [];
        const persona = personas[index];

        document.getElementById('updateName').value = persona.name;
        document.getElementById('updateLastName').value = persona.lastName;
        document.getElementById('updateCedula').value = persona.cedula;
        document.getElementById('updatePhone').value = persona.phone;
        document.getElementById('updateMail').value = persona.mail;
        document.getElementById('updateDateOfBirth').value = persona.dateofbirth;
        document.getElementById('updateCountry').value = persona.country;
        document.getElementById('updateState').value = persona.state;
        document.getElementById('updateCity').value = persona.city;
        document.getElementById('updateAddress1').value = persona.address1;

        currentIndex = index;
        currentStorage = storage;
    }

    document.getElementById('saveChangesButton').addEventListener('click', () => {
        const personas = JSON.parse(currentStorage.getItem(currentStorage === localStorage ? 'personas' : 'personasSession')) || [];
        if (currentIndex !== null) {
            const updatedPersona = {
                name: document.getElementById('updateName').value,
                lastName: document.getElementById('updateLastName').value,
                cedula: document.getElementById('updateCedula').value,
                phone: document.getElementById('updatePhone').value,
                mail: document.getElementById('updateMail').value,
                dateofbirth: document.getElementById('updateDateOfBirth').value,
                country: document.getElementById('updateCountry').value,
                state: document.getElementById('updateState').value,
                city: document.getElementById('updateCity').value,
                address1: document.getElementById('updateAddress1').value
            };

            personas[currentIndex] = updatedPersona;
            currentStorage.setItem(currentStorage === localStorage ? 'personas' : 'personasSession', JSON.stringify(personas));
            cargarPersonas();
            $('#modalUpdatePerson').modal('hide');
        }

        showAlert('Persona actualizada exitosamente', 'success');
    });

    function eliminarPersona(index, storage) {
        const personas = JSON.parse(storage.getItem(storage === localStorage ? 'personas' : 'personasSession')) || [];
        personas.splice(index, 1);
        storage.setItem(storage === localStorage ? 'personas' : 'personasSession', JSON.stringify(personas));
        cargarPersonas();
    }

    form.addEventListener('submit', function (event) {
        event.preventDefault();

        const formData = new FormData(form);
        const persona = {};
        formData.forEach((value, key) => {
            persona[key] = value;
        });

        if (persona['country'] === 'Ecuador' && !validateCedula(persona['cedula'])) {
            showAlert('Cédula inválida.', 'danger');
            return false;
        }

        if (!/^[a-zA-Z\s]+$/.test(persona['name']) || !/^[a-zA-Z\s]+$/.test(persona['lastName'])) {
            showAlert('El nombre o apellido debe contener solo letras.', 'danger');
            return false;
        }

        if (isNaN(persona['cedula'])) {
            showAlert('La cédula debe ser numérica.', 'danger');
            return false;
        }

        if (isNaN(persona['phone'])) {
            showAlert('El teļéfono debe ser numérica.', 'danger');
            return false;
        }

        const personasLocal = JSON.parse(localStorage.getItem('personas')) || [];
        const personasSession = JSON.parse(sessionStorage.getItem('personasSession')) || [];

        personasLocal.push(persona);
        personasSession.push(persona);

        localStorage.setItem('personas', JSON.stringify(personasLocal));
        sessionStorage.setItem('personasSession', JSON.stringify(personasSession));

        cargarPersonas();
        showAlert('Persona agregada exitosamente', 'success');
        form.reset();
    });

    cargarPersonas();
});

function validateCedula(cedula) {
    if (cedula.length !== 10) {
        return false;
    }

    var lastDigit = Number(cedula.charAt(9));
    var cedulaDigits = cedula.substring(0, 9);
    var expectedDigit = 0;
    var sum = 0;

    for (var i = 0; i < cedulaDigits.length; i++) {
        var digit = Number(cedulaDigits.charAt(i));

        if (i % 2 === 0) {
            digit *= 2;

            if (digit > 9) {
                digit -= 9;
            }
        }

        sum += digit;
    }
    expectedDigit = (Math.ceil(sum / 10) * 10) - sum;
    return lastDigit === expectedDigit;
}

function showAlert(message, type = 'success') {
    const alertContainer = document.getElementById('alertContainer');
    const alert = document.createElement('div');
    alert.className = `alert alert-${type} alert-dismissible fade show`;
    alert.role = 'alert';
    alert.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;

    alertContainer.appendChild(alert);

    setTimeout(() => {
        alert.classList.remove('show');
        alert.classList.add('hide');
        setTimeout(() => alert.remove(), 150);
    }, 5000);
}

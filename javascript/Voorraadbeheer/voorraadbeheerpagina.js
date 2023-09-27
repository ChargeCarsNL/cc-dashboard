// --------------------------on page load-------------------------------
// Declare screens
let newUnitScreen = document.getElementById('new_unit_screen');
newUnitScreen.style.display = 'none';

// Declare form fields
let newUnitTextInput = document.getElementById('new_unit_text_input');
let voorraadSelect = document.getElementById('voorraad_select');
let userSelect = document.getElementById('eigenaar_select');
let artikelSoortSelect = document.getElementById('unit_label_select');
let barcodeAantalInput = document.getElementById('barcode_aantal_input');
const toggleSwitch = document.getElementById('toggleSwitch');

// Haal het barcode input element op
let barcodeInputElement = document.getElementById('barcode_scanner_input');

// Declare buttons
let closeButtonNewUnitScreen = document.getElementById('close_button_new_unit_screen');
let unitToevoegenButton = document.getElementById('unit_toevoegen_button');
let aanVoorraadToevoegenButton = document.getElementById('aan_voorraad_toevoegen_button');

// Declare an empty array to store the unit class items
let voorraadArtikelArray = [];

// Declare variables
let currentVoorraad = {};
let currentUser = {};

window.addEventListener('load', function () {
    runLoadingScreen('Initialiseren...');

    // verstop eigenaar select veld
    userSelect.style.display = 'none';

    updateVoorraadArtikelen();
    addListsToVoorraadInput();
    updateArtikelSoortOpties();
    updateMonteurs();
    focusBarcodeInput();
    stopLoadingScreen();

    // Log loading completion
    logToConsole('Page loaded successfully.', 'log-success');

});

async function updateVoorraadArtikelen() {
    // Dit update de lijst met beschikbare voorraad items (voorraadArtikelArray)
    const artikelenAppId = '6500ca1af3bd5b04b06af801';
    const url = `https://app.smartsuite.com/api/v1/applications/${artikelenAppId}/records/list/`;

    try {
        const response = await proxyFetch(url, {
            method: 'POST',
            headers: {
                'Account-Id': accountId,
                'Authorization': smartsuiteApiKey,
                'Content-Type': 'application/json', // Zet het juiste content-type voor JSON
            },
            body: JSON.stringify({
                filter: {
                    // filtert antwoorden op bepaalde voorwaarden
                    operator: 'and',
                    fields: [
                        {
                            comparison: 'is',
                            field: 's95756d359', // is voorraad artikel (boolean veld smartsuite)
                            value: true,
                        },
                    ],
                },
            }),
        });

        const data = await response; // Parsen van de response als JSON

        voorraadArtikelArray = data.items;
    } catch (error) {
        console.error('Error fetching voorraadArtikelen:', error);
        logToConsole('Probleem bij het ophalen van artikelen.', 'log-error');

        throw error; // Herwerp de error voor behandeling op een hoger niveau
    }
}

async function updateArtikelSoortOpties() {
    const url = `https://app.smartsuite.com/api/v1/applications/6500ca1af3bd5b04b06af801/`;
    try {
        const response = await proxyFetch(url, {
            method: 'GET',
            headers: {
                'Account-Id': accountId,
                'Authorization': smartsuiteApiKey,
            }
        });

        const data = await response; // Parsen van de response als JSON

        voorraadSoortOptionsObject = data.structure.find(obj => obj.slug === 's0bd2eaa09' /*soortartikel*/);
        ArtikelSoortArray = voorraadSoortOptionsObject.params.choices;

        // Clear all options
        while (artikelSoortSelect.options.length > 0) {
            artikelSoortSelect.remove(0);
        }

        // add artikelsoorten to select field
        for (let i = 0; i < ArtikelSoortArray.length; i++) {
            // Maak een nieuwe optie aan
            let newArtikelSoortOption = document.createElement('option');

            currentArtikelSoort = ArtikelSoortArray[i];

            const artikelSoortValue = currentArtikelSoort.value;
            const artikelSoortLabel = currentArtikelSoort.label;

            newArtikelSoortOption.value = artikelSoortValue; // De waarde van de optie
            newArtikelSoortOption.text = artikelSoortLabel; // De tekst die wordt weergegeven
            // Voeg de nieuwe optie toe aan het select element
            artikelSoortSelect.appendChild(newArtikelSoortOption);
        }

    } catch (error) {
        console.error('Error fetching artikelSoorten:', error);
        logToConsole('Probleem bij het ophalen van artikel soorten', 'log-error');
        throw error; // Herwerp de error voor behandeling op een hoger niveau
    }
}

async function updateMonteurs() {

    // get users from database
    const userArray = await fetchUsers();

    filteredArray = userArray.filter((user) =>
        user.teams.includes('6375722ebe6b78e21488b8ef')
    );

    // add monteurs to select field
    for (let i = 0; i < filteredArray.length; i++) {
        // Maak een nieuwe optie aan
        let newUserOption = document.createElement('option');

        currentUser = filteredArray[i];
        const userFullName = currentUser.full_name.sys_root;

        let title;

        // check if user has name configured and set title to email if not
        if (userFullName.length > 0) {
            title = userFullName;
        } else {
            title = currentUser.email[0];
        }

        newUserOption.value = JSON.stringify(currentUser); // De waarde van de optie (user object)
        newUserOption.text = title; // De tekst die wordt weergegeven
        // Voeg de nieuwe optie toe aan het select element
        userSelect.appendChild(newUserOption);
    }
}

async function fetchUsers() {

    const url = `https://app.smartsuite.com/api/v1/applications/members/records/list/`;

    try {
        const response = await proxyFetch(url, {
            method: 'POST',
            headers: {
                'Account-Id': accountId,
                Authorization: smartsuiteApiKey,
            },
        });

        const data = await response; // Parsen van de response als JSON

        return data.items;
    } catch (error) {
        console.error('Error fetching users:', error);
        logToConsole('Probleem bij het ophalen van de gebruikers', 'log-error');
        throw error; // Herwerp de error voor behandeling op een hoger niveau
    }
}

// Voegt alle voorraden aan de voorraad select element toe
async function addListsToVoorraadInput() {
    // Define voorraad select input
    const voorraadSelect = document.getElementById('voorraad_select');
    const voorraadLijstArray = await getVoorraden();

    for (let i = 0; i < voorraadLijstArray.length; i++) {
        // Maak een nieuwe optie aan
        let newVoorraadOption = document.createElement('option');
        newVoorraadOption.value = JSON.stringify(voorraadLijstArray[i]); // De waarde van de optie (voorraad object)

        newVoorraadOption.text = voorraadLijstArray[i].title; // De tekst die wordt weergegeven
        // Voeg de nieuwe optie toe aan het select element
        voorraadSelect.appendChild(newVoorraadOption);
    }

    logToConsole('Voorraadlijsten zijn bijgewerkt.', 'log-success');
}

// Verkrijg alle voorraden via api
async function getVoorraden() {
    const voorradenAppId = '650a2861377fce85c34dbead';
    const url = `https://app.smartsuite.com/api/v1/applications/${voorradenAppId}/records/list/`;

    try {
        const response = await proxyFetch(url, {
            method: 'POST',
            headers: {
                'Account-Id': accountId,
                'Authorization': smartsuiteApiKey,
            },
        });

        // Assuming response is already an object with the data you need
        const data = response;

        voorraadArray = data.items;

        return voorraadArray;

    } catch (error) {
        console.error('Error fetching voorraden:', error);
        logToConsole('Probleem bij het ophalen van de voorraden', 'log-error');
        throw error; // Rethrow the error for handling at a higher level
    }
}

// -------------------event listeners-----------------------

let barcodeDelayTimer;

// Voeg een event listener toe voor het 'input' event
barcodeInputElement.addEventListener('input', function (event) {
    clearTimeout(barcodeDelayTimer); // Reset de timer bij elke nieuwe input

    // Start een timer om de barcode als compleet te beschouwen na 500 milliseconden inactiviteit
    barcodeDelayTimer = setTimeout(function () {
        runBarCode(barcodeInputElement.value); // Roep de functie aan om de barcode te verwerken
    }, 500);
});

// Luister naar veranderingen aan het aantal input van de barcode scanner
barcodeAantalInput.addEventListener('change', function () {
    focusBarcodeInput();
});

// Luister naar veranderingen aan het voorraad opnemen / uitboeken switcher
toggleSwitch.addEventListener('change', function () {
    focusBarcodeInput();
});

// laat de pagina luisteren naar voorraad aanpassingen en wanneer waardekamer voorraad wordt geselecteerd is het 'eigenaar' select field geactiveerd
voorraadSelect.addEventListener('change', function () {

    selectedIndex = voorraadSelect.selectedIndex;
    currentVoorraad = JSON.parse(voorraadSelect.options[selectedIndex].value);

    logToConsole(`Voorraad geselecteerd: ${currentVoorraad.title}`, 'log-regular');

    // Controleren welke uitboekmethode de voorraad heeft en stel de variabele waarde hiervoor in
    if (currentVoorraad.sad8d17120 /*uitboekmethode*/ === '793b08e9-f7e9-44f2-8f00-2186c64295d2' /*op naam*/) {
        // Als het overeenkomt, weergeef het andere select element
        document.getElementById('eigenaar_select').style.display = 'block'; // show userSelect
    } else if (currentVoorraad.sad8d17120 /*uitboekmethode*/ === 'a8688371-2737-4a0f-8359-5fd6b788234c' /*op klus*/) {
        // Verberg het userSelect element als het niet overeenkomt
        document.getElementById('eigenaar_select').style.display = 'none'; // hide userSelect
    }
    focusBarcodeInput();
});

// luisten naar aanpassingen in het userSelect field en wijzig de currentuser variabele
userSelect.addEventListener('change', function () {

    selectedIndex = userSelect.selectedIndex;
    currentUser = JSON.parse(userSelect.options[selectedIndex].value);

    focusBarcodeInput();

});

unitToevoegenButton.addEventListener('click', function () {
    runLoadingScreen('Unit toevoegen aan database');
    // add filled unit to clickup list

    const eanCode = barcodeInputElement.value;
    const artikelName = newUnitTextInput.value;
    const artikelSoort = artikelSoortSelect.value;
    const artikelSoortIndex = artikelSoortSelect.selectedIndex;

    if (artikelName.length === 0) {
        runErrorMessage('Artikelnaam is niet ingevuld.');
        logToConsole('Artikelnaam is niet ingevuld', 'log-error');
    } else if (eanCode.length === 0) {
        runErrorMessage('Gescande code is niet ingevuld.');
        logToConsole('Gescande code is niet ingevuld', 'log-error');
    } else if (artikelSoortIndex === 0) {
        runErrorMessage('Artikelsoort is niet geselecteerd.');
        logToConsole('Artikelsoort is niet geselecteerd', 'log-error');
    } else {
        stopNewUnitScreen();
        addVoorraadArtikel(eanCode, artikelName, artikelSoort);
    }
    focusBarcodeInput();
});

closeButtonNewUnitScreen.addEventListener('click', function () {
    stopNewUnitScreen();
});

//----------------------some functions-------------------------

async function runBarCode(scannedCode) {

    logToConsole(`Barcode scanned: ${scannedCode}`, 'log-regular');

    runLoadingScreen('Controleren of unit bekend is...');

    if (checkEANValidity(scannedCode)) {
        // Krijg de index van het het voorraad select input veld
        const selectedVoorraadIndex = voorraadSelect.selectedIndex;
        const selectedUserIndex = userSelect.selectedIndex;
        logToConsole(`Controleren of unit bekend is...`, 'log-regular');

        let userCheckOk;
        if (currentVoorraad.sad8d17120 /*uitboekmethode*/ == '793b08e9-f7e9-44f2-8f00-2186c64295d2' /*op naam*/) {
            if (selectedUserIndex > 0) {
                userCheckOk = true;
            } else {
                userCheckOk = false
            }
        } else {
            userCheckOk = true;
        }

        if (selectedVoorraadIndex > 0 && userCheckOk == true) {
            currentVoorraadArtikel = await getVoorraadArtikel(scannedCode);

            if (currentVoorraadArtikel != null) {
                runLoadingScreen('Item wordt aan voorraad toegevoegd');
                addUnitToSelectedVoorraad(scannedCode, currentVoorraadArtikel, selectedVoorraadIndex);
            } else {
                stopLoadingScreen();
                runNewUnitScreen();
            }
        } else {
            stopLoadingScreen();
            barcodeInputElement.value = '';
            runErrorMessage('Geen voorraad / eigenaar geselecteerd');
            logToConsole('Geen voorraad / eigenaar geselecteerd', 'log-error');
        }

    } else {
        barcodeInputElement.value = '';
        runErrorMessage(`EAN code: <strong>${scannedCode}</strong> is ongeldig`);
    }
}

async function getVoorraadArtikel(scannedCode) {

    console.log('Artikel array: ', voorraadArtikelArray)

    for (let i = 0; i < voorraadArtikelArray.length; i++) {
        let EANCode = voorraadArtikelArray[i].s7f8cdc560;
        console.log('Current artikel EAN: ', EANCode);
        console.log('Scanned code: ', scannedCode);

        if (EANCode == scannedCode) {
            return voorraadArtikelArray[i];
        }
    }
    console.log(`no corresponding EAN codes in database`);
    logToConsole('Geen vergelijkbaar EAN nummer bekend in database', 'log-regular');
    return null;
}

async function addVoorraadArtikel(eanCode, artikelName, artikelSoort) {
    const url = `https://app.smartsuite.com/api/v1/applications/${artikelenAppId}/records/`;

    console.log(`${artikelName} met code '${eanCode}' wordt aan lijst toegevoegd`);
    logToConsole(`${artikelName} met code '${eanCode}' wordt aan lijst toegevoegd`, 'log-regular');

    try {
        const response = await proxyFetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Account-Id': accountId,
                'Authorization': smartsuiteApiKey
            },
            body: JSON.stringify({
                'title': artikelName,
                's7f8cdc560': eanCode,
                's0bd2eaa09': artikelSoort,
                's95756d359': true
            }),
        });

        if (response.id) {
            logToConsole(`Unit met id: ${response.id} toegevoegd aan lijst`, 'log-success');
            runSuccesMessage(`<strong>${artikelName}</strong> toegevoegd aan bekende units`);
            updateVoorraadArtikelen();
            updateArtikelSoortOpties();
            barcodeInputElement.value = '';
        } else {
            throw new Error('Response does not contain an ID.');
        }
    } catch (error) {
        console.error('Error:', response);
        logToConsole(`Kon ${artikelName} niet toevoegen aan bekende units`, 'log-error');
        runErrorMessage(`Kon <strong>${artikelName}</strong> niet toevoegen aan bekende units`);
    } finally {
        stopLoadingScreen();
        focusBarcodeInput();
    }
}

function addUnitToSelectedVoorraad(scannedCode, currentVoorraadArtikel, selectedIndex) {
    // Krijg de key / value pair van geselecteerde optie
    const selectedOption = voorraadSelect.options[selectedIndex];
    // Krijg de waarde van het geselecteerde item
    const selectedVoorraad = {
        name: selectedOption.text,
        value: selectedOption.value,
    };

    const aantal = barcodeAantalInput.value;

    logToConsole(`Unit is bekend: ${currentVoorraadArtikel.name}. Unit wordt toegevoegd aan ${currentVoorraad.title}...`, 'log-regular');

    const voorraadArtikelTitle = currentVoorraadArtikel.title;
    const voorraadArtikelId = currentVoorraadArtikel.id;

    let reqBody = {};

    if (currentVoorraad.sad8d17120 /*uitboekmethode*/ == '793b08e9-f7e9-44f2-8f00-2186c64295d2' /*op naam*/) {
        reqBody = {
            's7d333c5b8': [voorraadArtikelId],
            's8e6e6b6a7': [currentVoorraad.id],
            's2e33fcd11' /*item eigenaar*/: [currentUser.id]
        }
    } else if (currentVoorraad.sad8d17120 /*uitboekmethode*/ == 'a8688371-2737-4a0f-8359-5fd6b788234c' /*op klus*/) {
        reqBody = {
            's7d333c5b8': [voorraadArtikelId],
            's8e6e6b6a7': [currentVoorraad.id]
        }
    } else {
        throw new Error('Geen inboekmethode bekend');
    }

    // voeg item toe aan juiste clickup voorraad lijst

    const voorraadPartsAppId = '64fef647042fa5a6456691c3';
    const url = `https://app.smartsuite.com/api/v1/applications/${voorraadPartsAppId}/records/`;

    logToConsole(`item: ${voorraadArtikelTitle} - ${scannedCode} wordt aan voorraad lijst toegevoegd`, 'log-regular');


    proxyFetch(url, {
        method: 'POST',
        headers: {
            'Account-Id': accountId,
            'Authorization': smartsuiteApiKey,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(reqBody)
    })
        .then((response) => {
            return response; // Parsen van de response als JSON
        })
        .then((data) => {

            console.log('Successfully added voorraad item:', data);
            logToConsole(`${voorraadArtikelTitle} succesvol toegevoegd aan ${currentVoorraad.title}`, 'log-success');

            barcodeInputElement.value = '';
            stopLoadingScreen();
            // Clear barcode input field for new input
            barcodeInputElement.value = '';
            runSuccesMessage(
                `<strong>${voorraadArtikelTitle}</strong> succesvol toegevoegd aan ${selectedVoorraad.name}`
            );
            focusBarcodeInput();
        })
        .catch((error) => {
            console.error('Error adding voorraad item:', error);
            logToConsole(`Kon ${voorraadArtikelTitle} niet toevoegen aan ${currentVoorraad.title}`, 'log-error');
            barcodeInputElement.value = '';
            stopLoadingScreen();
            // Clear barcode input field for new input
            barcodeInputElement.value = '';
            runErrorMessage(
                `<strong>${voorraadArtikelTitle}</strong> kon niet worden toegevoegd aan ${selectedVoorraad.name}`
            );
            focusBarcodeInput();
        });
}

// Controleer EAN code op geldigheid
function checkEANValidity(code) {
    // Verwijder spaties en andere tekens die geen cijfers zijn
    code = code.replace(/\D/g, '');

    // Controleer of de code 8 of 13 cijfers heeft
    if (code.length !== 8 && code.length !== 13) {
        logToConsole('Ongeldige lengte: EAN-codes moeten 8 of 13 cijfers lang zijn.', 'log-error');
        return false;
    }

    if (code.length === 8) {
        // EAN-8 controlecijfer berekening
        let sum = 0;
        for (let i = 0; i < code.length - 1; i++) {
            let digit = parseInt(code[i]);
            sum += i % 2 === 0 ? digit * 3 : digit;
        }
        let checksum = (10 - (sum % 10)) % 10;

        // Controleer of het controlecijfer overeenkomt met het laatste cijfer in de code
        if (checksum !== parseInt(code[code.length - 1])) {
            logToConsole('Ongeldig controlecijfer voor EAN-8 code.', 'log-error');
            return false;
        }
    } else if (code.length === 13) {
        // EAN-13 controlecijfer berekening
        let sum = 0;
        for (let i = 0; i < code.length - 1; i++) {
            let digit = parseInt(code[i]);
            sum += i % 2 === 0 ? digit : digit * 3;
        }
        let checksum = (10 - (sum % 10)) % 10;

        // Controleer of het controlecijfer overeenkomt met het laatste cijfer in de code
        if (checksum !== parseInt(code[code.length - 1])) {
            logToConsole('Ongeldig controlecijfer voor EAN-13 code.', 'log-error');
            return false;
        }
    }

    logToConsole('EAN-code is gecontroleerd en is geldig', 'log-success');
    return true;
}

let timeoutId; // Variabele om het timeout ID bij te houden

function runNewUnitScreen() {
    logToConsole(`Unit is onbekend. Voeg hem eventueel toe aan bekende units.`, 'log-regular');
    newUnitScreen.style.display = 'flex';
}

function stopNewUnitScreen() {
    newUnitScreen.style.display = 'none';
    newUnitTextInput.value = '';
    barcodeInputElement.value = '';
}

function toggleContent() {
    const toggleSwitch = document.getElementById('toggleSwitch');
    const content = document.getElementById('toggle_text');

    if (toggleSwitch.checked) {
        content.innerHTML = 'Voorraad uitboeken';
        content.style.color = 'var(--bricks-color-fgyvlm)';
    } else {
        content.innerHTML = 'Voorraad inboeken';
        content.style.color = 'var(--bricks-color-coeckr)';
    }
}

function focusBarcodeInput() {
    barcodeInputElement.focus();
}

// Logging text in log parent box

function logToConsole(message, logType) {
    const logSection = document.getElementById('log-section');
    const logBox = document.createElement('div');
    logBox.classList.add('brxe-block', 'text-log-box', logType);

    const logTimestamp = document.createElement('div');
    logTimestamp.classList.add('brxe-text-basic', 'log-timestamp');
    const currentTime = new Date();
    logTimestamp.textContent = currentTime.toLocaleTimeString(); // Current timestamp (time only)

    const logMessage = document.createElement('div');
    logMessage.classList.add('brxe-text-basic');
    logMessage.textContent = message;

    logBox.appendChild(logTimestamp);
    logBox.appendChild(logMessage);
    // Insert the log box at the beginning of the log section
    logSection.insertBefore(logBox, logSection.firstChild);
}


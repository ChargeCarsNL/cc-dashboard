// --------------------------on page load-------------------------------
// Declare screens
let newUnitScreen = document.getElementById("new_unit_screen");
newUnitScreen.style.display = "none";

// Declare form fields
let newUnitTextInput = document.getElementById("new_unit_text_input");
let voorraadSelect = document.getElementById("voorraad_select");
let userSelect = document.getElementById("eigenaar_select");
let artikelSoortSelect = document.getElementById("unit_label_select");

// Haal het barcode input element op
let barcodeInputElement = document.getElementById("barcode_scanner_input");

// Declare buttons
let closeButtonNewUnitScreen = document.getElementById("close_button_new_unit_screen");
let unitToevoegenButton = document.getElementById("unit_toevoegen_button");
let aanVoorraadToevoegenButton = document.getElementById("aan_voorraad_toevoegen_button");

// Declare an empty array to store the unit class items
let voorraadArtikelArray = [];

// Declare variables
let currentVoorraad = {};
let currentUser = {};

window.addEventListener("load", function () {
    runLoadingScreen("Initialiseren...");
    console.log("Loading page...");

    // verstop eigenaar select veld
    userSelect.style.display = "none";

    updateVoorraadArtikelen();
    addListsToVoorraadInput();
    updateArtikelSoortOpties();
    updateMonteurs();
    focusBarcodeInput();
    stopLoadingScreen();
});

async function updateVoorraadArtikelen() {
    // Dit update de lijst met beschikbare voorraad items (voorraadArtikelArray)
    const artikelenAppId = "6500ca1af3bd5b04b06af801";
    const url = `https://app.smartsuite.com/api/v1/applications/${artikelenAppId}/records/list/`;

    try {
        const response = await proxyFetch(url, {
            method: "POST",
            headers: {
                "Account-Id": accountId,
                Authorization: smartsuiteApiKey,
                "Content-Type": "application/json", // Zet het juiste content-type voor JSON
            },
            body: JSON.stringify({
                filter: {
                    // filtert antwoorden op bepaalde voorwaarden
                    operator: "and",
                    fields: [
                        {
                            comparison: "is",
                            field: "s95756d359", // is voorraad artikel (boolean veld smartsuite)
                            value: true,
                        },
                    ],
                },
            }),
        });

        console.log("Artikelen response:", response); // Log de response

        const data = await response; // Parsen van de response als JSON

        voorraadArtikelArray = data.items;
    } catch (error) {
        console.error("Error fetching voorraadArtikelen:", error);
        throw error; // Herwerp de error voor behandeling op een hoger niveau
    }
}

async function updateArtikelSoortOpties() {
    const url = `https://app.smartsuite.com/api/v1/applications/6500ca1af3bd5b04b06af801/`;
    try {
        const response = await proxyFetch(url, {
            method: "GET",
            headers: {
                "Account-Id": accountId,
                'Authorization': smartsuiteApiKey,
            }
        });

        console.log("Artikel veld opsomming:", response); // Log de response

        const data = await response; // Parsen van de response als JSON

        voorraadSoortOptionsObject = data.structure.find(obj => obj.slug === 's0bd2eaa09' /*soortartikel*/ );
        voorraadArtikelArray = voorraadSoortOptionsObject.params.choices;

        // add artikelsoorten to select field
        for (let i = 0; i < voorraadArtikelArray.length; i++) {
            // Maak een nieuwe optie aan
            let newArtikelSoortOption = document.createElement("option");

            currentArtikelSoort = voorraadArtikelArray[i];
            
            const artikelSoortValue = currentArtikelSoort.value;
            const artikelSoortLabel = currentArtikelSoort.label;

            newArtikelSoortOption.value = artikelSoortValue; // De waarde van de optie
            newArtikelSoortOption.text = artikelSoortLabel; // De tekst die wordt weergegeven
            // Voeg de nieuwe optie toe aan het select element
            artikelSoortSelect.appendChild(newArtikelSoortOption);
        }

    } catch (error) {
        console.error("Error fetching artikelSoorten:", error);
        throw error; // Herwerp de error voor behandeling op een hoger niveau
    }
}

async function updateMonteurs() {

    // get users from database
    const userArray = await fetchUsers();

    filteredArray = userArray.filter((user) =>
        user.teams.includes("6375722ebe6b78e21488b8ef")
    );

    // add monteurs to select field
    for (let i = 0; i < filteredArray.length; i++) {
        // Maak een nieuwe optie aan
        let newUserOption = document.createElement("option");

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
            method: "POST",
            headers: {
                "Account-Id": accountId,
                Authorization: smartsuiteApiKey,
            },
        });

        console.log("Users response:", response); // Log de response

        const data = await response; // Parsen van de response als JSON

        return data.items;
    } catch (error) {
        console.error("Error fetching voorraadArtikelen:", error);
        throw error; // Herwerp de error voor behandeling op een hoger niveau
    }
}

// Voegt alle voorraden aan de voorraad select element toe
async function addListsToVoorraadInput() {
    // Define voorraad select input
    const voorraadSelect = document.getElementById("voorraad_select");
    const voorraadLijstArray = await getVoorraden();
    console.log("VoorraadlijstArray:");
    console.log(voorraadLijstArray);

    for (let i = 0; i < voorraadLijstArray.length; i++) {
        console.log('CurrentVoorraad: ', voorraadLijstArray[i]);
        // Maak een nieuwe optie aan
        let newVoorraadOption = document.createElement("option");
        console.log('voorraadlijstArray[i] = ', voorraadLijstArray[i]);
        newVoorraadOption.value = JSON.stringify(voorraadLijstArray[i]); // De waarde van de optie (voorraad object)

        console.log('newVoorraadOption.value = ', newVoorraadOption.value);
        newVoorraadOption.text = voorraadLijstArray[i].title; // De tekst die wordt weergegeven
        // Voeg de nieuwe optie toe aan het select element
        voorraadSelect.appendChild(newVoorraadOption);
    }
}

// Verkrijg alle voorraden via api
async function getVoorraden() {
    const voorradenAppId = "650a2861377fce85c34dbead";
    const url = `https://app.smartsuite.com/api/v1/applications/${voorradenAppId}/records/list/`;

    try {
        const response = await proxyFetch(url, {
            method: "POST",
            headers: {
                'Account-Id': accountId,
                'Authorization': smartsuiteApiKey,
            },
        });

        console.log("Response:", response); // Log the response

        // Assuming response is already an object with the data you need
        const data = response;

        voorraadArray = data.items;

        return voorraadArray;

    } catch (error) {
        console.error("Error fetching voorraden:", error);
        throw error; // Rethrow the error for handling at a higher level
    }
}

// -------------------event listeners-----------------------

let barcodeDelayTimer;

// Voeg een event listener toe voor het 'input' event
barcodeInputElement.addEventListener("input", function (event) {
    clearTimeout(barcodeDelayTimer); // Reset de timer bij elke nieuwe input

    // Start een timer om de barcode als compleet te beschouwen na 500 milliseconden inactiviteit
    barcodeDelayTimer = setTimeout(function () {
        runBarCode(barcodeInputElement.value); // Roep de functie aan om de barcode te verwerken
    }, 500);
});

// laat de pagina luisteren naar voorraad aanpassingen en wanneer waardekamer voorraad wordt geselecteerd is het "eigenaar" select field geactiveerd
voorraadSelect.addEventListener("change", function () {

    selectedIndex = voorraadSelect.selectedIndex;
    currentVoorraad = JSON.parse(voorraadSelect.options[selectedIndex].value);

    console.log('currentVoorraad: ', currentVoorraad);

    console.log(`Voorraad uitboekmethode is: ${currentVoorraad.sad8d17120}`);

    // Controleren welke uitboekmethode de voorraad heeft en stel de variabele waarde hiervoor in
    if (currentVoorraad.sad8d17120 /*uitboekmethode*/ === "793b08e9-f7e9-44f2-8f00-2186c64295d2" /*op naam*/) {
        // Als het overeenkomt, weergeef het andere select element
        document.getElementById("eigenaar_select").style.display = "block"; // show userSelect
    } else if (currentVoorraad.sad8d17120 /*uitboekmethode*/ === "a8688371-2737-4a0f-8359-5fd6b788234c" /*op klus*/) {
        // Verberg het userSelect element als het niet overeenkomt
        document.getElementById("eigenaar_select").style.display = "none"; // hide userSelect
    }
});

// luisten naar aanpassingen in het userSelect field en wijzig de currentuser variabele
userSelect.addEventListener('change', function () {

    selectedIndex = userSelect.selectedIndex;
    currentUser = JSON.parse(userSelect.options[selectedIndex].value);

});

unitToevoegenButton.addEventListener("click", function () {
    runLoadingScreen("Unit toevoegen aan database");
    // add filled unit to clickup list

    const eanCode = barcodeInputElement.value;
    const artikelName = newUnitTextInput.value;
    const artikelSoort = artikelSoortSelect.value;

    if (artikelName.length === 0) {
        runErrorMessage('Artikelnaam is niet ingevuld.');
        console.error('Error:', 'Artikelnaam is niet ingevuld.');
    } else if (eanCode.length === 0) {
        runErrorMessage('Gescande code is niet ingevuld.');
        console.error('Error:', 'Gescande code is niet ingevuld.');
    } else if (artikelSoort === 0) {
        runErrorMessage('Artikelsoort is niet geselecteerd.');
        console.error('Error:', 'Artikelsoort is niet geselecteerd.');
    } else {
        stopNewUnitScreen();
        addVoorraadArtikel(eanCode, artikelName, artikelSoort);
    }
});

closeButtonNewUnitScreen.addEventListener("click", function () {
    stopNewUnitScreen();
    console.log("closed");
});

//----------------------some functions-------------------------

async function runBarCode(scannedCode) {

    console.log(`Barcode scanned: ${scannedCode}`);

    runLoadingScreen("Controleren of unit bekend is...");

    if (checkEANValidity(scannedCode)) {
        // Krijg de index van het het voorraad select input veld
        const selectedIndex = voorraadSelect.selectedIndex;
        console.log(`Controleren of unit bekend is...`);

        if (selectedIndex > 0) {
            currentVoorraadArtikel = await getVoorraadArtikel(scannedCode);

            if (currentVoorraadArtikel != null) {
                runLoadingScreen("Item wordt aan voorraad toegevoegd");
                addUnitToSelectedVoorraad(scannedCode, currentVoorraadArtikel, selectedIndex);
            } else {
                stopLoadingScreen();
                runNewUnitScreen();
            }
        } else {
            stopLoadingScreen();
            console.log("Geannulleerd. Geen voorraad geselecteerd");
            barcodeInputElement.value = "";
            runErrorMessage("Geen voorraad geselecteerd");
        }

    } else {
        barcodeInputElement.value = "";
        runErrorMessage(`EAN code: <strong>${scannedCode}</strong> is ongeldig`);
    }
}

async function getVoorraadArtikel(scannedCode) {
    console.log(`Current scannedCode: ${scannedCode}`);

    for (let i = 0; i < voorraadArtikelArray.length; i++) {
        let EANCode = voorraadArtikelArray[i].s7f8cdc560;
        console.log(`current evaluated code: ${EANCode}`);

        if (EANCode == scannedCode) {
            return voorraadArtikelArray[i];
        }
    }
    console.log(`no corresponding EAN codes in database`);
    return null;
}

function addVoorraadArtikel(eanCode, artikelName, artikelSoort) {
    const url = `https://app.smartsuite.com/api/v1/applications/${artikelenAppId}/records/`;
    
    console.log(`item met code: ${unitCode} wordt aan lijst toegevoegd`);

    fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            "title": artikelName,
            "s7f8cdc560": eanCode,
            "s0bd2eaa09": artikelSoort,
            "s95756d359": true
        }),
    })
        .then((response) => response.json())
        .then((data) => {

            updateVoorraadArtikelen();
            updateArtikelSoortOpties();
            barcodeInputElement.value = "";
            stopLoadingScreen();
            runSuccesMessage(`<strong>${unitName}</strong> toegevoegd aan bekende units`);
            console.log(`Unit met id:${data.created_item_id} toegevoegd aan lijst`);
            focusBarcodeInput();
        })
        .catch((error) => {
            barcodeInputElement.value = "";
            stopLoadingScreen();
            runErrorMessage(
                `Kon <strong>${unitName}</strong> niet toevoegen aan bekende units`
            );
            console.error("Error:", error);
            focusBarcodeInput();
        });
}

function addUnitToSelectedVoorraad(scannedCode, currentVoorraadArtikel, selectedIndex) {
    // Krijg de key / value pair van geselecteerde optie
    const selectedOption = voorraadSelect.options[selectedIndex];
    // Krijg de waarde van het geselecteerde item
    const selectedVoorraad = {
        name: selectedOption.text,
        value: selectedOption.value,
    };

    console.log(
        `Unit is bekend: ${currentVoorraadArtikel.name}. Unit wordt toegevoegd aan ${currentVoorraad.title}...`
    );

    const voorraadArtikelTitle = currentVoorraadArtikel.title;
    const voorraadArtikelId = currentVoorraadArtikel.id;

    let reqBody = {};

    console.log('currentUser.id ', currentUser.id);

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

    const voorraadPartsAppId = "64fef647042fa5a6456691c3";
    const url = `https://app.smartsuite.com/api/v1/applications/${voorraadPartsAppId}/records/`;
    console.log(
        `item: ${voorraadArtikelTitle} - ${scannedCode} wordt aan voorraad lijst toegevoegd`
    );

    proxyFetch(url, {
        method: "POST",
        headers: {
            "Account-Id": accountId,
            'Authorization': smartsuiteApiKey,
            "Content-Type": 'application/json',
        },
        body: JSON.stringify(reqBody)
    })
        .then((response) => {
            return response; // Parsen van de response als JSON
        })
        .then((data) => {

            console.log("Successfully added voorraad item:", data);

            barcodeInputElement.value = "";
            stopLoadingScreen();
            // Clear barcode input field for new input
            barcodeInputElement.value = "";
            runSuccesMessage(
                `<strong>${voorraadArtikelTitle}</strong> succesvol toegevoegd aan ${selectedVoorraad.name}`
            );
            focusBarcodeInput();
        })
        .catch((error) => {
            console.error("Error adding voorraad item:", error);
            barcodeInputElement.value = "";
            stopLoadingScreen();
            // Clear barcode input field for new input
            barcodeInputElement.value = "";
            runErrorMessage(
                `<strong>${voorraadArtikelTitle}</strong> kon niet worden toegevoegd aan ${selectedVoorraad.name}`
            );
            focusBarcodeInput();
        });
}

// Controleer EAN code op geldigheid
function checkEANValidity(code) {
    // Verwijder spaties en andere tekens die geen cijfers zijn
    code = code.replace(/\D/g, "");

    // Controleer of de code 8 of 13 cijfers heeft
    if (code.length !== 8 && code.length !== 13) {
        console.log(
            "Ongeldige lengte: EAN-codes moeten 8 of 13 cijfers lang zijn."
        );
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
            console.log("Ongeldig controlecijfer voor EAN-8 code.");
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
            console.log("Ongeldig controlecijfer voor EAN-13 code.");
            return false;
        }
    }

    console.log("EAN-code is gecontroleerd en is geldig");
    return true;
}

let timeoutId; // Variabele om het timeout ID bij te houden

function runNewUnitScreen() {
    console.log(`Unit is onbekend. Voeg hem eventueel toe aan bekende units.`);
    newUnitScreen.style.display = "flex";
}

function stopNewUnitScreen() {
    newUnitScreen.style.display = "none";
    newUnitTextInput.value = "";
    barcodeInputElement.value = "";
}

function toggleContent() {
    const toggleSwitch = document.getElementById("toggleSwitch");
    const content = document.getElementById("toggle_text");

    if (toggleSwitch.checked) {
        content.innerHTML = "Voorraad uitboeken";
        content.style.color = "var(--bricks-color-fgyvlm)";
    } else {
        content.innerHTML = "Voorraad inboeken";
        content.style.color = "var(--bricks-color-coeckr)";
    }
}

function focusBarcodeInput() {
    barcodeInputElement.focus();
}

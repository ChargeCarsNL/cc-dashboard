// --------------------------on page load-------------------------------
// Declare screens
let newUnitScreen = document.getElementById('new_unit_screen');
newUnitScreen.style.display = 'none';


let errorMessageScreen = document.getElementById('error_message_screen');
let errorMessageText = document.getElementById('error_message_text');
let succesMessageScreen = document.getElementById('succes_message_screen');
let succesMessageText = document.getElementById('succes_message_text');

// Declare form fields
let newUnitTextInput = document.getElementById('new_unit_text_input');
let voorraadSelect = document.getElementById('voorraad_select');
let unitLabelSelect = document.getElementById('unit_label_select');

// Haal het barcode input element op
let barcodeInputElement = document.getElementById('barcode_scanner_input');

// Declare buttons
let closeButtonNewUnitScreen = document.getElementById('close_button_new_unit_screen');
let unitToevoegenButton = document.getElementById('unit_toevoegen_button');
let aanVoorraadToevoegenButton = document.getElementById('aan_voorraad_toevoegen_button');

// Declare an empty array to store the unit class items
let unitClassItemsArray = [];

// Declare an empty array to store the unit class labels
let unitClassLabelsArray = [];

window.addEventListener('load', function () {

    runLoadingScreen('Initialiseren...');
    console.log('Loading page...');
    focusBarcodeInput();

    const url = 'https://prod-188.westeurope.logic.azure.com:443/workflows/c692d1e2c0494c1fad8e6eb43777380f/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=GLLeWlwV-sS7pgnipNEhZyJOEkodz534uhuDmzkbXfY';

    fetch(url, {
        method: 'GET'
    })
        .then(response => response.json())
        .then(data => {
            addListsToSelectInput(data);

            // Fetch the unit class items
            fetchUnitClassItems()
                .then(() => {
                    // Fetch the unit class labels
                    fetchUnitSoortLabels()
                        .then(() => {
                            // Both fetch operations are complete, stop the loading screen
                            stopLoadingScreen();
                        })
                        .catch(error => {
                            console.error('Error fetching unit class labels:', error);
                            stopLoadingScreen();
                        });
                })
                .catch(error => {
                    console.error('Error fetching unit class items:', error);
                    stopLoadingScreen();
                });
        })
        .catch(error => {
            console.error('Error:', error);
            stopLoadingScreen();
        });
});

// Voegt alle voorraden aan de voorraad select element toe
function addListsToSelectInput(data) {
    // Define voorraad select input
    const voorraadSelect = document.getElementById('voorraad_select');
    const voorraadLijstArray = data.lists;
    console.log(`Voorraadlijst array: ${voorraadLijstArray}`);

    for (let i = 0; i < voorraadLijstArray.length; i++) {
        // Maak een nieuwe optie aan
        let newVoorraadOption = document.createElement('option');
        newVoorraadOption.value = voorraadLijstArray[i].id; // De waarde van de optie
        newVoorraadOption.text = voorraadLijstArray[i].name; // De tekst die wordt weergegeven
        // Voeg de nieuwe optie toe aan het select element
        voorraadSelect.appendChild(newVoorraadOption);
    }
}

// -------------------event listeners-----------------------

// Voeg een event listener toe voor het 'input' event
barcodeInputElement.addEventListener('input', async function () {

    const scannedCode = barcodeInputElement.value;
    console.log(`Barcode scanned: ${scannedCode}`);

    runLoadingScreen('Controleren of unit bekend is...');

    if (checkEANValidity(scannedCode)) {
        // Krijg de index van het het voorraad select input veld
        const selectedIndex = voorraadSelect.selectedIndex;
        console.log(`Controleren of unit bekend is...`);
        if (scannedCode.length > 0) {
            if (selectedIndex > 0) {

                currentUnitClassItem = await getUnitClass(scannedCode);

                if (currentUnitClassItem != null) {
                    runLoadingScreen('Item wordt aan voorraad toegevoegd');
                    addUnitToSelectedVoorraad(scannedCode, currentUnitClassItem, selectedIndex);
                } else {
                    stopLoadingScreen();
                    runNewUnitScreen();
                }
            } else {
                stopLoadingScreen();
                console.log('Geannulleerd. Geen voorraad geselecteerd');
                barcodeInputElement.value = '';
                runErrorMessage('Geen voorraad geselecteerd');
            }
        }
    } else {
        barcodeInputElement.value = '';
        runErrorMessage(`EAN code: <strong>${scannedCode}</strong> is ongeldig`);
    }
});

unitToevoegenButton.addEventListener('click', function () {
    runLoadingScreen('Unit toevoegen aan database');
    // add filled unit to clickup list

    const scannedCode = barcodeInputElement.value;
    const filledValue = newUnitTextInput.value;
    const selectedLabel = unitLabelSelect.value;

    if (filledValue.length > 0) {
        stopNewUnitScreen();
        addItemToUnitClassList(scannedCode, filledValue, selectedLabel)
    } else {
        barcodeInputElement.value = '';
        stopLoadingScreen();
        runErrorMessage(`Geen waarde opgegeven`);
        console.error('Error:', 'Geen waarde opgegeven');
    }
});

closeButtonNewUnitScreen.addEventListener('click', function () {
    stopNewUnitScreen();
    console.log('closed');
});

//----------------------some functions-------------------------

async function getUnitClass(scannedCode) {
    const EANCodeCustomFieldId = '7bb86afc-301a-48ec-b618-a71b2afb6ebd';
    console.log(`Current scannedCode: ${scannedCode}`);

    for (let i = 0; i < unitClassItemsArray.length; i++) {
        let customFieldsArray = unitClassItemsArray[i].custom_fields;
        let EANCode = getCustomFieldValueById(customFieldsArray, EANCodeCustomFieldId);
        console.log(`current code: ${EANCode}`);

        if (EANCode == scannedCode) {
            return unitClassItemsArray[i];
        }
    }
    console.log(`returned null`);
    return null;
}

function getCustomFieldValueById(customFieldArray, customFieldId) {

    for (const currentField of customFieldArray) {
        if (currentField.id === customFieldId) {
            return currentField.value;
        }
    }
    return null; /*Return null if fieldId is not found*/
}

function addItemToUnitClassList(unitCode, unitName, unitLabel) {
    const url = 'https://prod-209.westeurope.logic.azure.com:443/workflows/3c068e70e83c486da13e0e35c501cb62/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=NgV77-5FgzXRKI9SdLDAC_-F0XQEvCtiCx1tOLqCYjY';
    console.log(`item met code: ${unitCode} wordt aan lijst toegevoegd`);

    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            'unitcode': unitCode,
            'unitname': unitName
        }),
    })
        .then(response => response.json())
        .then(data => {
            // Call fetchUnitClassItems to update the unit class items array
            fetchUnitClassItems();

            // Call fetchUnitSoortLabels to update the unit class labels array
            fetchUnitSoortLabels();

            barcodeInputElement.value = '';
            stopLoadingScreen();
            runSuccesMessage(`<strong>${unitName}</strong> toegevoegd aan bekende units`);
            console.log(`Unit met id:${data.created_item_id} toegevoegd aan lijst`);
            focusBarcodeInput();
        })
        .catch(error => {
            barcodeInputElement.value = '';
            stopLoadingScreen();
            runErrorMessage(`Kon <strong>${unitName}</strong> niet toevoegen aan bekende units`);
            console.error('Error:', error);
            focusBarcodeInput();
        });
}

function addUnitToSelectedVoorraad(scannedCode, currentUnitClassItem, selectedIndex) {
    // Krijg de key / value pair van geselecteerde optie
    const selectedOption = voorraadSelect.options[selectedIndex];
    // Krijg de waarde van het geselecteerde item
    const selectedVoorraad = {
        'name': selectedOption.text,
        'value': selectedOption.value
    }

    console.log(`Unit is bekend: ${currentUnitClassItem.name}. Unit wordt toegevoegd aan ${selectedVoorraad.name}...`);

    const unitClassName = currentUnitClassItem.name;
    const unitClassId = currentUnitClassItem.id;

    // voeg item toe aan juiste clickup voorraad lijst
    const url = 'https://prod-189.westeurope.logic.azure.com:443/workflows/db5e25179b4b4ac8bb43551fb17388ba/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=e68NLwrVMujBi3KiJ7SvEkGUMWDAL8Vukh8Qx88QD38';
    console.log(`item: ${unitClassName} - ${scannedCode} wordt aan voorraad lijst toegevoegd`)
    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            'selectedvoorraad': selectedVoorraad.value,
            'scannedcode': scannedCode,
            'unitclassname': unitClassName,
            'unitclassid': unitClassId
        }),
    })
        .then(response => response.json())
        .then(data => {
            console.log(`Unit met id:${data.created_item_id} succesvol toegevoegd aan voorraad`);
            barcodeInputElement.value = '';
            stopLoadingScreen();
            // Clear barcode input field for new input
            barcodeInputElement.value = '';
            runSuccesMessage(`<strong>${unitClassName}</strong> succesvol toegevoegd aan ${selectedVoorraad.name}`);
            focusBarcodeInput();
        })
        .catch(error => {
            console.error('Error:', error);
            barcodeInputElement.value = '';
            stopLoadingScreen();
            // Clear barcode input field for new input
            barcodeInputElement.value = '';
            runErrorMessage(`<strong>${unitClassName}</strong> kon niet worden toegevoegd aan ${selectedVoorraad.name}`);
            focusBarcodeInput();
        });
}

// Controleer EAN code op geldigheid
function checkEANValidity(code) {
    // Verwijder spaties en andere tekens die geen cijfers zijn
    code = code.replace(/\D/g, '');

    // Controleer of de code 8 of 13 cijfers heeft
    if (code.length !== 8 && code.length !== 13) {
        console.log('Ongeldige lengte: EAN-codes moeten 8 of 13 cijfers lang zijn.');
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
            console.log('Ongeldig controlecijfer voor EAN-8 code.');
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
            console.log('Ongeldig controlecijfer voor EAN-13 code.');
            return false;
        }
    }

    console.log('EAN-code is gecontroleerd en is geldig');
    return true;
}

let timeoutId; // Variabele om het timeout ID bij te houden

function runNewUnitScreen() {
    console.log(`Unit is onbekend. Voeg hem eventueel toe aan bekende units.`);
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

// Fetch unit class items
async function fetchUnitClassItems() {

    runLoadingScreen();

    const url = 'https://prod-22.westeurope.logic.azure.com:443/workflows/d875fde6360c45718337d4c7778500eb/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=_b2nff58zZzzOWefFZSQR1J-ARN7j6IgekgdqCBf1Ek';

    try {
        const response = await fetch(url);
        const data = await response.json();
        unitClassItemsArray = data.tasks; // Update the unit class items array
        console.log('Unit class items fetched:', unitClassItemsArray);
        stopLoadingScreen();
    } catch (error) {
        console.error('Error fetching unit class items:', error);
        stopLoadingScreen();
    }
}

async function fetchUnitSoortLabels() {

    runLoadingScreen();

    const unitClassItemsList = '900401619864';
    const url = `https://api.clickup.com/api/v2/list/${unitClassItemsList}/field`;

    return proxyFetch(url, {
        method: 'GET',
        headers: {
            'Authorization': 'pk_38199608_RWBKIFPYH9LSP1DAR6ZLNJD2ZQP5IY4T',
            'Content-Type': 'application/json'
        }
    })
        .then(responseData => {
            console.log('Response data:', responseData);

            const customFieldId = "da66ae38-b086-437d-bba2-92cb9619c07c";
            const customField = responseData.fields.find(field => field.id === customFieldId);

            if (customField && customField.type === "drop_down") {
                unitLabelSelect.innerHTML = '';

                const options = customField.type_config.options;
                for (const option of options) {
                    let newLabelOption = document.createElement('option');
                    newLabelOption.value = option.id;
                    newLabelOption.text = option.name;
                    unitLabelSelect.appendChild(newLabelOption);
                }
            }

            stopLoadingScreen();
        })
        .catch(error => {
            console.error('Error fetching unit class labels:', error);
            stopLoadingScreen();
        });

}


function focusBarcodeInput() {
    barcodeInputElement.focus();
}
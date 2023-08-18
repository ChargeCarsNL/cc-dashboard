// --------------------------on page load-------------------------------
// Declare screens
var knownUnitScreen = document.getElementById('known_unit_screen');
var newUnitScreen = document.getElementById('new_unit_screen');
knownUnitScreen.style.display = 'none';
newUnitScreen.style.display = 'none';

// Declare form fields
var newUnitTextInput = document.getElementById('new_unit_text_input');
var voorraadSelect = document.getElementById('voorraad_select');

// Haal het barcode input element op
var barcodeInputElement = document.getElementById('barcode_scanner_input');

// Declare buttons
var closeButtonKnownUnitScreen = document.getElementById('close_button_known_unit_screen');
var closeButtonNewUnitScreen = document.getElementById('close_button_new_unit_screen');
var unitToevoegenButton = document.getElementById('unit_toevoegen_button');
var aanVoorraadToevoegenButton = document.getElementById('aan_voorraad_toevoegen_button');

window.addEventListener('load', function () {

    const url = 'https://prod-188.westeurope.logic.azure.com:443/workflows/c692d1e2c0494c1fad8e6eb43777380f/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=GLLeWlwV-sS7pgnipNEhZyJOEkodz534uhuDmzkbXfY';
    // Verkrijg alle voorraad lijsten
    fetch(url, {
        method: 'GET'
    })
        .then(response => response.json())
        .then(data => addListsToSelectInput(data))
        .catch(error => console.error('Error:', error));

    function addListsToSelectInput(data) {
        // Define voorraad select input
        const voorraadSelect = document.getElementById('voorraad_select');
        const voorraadLijstArray = data.lists;
        console.log(voorraadLijstArray);

        for (let i = 0; i < voorraadLijstArray.length; i++) {
            // Maak een nieuwe optie aan
            let newVoorraadOption = document.createElement('option');
            newVoorraadOption.value = voorraadLijstArray[i].id; // De waarde van de optie
            newVoorraadOption.text = voorraadLijstArray[i].name; // De tekst die wordt weergegeven
            // Voeg de nieuwe optie toe aan het select element
            voorraadSelect.appendChild(newVoorraadOption);
        }

    }
});

// -------------------On barcode change-----------------------

// Voeg een event listener toe voor het 'input' event
barcodeInputElement.addEventListener('input', async function () {
    const scannedCode = barcodeInputElement.value;

    if (scannedCode.length > 0) {
        currentUnitClassItem = await getUnitClass(scannedCode);

        if (currentUnitClassItem != null) {
            const currentUnitName = currentUnitClassItem.name;
            runKnownUnitScreen(currentUnitName);
          } else {
            runNewUnitScreen();
          }
    }
});

function runKnownUnitScreen(currentUnitName) {
    knownUnitScreen.style.display = 'flex';
    newUnitScreen.style.display = 'none';
    const unitNameDisplayelement = document.getElementById('unit_name_display');
    unitNameDisplayelement.textContent = currentUnitName;
}

function runNewUnitScreen() {
    newUnitScreen.style.display = 'flex';
    knownUnitScreen.style.display = 'none';
}

unitToevoegenButton.addEventListener("click", function () {
    // add filled unit to clickup list

    const scannedCode = barcodeInputElement.value;
    const filledValue = newUnitTextInput.value;
    if (filledValue.length > 0) {
        addItemToUnitClassList(scannedCode, filledValue)
    } else {
        console.error('Error:', 'Geen waarde opgegeven');
    }
});

aanVoorraadToevoegenButton.addEventListener("click", function () {
    // add new voorraad item connected to unit item

    // Krijg de index van het geselecteerde item
    const selectedIndex = voorraadSelect.selectedIndex;

    if (selectedIndex != 0) {
        const scannedCode = barcodeInputElement.value;
        // Krijg het geselecteerde optie-element
        const selectedOption = voorraadSelect.options[selectedIndex];
        // Krijg de waarde van het geselecteerde item
        const selectedVoorraad = selectedOption.value;
        addUnitToSelectedVoorraad(scannedCode, selectedVoorraad);
    }
});

closeButtonKnownUnitScreen.addEventListener("click", function () {
    knownUnitScreen.style.display = "none";
    newUnitScreen.style.display = "none";
    console.log('closed');
});

closeButtonNewUnitScreen.addEventListener("click", function () {
    knownUnitScreen.style.display = "none";
    newUnitScreen.style.display = "none";
    console.log('closed');
});

//----------------------some functions-------------------------

async function getUnitClass(scannedCode) {
    const url = 'https://prod-22.westeurope.logic.azure.com:443/workflows/d875fde6360c45718337d4c7778500eb/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=_b2nff58zZzzOWefFZSQR1J-ARN7j6IgekgdqCBf1Ek';

    try {
        const response = await fetch(url);
        const data = await response.json();
        const unitClassItemsArray = data.tasks;
        const EANCodeCustomFieldId = '7bb86afc-301a-48ec-b618-a71b2afb6ebd';

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
    } catch (error) {
        console.error('Error:', error);
        return null;
    }
}

function getCustomFieldValueById(customFieldArray, customFieldId) {

    for (const currentField of customFieldArray) {
        if (currentField.id === customFieldId) {
            return currentField.value;
        }
    }
    return null; /*Return null if fieldId is not found*/
}

function addItemToUnitClassList(unitCode, unitName) {
    const url = 'https://prod-209.westeurope.logic.azure.com:443/workflows/3c068e70e83c486da13e0e35c501cb62/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=NgV77-5FgzXRKI9SdLDAC_-F0XQEvCtiCx1tOLqCYjY';
    console.log(`item met code: ${unitCode} wordt aan lijst toegevoegd`)
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
            console.log(`Unit met id:${data.created_item_id} toegevoegd aan lijst`);
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

function addUnitToSelectedVoorraad(scannedCode, selectedVoorraad) {
    
}
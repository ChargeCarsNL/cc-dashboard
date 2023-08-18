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

// Haal het barcode input element op
let barcodeInputElement = document.getElementById('barcode_scanner_input');

// Declare buttons
let closeButtonNewUnitScreen = document.getElementById('close_button_new_unit_screen');
let unitToevoegenButton = document.getElementById('unit_toevoegen_button');
let aanVoorraadToevoegenButton = document.getElementById('aan_voorraad_toevoegen_button');

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
});

// -------------------On barcode change-----------------------

// Voeg een event listener toe voor het 'input' event
barcodeInputElement.addEventListener('input', async function () {
    const scannedCode = barcodeInputElement.value;
    barcodeInputElement.value = null;

    // Krijg de index van het het voorraad select input veld
    const selectedIndex = voorraadSelect.selectedIndex;
    console.log(`Selected index: ${selectedIndex}`);

    if (scannedCode.length > 0) {
        if (selectedIndex > 0) {
            currentUnitClassItem = await getUnitClass(scannedCode);

            if (currentUnitClassItem != null) {
                addUnitToSelectedVoorraad(scannedCode, currentUnitClassItem, selectedIndex);
            } else {
                runNewUnitScreen();
            }
        } else {
            console.log("ran error screen");
            runErrorMessage('Geen voorraad geselecteerd');
        }
    }
});

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

closeButtonNewUnitScreen.addEventListener("click", function () {
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

function addUnitToSelectedVoorraad(scannedCode, currentUnitClassItem, selectedIndex) {
    // Krijg de key / value pair van geselecteerde optie
    const selectedOption = voorraadSelect.options[selectedIndex];
    // Krijg de waarde van het geselecteerde item
    const selectedVoorraad = {
        "name": selectedOption.text,
        "value": selectedOption.value
    }

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
            console.log(`Unit met id:${data.created_item_id} toegevoegd aan voorraad`);
            runSuccesMessage(`${unitClassName} succesvol toegevoegd aan ${selectedVoorraad.name}`);
        })
        .catch(error => {
            console.error('Error:', error);
            runErrorMessage(`${unitClassName} kon niet worden toegevoegd aan ${selectedVoorraad.name}`);
        });
}

function runNewUnitScreen() {
    newUnitScreen.style.display = 'flex';
}

function runErrorMessage(message) {
    errorMessageText.textContent = message;
    errorMessageScreen.style.display = 'flex'; // Display the element

    // After the specified duration, hide the element
    setTimeout(function () {
        errorMessageScreen.style.display = 'none'; // Hide the element
    }, 3000);
}

function runSuccesMessage(message) {
    succesMessageText.textContent = message;
    succesMessageScreen.style.display = 'flex'; // Display the element

    // After the specified duration, hide the element
    setTimeout(function () {
        succesMessageScreen.style.display = 'none'; // Hide the element
    }, 3000);
}
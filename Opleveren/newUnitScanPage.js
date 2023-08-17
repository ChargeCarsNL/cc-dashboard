// --------------------------on page load-------------------------------
// Declare screens
var knownUnitScreen = document.getElementById('known_unit_screen');
var newUnitScreen = document.getElementById('new_unit_screen');
knownUnitScreen.style.display = 'none';
newUnitScreen.style.display = 'none';

// Declare form fields
var newUnitTextInput = document.getElementById('new_unit_text_input');
var voorraadSelect = document.getElementById('voorraad_select'); 

// Declare buttons
var closeButton = document.getElementById('close_button'); 
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

// Haal het input element op
var inputElement = document.getElementById('barcode_scanner_input');

// Voeg een event listener toe voor het 'input' event
inputElement.addEventListener('input', function () {
    // Deze code wordt uitgevoerd wanneer de waarde van het input element verandert
    var scannedCode = inputElement.value;

    currentUnitClassItem = getUnitClass(scannedCode);

    if (currentUnitClassItem != null) {
        runKnownUnitScreen();
    } else {
        runNewUnitScreen();
    }
});

function runKnownUnitScreen() {
    knownUnitScreen.style.display = 'flex';
    newUnitScreen.style.display = 'none';
}

function runNewUnitScreen() {
    newUnitScreen.style.display = 'flex';
    knownUnitScreen.style.display = 'none';
}

unitToevoegenButton.addEventListener("click", function() {
    // add filled unit to clickup list
    if ()
});

aanVoorraadToevoegenButton.addEventListener("click", function() {
    // add new voorraad item connected to unit item
});

closeButton.addEventListener("click", function() {
    // Pas de stijl van het te verbergen element aan om het onzichtbaar te maken
    knownUnitScreen.style.display = "none";
    newUnitScreen.style.display = "none";
});

function getUnitClass(scannedCode) {
    const url = 'https://prod-22.westeurope.logic.azure.com:443/workflows/d875fde6360c45718337d4c7778500eb/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=_b2nff58zZzzOWefFZSQR1J-ARN7j6IgekgdqCBf1Ek';

    return fetch(url, {
        method: 'GET'
    })
        .then(response => response.json())
        .then(data => {
            const unitClassItemsArray = data.tasks;
            const EANCodeCustomFieldId = '7bb86afc-301a-48ec-b618-a71b2afb6ebd';

            for (let i = 0; i < unitClassItemsArray.length; i++) {
                let customFieldsArray = unitClassItemsArray[i].custom_fields;
                let EANCode = getCustomFieldValueById(customFieldsArray, EANCodeCustomFieldId);

                if (EANCode == scannedCode) {
                    return unitClassItemsArray[i];
                }
            }
            return null;
        })
        .catch(error => {
            console.error('Error:', error);
            return null;
        });
}

//----------------------some functions-------------------------

function getCustomFieldValueById(customFieldArray, customFieldId) {

    for (const currentField of customFieldArray) {
        if (currentField.id === customFieldId) {
            return currentField.value;
        }
    }
    return null; /*Return null if fieldId is not found*/
}


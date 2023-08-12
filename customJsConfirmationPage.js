// Huidige URL ophalen
const url = window.location.href;

// Array met vereiste parameters
const requiredParameters = ["taskid", "formid", "opdref", "opdrachtgever", "opdrachtgeverid", "naamklant", "adres", "soortklus", "formname", "dlform", "dlsign"];

// Functie om te controleren of een parameter bestaat in de URL
function controleerParameter(parameterNaam) {
    const urlParameters = new URLSearchParams(url);
    return urlParameters.has(parameterNaam);
}

// Functie om een URL-parameter te extraheren
function extractUrlParameter(key) {
    const urlObj = new URL(url);
    const params = new URLSearchParams(urlObj.search);
    return params.get(key);
}

// Start codeverwerking functie
function runMainJs() {

    // Declare url
    const url = window.location.href;

    // Extract parameters using the extractUrlParameter function
    const taskid = extractUrlParameter("taskid");
    const formid = extractUrlParameter("formid");
    const opdref = extractUrlParameter("opdref");
    const opdrachtgever = extractUrlParameter("opdrachtgever");
    const opdrachtgeverid = extractUrlParameter("opdrachtgeverid");
    const naamklant = extractUrlParameter("naamklant");
    const adres = extractUrlParameter("adres");
    const soortklus = extractUrlParameter("soortklus");
    const formname = extractUrlParameter("formname");
    
    // Split dlform and dlsign
    const dlformSplit = url.split("dlform="); // splitst het eerste laatste deel van de url vanaf "dlform="
    const afterDlform = dlformSplit[dlformSplit.length - 1]; // pakt het gedeelte van de url
    const dlArray = afterDlform.split("&dlsign=");

    const dlform = dlArray[0];
    const dlsign = dlArray[1];
    
    // initialize trigger url
    const flowTriggerUrl = "https://prod-159.westeurope.logic.azure.com:443/workflows/8b2be737ee804dbc902b49adde2b1a5e/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=IvKTz0kCTEdvFW9vExUQHKnWYWVl-Qe_eTTWV4C_L08";

    // trigger power automate to process the workorder completion
    fetch(flowTriggerUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(
            {
                "taskid": taskid,
                "formid": formid,
                "opdref": opdref,
                "opdrachtgever": opdrachtgever,
                "opdrachtgeverid": opdrachtgeverid,
                "naamklant": naamklant,
                "adres": adres,
                "soortklus": soortklus,
                "formname": formname,
                "dlform": dlform,
                "dlsign": dlsign
            }
        )
    })
        .then(response => {
            // Verwerk de response
            console.log('Flow trigger response:', response);
        })
        .catch(error => {
            // Verwerk de error
            console.error('Flow trigger error:', error);
        });

}

// Voer de code uit op basis van de aanwezigheid van parameters
if (requiredParameters.every(controleerParameter)) {
    runMainJs();
} else {
    runErrorScreen();
}

function runErrorScreen() {
    // Code voor het tonen van foutmeldingen of iets dergelijks
}
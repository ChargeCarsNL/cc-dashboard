// Wordt geactiveerd wanneer de pagina is geladen
window.addEventListener('load', function () {

    // Huidige URL ophalen
    const url = window.location.href;

    // Array met vereiste parameters
    const requiredParameters = ["taskid", "formid", "opdref", "opdrachtgever", "opdrachtgeverid", "naamklant", "adres", "soortklus", "formname", "dlform"];

    // Voer de code uit op basis van de aanwezigheid van parameters
    try {
        if (requiredParameters.every(controleerParameter)) {
            runMainJs();
        } else {
            runErrorScreen("Niet alle vereiste parameters zijn aanwezig in de URL.");
        }
    } catch (error) {
        runErrorScreen("Er is een fout opgetreden bij het controleren van de parameters.");
    }

    function runErrorScreen(foutmelding) {
        // Toon het error_screen en verberg andere schermen
        document.getElementById("error_screen").style.display = "flex";
        document.getElementById("success_screen").style.display = "none";
        document.getElementById("loading_screen").style.display = "none";

        // Stel de foutmeldingstekst in
        document.getElementById("error_message_box").textContent = foutmelding;
    }

    function runSuccessCreen() {
        // Toon het error_screen en verberg andere schermen
        document.getElementById("error_screen").style.display = "none";
        document.getElementById("success_screen").style.display = "flex";
        document.getElementById("loading_screen").style.display = "none";
    }

    // Functie om te controleren of een parameter aanwezig is in de URL
    function controleerParameter(parameterNaam) {
        const urlParameters = new URLSearchParams(url);
        return urlParameters.has(parameterNaam);
    }

    // Functie om een URL-parameter te extraheren
    function extractUrlParameter(sleutel) {
        const urlObj = new URL(url);
        const params = new URLSearchParams(urlObj.search);
        return params.get(sleutel);
    }

    // Start de codeverwerkingsfunctie
    function runMainJs() {
        // Extract de parameters met behulp van de extractUrlParameter functie
        const taskid = extractUrlParameter("taskid");
        const formid = extractUrlParameter("formid");
        const opdref = extractUrlParameter("opdref");
        const opdrachtgever = extractUrlParameter("opdrachtgever");
        const opdrachtgeverid = extractUrlParameter("opdrachtgeverid");
        const naamklant = extractUrlParameter("naamklant");
        const adres = extractUrlParameter("adres");
        const soortklus = extractUrlParameter("soortklus");
        const formname = extractUrlParameter("formname");

        // Split dlform en dlsign
        const dlformSplit = url.split("dlform=");
        const naDlform = dlformSplit[dlformSplit.length - 1];
        const dlArray = naDlform.split("&dlsign=");

        const dlform = dlArray[0];
        let dlsign = "";

        // Als dlsign bestaat, stel dan de parameterwaarde in
        if (dlArray.length > 1) {
            dlsign = dlArray[1];
        };

        // Initialiseer de trigger-URL
        const flowTriggerUrl = "https://prod-159.westeurope.logic.azure.com:443/workflows/8b2be737ee804dbc902b49adde2b1a5e/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=IvKTz0kCTEdvFW9vExUQHKnWYWVl-Qe_eTTWV4C_L08";

        // Activeer Power Automate om de voltooiing van de werkorder te verwerken
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
                // Verwerk de respons
                console.log('Flow trigger respons:', response);
                runSuccessCreen();
            })
            .catch(error => {
                // Verwerk de fout
                console.error('Flow trigger fout:', error);
                runErrorScreen(error);
            });

    }

});

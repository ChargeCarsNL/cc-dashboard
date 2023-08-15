// Wordt geactiveerd wanneer de pagina is geladen
window.addEventListener('load', function () {

    // Huidige URL ophalen
    const url = window.location.href;

    // Array met vereiste parameters
    const requiredParameters = ["taskid", "formid", "opdref", "opdrachtgever", "opdrachtgeverid", "naamklant", "adres", "soortklus", "formname", "status", "statusmessage", "dlform"];

    // Functie om te controleren of een parameter aanwezig is in de URL en een string is
    function controleerParameters() {
        const urlParameters = new URLSearchParams(window.location.search);

        for (const parameterNaam of requiredParameters) {
            const parameterWaarde = urlParameters.get(parameterNaam);
            if (typeof parameterWaarde !== 'string' || parameterWaarde === '') {
                console.error(`Vereiste parameter ontbreekt of heeft geen geldige waarde: ${parameterNaam}`);
                return false;
            }
        }

        return true;
    }

    // Voer de code uit op basis van de aanwezigheid van parameters
    if (controleerParameters()) {
        runMainJs();
    } else {
        runErrorScreen("Niet alle vereiste parameters zijn aanwezig in de URL.");
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
        const status = extractUrlParameter("status");
        const statusmessage = extractUrlParameter("statusmessage");

        // Split dlform en dlsign
        const dlformSplit = url.split("dlform=");
        const dlform = dlformSplit[dlformSplit.length - 1];

        // Initialiseer de trigger-URL
        const flowTriggerUrl = "https://prod-159.westeurope.logic.azure.com:443/workflows/8b2be737ee804dbc902b49adde2b1a5e/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=IvKTz0kCTEdvFW9vExUQHKnWYWVl-Qe_eTTWV4C_L08";

        // Activeer Power Automate om de voltooiing van de werkorder te verwerken
        const jsonBody = {
            "taskid": taskid,
            "formid": formid,
            "opdref": opdref,
            "opdrachtgever": opdrachtgever,
            "opdrachtgeverid": opdrachtgeverid,
            "naamklant": naamklant,
            "adres": adres,
            "soortklus": soortklus,
            "formname": formname,
            "status": status,
            "statusmessage": statusmessage,
            "dlform": dlform
        }

        console.log(jsonBody);

        fetch(flowTriggerUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(
                jsonBody
            )
        })
            .then(response => {
                return response.json();
            })
            .then(data => {
                console.log('Flow trigger respons:', data);
                runSuccessCreen();
            })
            .catch(error => {
                console.error('Flow trigger fout:', error);

                // Log de volledige foutrespons
                console.log('Volledige foutrespons:', error.response);

                runErrorScreen(error);
            });
    }

});

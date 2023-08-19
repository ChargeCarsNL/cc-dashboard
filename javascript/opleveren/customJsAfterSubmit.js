// Event on form submission success
// You can paste this script to Form's custom JS Box
$form.on('fluentform_submission_success', function () {

    // Get values from form
    const taskid = $form.find("[name='taskid']").val() || "";
    const formid = $form.find("[name='formid']").val() || "";
    const opdref = $form.find("[name='opdref']").val() || "";
    const opdrachtgever = $form.find("[name='opdrachtgever']").val() || "";
    const opdrachtgeverid = $form.find("[name='opdrachtgeverid']").val() || "";
    const naamklant = $form.find("[name='naamklant']").val() || "";
    const adres = $form.find("[name='adres']").val() || "";
    const soortklus = $form.find("[name='soortklus']").val() || "";
    const formname = $form.find("[name='formname']").val() || "";
    const dlform = $form.find("[name='dlform']").val() || "";
    const dlsign = $form.find("[name='dlsign']").val() || "";
    
    // Probleem is de manier hoe de dlform en dlsign worden ontleed uit de url (omdat het urls zijn). hier moet je een aparte functie voor schrijven
    
    console.log(dlform);
    console.log(dlsign);
    
    function getParameterValueByKey(key) {
        const queryString = window.location.search;
        console.log(queryString);
        const urlParameters = new URLSearchParams(queryString);
        return urlParameters.get(key);
    }

    // Example usage
    const paramValue1 = getParameterValueByKey('dlform');
    const paramValue2 = getParameterValueByKey('dlsign');
    console.log(paramValue1); // Output depends on the actual URL parameter value
    console.log(paramValue2); // Output depends on the actual URL parameter value


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

});
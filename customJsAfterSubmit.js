// Event on form submission success
// You can paste this script to Form's custom JS Box
$form.on('fluentform_submission_success', function () {

    const flowTriggerUrl = "https://prod-159.westeurope.logic.azure.com:443/workflows/8b2be737ee804dbc902b49adde2b1a5e/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=IvKTz0kCTEdvFW9vExUQHKnWYWVl-Qe_eTTWV4C_L08";

    // Get values from form
    const taskid = $form.find("[name='taskid']").val() || "";
    const formid = $form.find("[name='formid']").val() || "";
    const opdref = $form.find("[name='opdref']").val() || "";
    const opdrachtgever = $form.find("[name='opdrachtgever']").val() || "";
    const naamklant = $form.find("[name='naamklant']").val() || "";
    const dlform = $form.find("[name='dlform']").val() || "";
    const dlsign = $form.find("[name='dlsign']").val() || "";

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
                "naamklant": naamklant,
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
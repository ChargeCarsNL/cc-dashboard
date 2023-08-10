window.addEventListener('load', function () {
    // get taskId from querystring
    const urlParams = new URLSearchParams(window.location.search);
    const taskID = urlParams.get('taskid');

    // Set API key and request url variables
    const apiKey = '15c34515-3bfb-47fb-9a4c-b39de6822ca5';
    const url =
        'https://prod-86.westeurope.logic.azure.com:443/workflows/597c6ec246244650b9b4aab8bd45e87a/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=FJHndl9oqnpIvHeUDQ615IK26SKzEePM8-b7hXrFrh8';

    // Get task information from ClickUp API
    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Api-Key': apiKey,
        },
        body: JSON.stringify({ taskId: taskID }),
    })
        .then((response) => response.json())
        .then((data) => {

            // Initialize customer and job properties
            const klusNaam = data.name;
            const opdRef = data.custom_fields.find(
                (field) => field.id === '97d824e2-abdc-4adc-a5f3-4dd748fc6234'
            ).value;

            // Haal een referentie naar het HTML-element op basis van het ID
            var jobnameContainer = document.getElementById("jobinfo");
            // Create paragraph elements for each propertie
            var opdRefElement = document.createElement("p");
            opdRefElement.textContent = opdRef;
            opdRefElement.style.fontWeight = "bold";
            var jobNameElement = document.createElement("p");
            jobNameElement.textContent = klusNaam;

            // Append the elements to the container
            jobnameContainer.appendChild(opdRefElement);
            jobnameContainer.appendChild(jobNameElement);

        }).catch(error => console.error('Error:', error))
});
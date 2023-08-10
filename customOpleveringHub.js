window.addEventListener('load', function () {
    const apiKey = '15c34515-3bfb-47fb-9a4c-b39de6822ca5';
    const taskID = new URLSearchParams(window.location.search).get('taskid');

    const url =
        'https://prod-86.westeurope.logic.azure.com:443/workflows/597c6ec246244650b9b4aab8bd45e87a/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=FJHndl9oqnpIvHeUDQ615IK26SKzEePM8-b7hXrFrh8';

    // Declare werkbonsoorten with ids
    const lmraWerkbonId = "39ce6e14-6b51-42f9-80bd-10ff8b74bd1e";
    const installatieWerkbonId = "8c0c0d66-cac9-4bbe-b460-ed12b8d8dda1";
    const groepenkastWerkbonId = "35616272-f1f3-4a26-9eef-780b386f737e";
    const serviceWerkbonId = "77254513-df56-493e-8e48-349c2fadd3c4";
    const demontageWerkbonId = "92562e08-682c-41c8-b656-67e1b467ca1c";
    const schouwingWerkbonId = "3427c7d5-a12c-48ed-8114-55fe7af0ddfd";

    const werkbonnenArray = [
        lmraWerkbonId,
        installatieWerkbonId,
        groepenkastWerkbonId,
        serviceWerkbonId,
        demontageWerkbonId,
        schouwingWerkbonId
    ];

    // Fetch data from ClickUp API
    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Api-Key': apiKey,
        },
        body: JSON.stringify({ taskId: taskID }),
    })
        .then(response => response.json())
        .then(data => handleData(data))
        .catch(error => console.error('Error:', error));

    // Handle the fetched data
    function handleData(data) {
        if (!data || !data.custom_fields) {
            console.error('Data is missing or improperly formatted.');
            return;
        }

        placeTextInHeader(data);

        const verstuurdeWerkbonnenArray = extractVerstuurdeWerkbonnenArray(data);

        const werkbonnenBenodigd = getWerkbonnenBenodigd(data);

        // display buttons based on requirements
        werkbonnenArray.forEach(id => {
            updateChildElements(id, verstuurdeWerkbonnenArray, werkbonnenBenodigd);
        });

        // hide lmra if not required
        const lmraSection = document.getElementById("section39ce6e14-6b51-42f9-80bd-10ff8b74bd1e");

        if (werkbonnenBenodigd.includes(lmraWerkbonId)) {
            lmraSection.style.display = 'flex';
            console.log("truetrue");
        };

        checkWerkbonnenCompleteness(werkbonnenBenodigd, verstuurdeWerkbonnenArray);

        const loadingFrame = document.getElementById("loadingFrame");
        loadingFrame.style.display = "none";
    }

    // Functie die controleert of alle werkbonnen zijn ingevuld
    function checkWerkbonnenCompleteness(werkbonnenBenodigd, verstuurdeWerkbonnenArray) {
        const isWerkbonnenComplete = arraysAreEqual(werkbonnenBenodigd, verstuurdeWerkbonnenArray);

        const trueCompleteElement = document.getElementById("truecomplete");
        const falseCompleteElement = document.getElementById("falsecomplete");

        if (trueCompleteElement) {
            trueCompleteElement.style.display = isWerkbonnenComplete ? 'flex' : 'none';
            falseCompleteElement.style.display = isWerkbonnenComplete ? 'none' : 'flex';
        } else if (falseCompleteElement) {
            trueCompleteElement.style.display = isWerkbonnenComplete ? 'none' : 'flex';
            falseCompleteElement.style.display = isWerkbonnenComplete ? 'flex' : 'none';
        }
    }

    // Function that check if arrays are equal
    function arraysAreEqual(array1, array2) {
        if (array1.length !== array2.length) {
            return false;
        }

        for (let i = 0; i < array1.length; i++) {
            if (!array2.includes(array1[i])) {
                return false;
            }
        }

        return true;
    }

    // display jobinfo in header function
    function placeTextInHeader(data) {
        const soortKlusName = getDropdownOptionByValue('5e386287-7885-43f6-9dc5-ff494cec5be4', data).name;
        const jobName = data.name;

        const jobInfoHeader = document.getElementById("job-info-header");
        jobInfoHeader.innerHTML = ""; // Clear existing content

        const jobnameNode = document.createTextNode(jobName);
        const soortKlusNode = document.createTextNode(soortKlusName);

        // Create div elements for styling
        const jobnameDiv = document.createElement("div");
        jobnameDiv.appendChild(jobnameNode);
        jobnameDiv.style.width = "100%";

        const soortKlusDiv = document.createElement("div");
        soortKlusDiv.appendChild(soortKlusNode);
        soortKlusDiv.style.width = "100%";
        soortKlusDiv.style.fontWeight = "bold";

        // Append the div elements to the header
        jobInfoHeader.appendChild(jobnameDiv);
        jobInfoHeader.appendChild(soortKlusDiv);
    }

    // Get filled workorders from clickup custom tag field
    function extractVerstuurdeWerkbonnenArray(data) {
        const verstuurdeWerkbonnenField = data.custom_fields.find(
            field => field.id === 'f3245e18-c65b-41c3-85e3-da7c58c16e2d'
        );

        if (!verstuurdeWerkbonnenField || !verstuurdeWerkbonnenField.value) {
            console.error('verstuurdeWerkbonnenArray data is missing or improperly formatted.');
            return [];
        }

        return verstuurdeWerkbonnenField.value;
    }

    function getWerkbonnenBenodigd(data) {
        const soortKlusId = getDropdownOptionByValue('5e386287-7885-43f6-9dc5-ff494cec5be4', data).id;

        switch (soortKlusId) {
            case '5aba3565-a745-4ea3-88f4-b9d830217902'/*installatie*/:
                return [lmraWerkbonId, installatieWerkbonId];
            case '4630eae2-4eb1-4c01-93b8-84e6814e0e34'/*Installatie + meterkast*/:
                return [lmraWerkbonId, installatieWerkbonId, groepenkastWerkbonId];
            case "adf9c072-de30-4d04-9026-732594cfc727"/*Service*/:
                return [serviceWerkbonId];
            case "3dcb8ebf-7740-4d83-8fbf-3a0572b7f694"/*Schouwing*/:
                return [schouwingWerkbonId];
            case "06b64dfd-1a23-4c4e-8d5f-cc6322429258"/*Meterkast*/:
                return [groepenkastWerkbonId, lmraWerkbonId];
            case "a1df877f-1a3a-4344-a7f3-16e2690eef88"/*Verhuizing*/:
                return [lmraWerkbonId, demontageWerkbonId, installatieWerkbonId];
            case "2f113b15-fdf3-480e-b74d-13ecbb0c9bb3"/*Migratie*/:
                return [serviceWerkbonId];
            case "b97556bd-c6ee-4bcd-8a26-37e866b15221"/*Demontage*/:
                return [demontageWerkbonId];
            case "0d71a148-70ac-4a4b-b0c6-f088c94fb6ed"/*Demontage en afmontage*/:
                return [lmraWerkbonId, demontageWerkbonId, installatieWerkbonId];
            default:
                return [];
        }
    }

    function updateChildElements(id, verstuurdeWerkbonnenArray, werkbonnenBenodigd) {
        const trueChild = document.getElementById(`true${id}`);
        const falseChild = document.getElementById(`false${id}`);

        const isRequired = werkbonnenBenodigd.includes(id);
        const isFilled = verstuurdeWerkbonnenArray.includes(id);

        if (isRequired) {
            trueChild.style.display = isFilled ? 'flex' : 'none';
            falseChild.style.display = isFilled ? 'none' : 'flex';
        } else {
            trueChild.style.display = "none";
            falseChild.style.display = "none";
        }
    }

    function getDropdownOptionByValue(customFieldId, data) {
        const field = data.custom_fields.find(field => field.id === customFieldId);
        const selectedOptionOrderIndex = field.value;
        const selectedOption = field.type_config.options.find(option => option.orderindex === selectedOptionOrderIndex);

        if (selectedOption) {
            return selectedOption;
        } else {
            throw new Error(`Object met orderindex ${selectedOptionOrderIndex} niet gevonden.`);
        }
    }
});

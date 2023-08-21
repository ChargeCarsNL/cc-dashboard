window.addEventListener('DOMContentLoaded', function () {

    const button = document.getElementById("cc_nummer_check_button");
    const messageBox = document.getElementById("message_box");
    messageBox.classList.add("message-box"); // Apply the message box container style
    messageBox.style.display = "none";
    const redispatchForm = document.getElementById("re-dispatch_formulier"); // Added this line
    redispatchForm.style.display = "none";
    const apiKey = "your-api-key"; // Replace with your actual API key
    const url = 'https://prod-86.westeurope.logic.azure.com:443/workflows/597c6ec246244650b9b4aab8bd45e87a/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=FJHndl9oqnpIvHeUDQ615IK26SKzEePM8-b7hXrFrh8';

    button.addEventListener("click", function () {
        const filledCCNumber = document.getElementById("cc_nummer_veld").value.trim().toUpperCase();

        if (filledCCNumber.length === 8 && filledCCNumber.startsWith("CC-")) {
            fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Api-Key': apiKey,
                },
                body: JSON.stringify({ taskId: filledCCNumber }),
            })
                .then(response => response.json())
                .then(data => handleData(data))
                .catch(error => console.error('Error:', error));
        } else {
            displayWarning("Het ingevoerde CC-nummer is onjuist / bestaat niet");
        }
    });

    function handleData(data) {
        if (!data || !data.custom_fields) {
            console.error('Data is missing or improperly formatted.');
            return;
        }
        if (data.id) {
            displayTaskFoundMessage(data.name);
            redispatchForm.style.display = "flex"; // Show the element
            setHiddenTaskIdValue(data.id);
        } else {
            displayWarning("Task name not found in data.");
        }
    }

    function displayTaskFoundMessage(taskName) {
        messageBox.style.display = "flex"; // Show the message box
        const taskNameMessage = `Klus gevonden: ${taskName}`;
        messageBox.innerHTML = ''; // Clear previous messages
        const taskNameElement = document.createElement("p");
        taskNameElement.innerHTML = taskNameMessage;
        taskNameElement.classList.add("success-message"); // Apply the success message style
        messageBox.appendChild(taskNameElement);
    }

    function displayWarning(text) {
        messageBox.style.display = "flex"; // Show the message box
        redispatchForm.style.display = "none";
        const warningTextElement = document.createElement("p");
        warningTextElement.textContent = text;
        warningTextElement.classList.add("warning-message"); // Apply the warning message style
        messageBox.innerHTML = ''; // Clear previous messages
        messageBox.appendChild(warningTextElement);
    }

    function displayError(text) {
        messageBox.style.display = "flex"; // Show the message box
        redispatchForm.style.display = "none";
        const errorTextElement = document.createElement("p");
        errorTextElement.textContent = text;
        errorTextElement.classList.add("error-message"); // Apply the error message style
        messageBox.innerHTML = ''; // Clear previous messages
        messageBox.appendChild(errorTextElement);
    }

    function setHiddenTaskIdValue(taskid) {
        const hiddenTaskIdField = document.getElementsByName('hidden_taskid')[0];
        hiddenTaskIdField.value = taskid;
        console.log(`Succesfully added taskid: ${taskid} to hidden field`);
    }

});

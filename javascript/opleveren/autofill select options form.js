let laadpaalSoortenObj = null;

// Function to get laadpaalSoorten data
async function fetchLaadpaalSoorten() {
    if (!laadpaalSoortenObj) {
        laadpaalSoortenObj = await getLaadpaalSoorten();
    }
    return laadpaalSoortenObj;
}

async function autoFillLaadpalen() {
    const keyword = 'repeater_field_3_0';
    const selectElementsWithKeyword = document.querySelectorAll(`[data-name*="${keyword}"]`);

    console.log('Selected elements:', selectElementsWithKeyword);

    console.log('Select elements with keyword:', selectElementsWithKeyword);

    const laadpaalSoortenObj = await fetchLaadpaalSoorten();

    console.log('Laadpaal soorten object:', laadpaalSoortenObj);

    if (laadpaalSoortenObj.tasks && laadpaalSoortenObj.tasks.length > 0) {
        const options = laadpaalSoortenObj.tasks.map(soort => {
            return {
                'name': soort.name,
                'value': soort.id
            };
        });

        // Add the "Anders" option
        options.push({
            'name': 'Anders',
            'value': 'Anders'
        });

        // Sort options alphabetically by name, except for "Anders"
        options.sort((a, b) => {
            if (a.name === 'Anders') return 1; // Move "Anders" to the end
            if (b.name === 'Anders') return -1;
            return a.name.localeCompare(b.name);
        });

        console.log('Options object: ', options);

        selectElementsWithKeyword.forEach(selectElement => {
            // Remove existing options
            while (selectElement.options.length > 0) {
                selectElement.remove(0);
            }

            options.forEach(option => {
                const newOption = document.createElement('option');
                newOption.value = option.value;
                newOption.textContent = option.name;
                selectElement.appendChild(newOption);
                console.log(option.name, ' option created');
            });
        });
    }
}

async function getLaadpaalSoorten() {

    const unitClassItemsList = '900401619864';
    const customFieldQuery = JSON.stringify([
        {
            "field_id": "da66ae38-b086-437d-bba2-92cb9619c07c",
            "operator": "=",
            "value": "0"
        }
    ]);

    const apiKey = 'pk_38199608_RWBKIFPYH9LSP1DAR6ZLNJD2ZQP5IY4T';
    const url = `https://api.clickup.com/api/v2/list/${unitClassItemsList}/task?custom_fields=${customFieldQuery}`;

    return await proxyFetch(url, {
        method: 'GET',
        headers: {
            Authorization: apiKey
        }
    });

}

// Function to remove unnecessary/unselected options
function removeOptionsExceptSelected(selectElement) {
    const selectedValue = selectElement.value;
    const options = selectElement.options;

    if (options) {
        for (let i = options.length - 1; i >= 0; i--) {
            if (options[i].value !== selectedValue) {
                selectElement.removeChild(options[i]);
            }
        }
    }
}

// Function to set the flag when "Repeat" button is clicked
function attachAutoFillListener(button) {
    button.addEventListener('click', function () {
        console.log('Repeat button clicked.');
        setTimeout(autoFillLaadpalen, 500);
    });
}

function setEventListenersForRepeaterButtons() {
    const repeatButtons = document.getElementsByClassName('repeat-plus');

    // Attach the event listener to existing "Repeat" buttons
    Array.from(repeatButtons).forEach(attachAutoFillListener);
}

// Run the autoFillLaadpalen() function when page is loaded
window.addEventListener('load', async function () {
    console.log('Page loaded.');
    await fetchLaadpaalSoorten();
    removeAllOptions(); // Trigger to remove all options
    autoFillLaadpalen();
    setEventListenersForRepeaterButtons(); // Attach initial event listeners
});

function removeAllOptions() {
    const allSelectElements = document.querySelectorAll('select');
    allSelectElements.forEach(selectElement => {
        while (selectElement.options.length > 0) {
            selectElement.remove(0);
        }
    });
}
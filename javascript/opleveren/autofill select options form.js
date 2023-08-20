async function autoFillLaadpalen() {
    const keyword = 'repeater_field_3';
    const selectElementsWithKeyword = document.querySelectorAll(`[name*="${keyword}"]`);

    const laadpaalSoortenObj = await getLaadpaalSoorten().tasks;

    if (laadpaalSoortenObj && laadpaalSoortenObj.length > 0) {
        const options = laadpaalSoortenObj.map(soort => {
            return {
                'name': soort.name,
                'value': soort.id
            };
        });

        selectElementsWithKeyword.forEach(selectElement => {
            options.forEach(option => {
                if (!selectElement.querySelector(`option[value="${option.value}"]`)) {
                    const newOption = document.createElement('option');
                    newOption.value = option.value;
                    newOption.textContent = option.name;
                    selectElement.appendChild(newOption);
                }
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

const repeatButtons = document.getElementsByClassName('repeat-plus');

// run autofill laadpaal options when extra laadpaal is added
Array.from(repeatButtons).forEach(button => {
    button.addEventListener('click', function () {
        autoFillLaadpalen();
    });
});

// run autofill laadpaal options when page is loaded
window.addEventListener('load', function () {
    autoFillLaadpalen();
});

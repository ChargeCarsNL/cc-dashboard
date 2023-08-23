window.addEventListener('load', async function () {

    startLoadingScreen('Nieuwe klus aan het aanmaken...');

    // Get url params
    const urlParams = new URLSearchParams(window.location.search);
    const taskId = urlParams.get('taskid');
    const listId = urlParams.get('listid');
    const soortKlus = urlParams.get('soortklus');
    const beschrijving = urlParams.get('beschrijving');
    const datum = urlParams.get('datum');
    const tijdsblok = urlParams.get('tijdsblok');

    const jobObj = {
        'taskid': taskId,
        'listid': listId,
        'soortklus': soortKlus,
        'beschrijving': beschrijving,
        'datum': datum,
        'tijdsblok': tijdsblok
    };

    const newJobResponse = await createReDispatch(jobObj);

    if (newJobResponse && newJobResponse != null) {
        stopLoadingScreen();
        runSuccessScreen(newJobResponse);
    } else {
        stopLoadingScreen();
        runErrorScreen('Kon geen nieuwe klus aanmaken');
    }
})

async function createReDispatch(jobObj) {

    const apiKey = 'pk_38199608_RWBKIFPYH9LSP1DAR6ZLNJD2ZQP5IY4T';

    const listId = jobObj.listId;
    const url = `https://api.clickup.com/api/v2/list/${listId}/task`;

    const description = jobObj.description;
    const soortKlus = jobObj.soortKlus;

    const taskName = '';

    await proxyFetch(url, {
        method: 'POST',
        headers: {
            'Authorization': apiKey,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            'name': taskName,
            'tags': ["re-dispatch"],
            'description': description,
            'custom_fields': [
                {
                    'id': '5e386287-7885-43f6-9dc5-ff494cec5be4',
                    'value': soortKlus
                }
            ]
        })
    })
        .then(responseData => {
            console.log('Response data:', responseData);
            return responseData;
        })
        .catch(error => {
            console.error('Error fetching unit class labels:', error);
            return null;
        });

}
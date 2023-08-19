function proxyFetch(url, requestObj) {

    // Add the request URL to a new header property
    requestObj.headers.url = url;

    const method = requestObj.method;

    if (method == 'GET') {
        return proxyFetchGET(url, requestObj);
    }

    if (method == 'POST') {
        return proxyFetchPOST(url, requestObj);
    }

    if (method == 'PUT') {
        return proxyFetchPUT(url, requestObj);
    }

    console.error('Method provided is not valid')
    return null
}

function proxyFetchGET(url, requestObj) {
    proxyUrl = 'https://prod-111.westeurope.logic.azure.com:443/workflows/c1a7a2f208da4ca89aaca0346bdc3e98/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=8w8AVtZo0uZQrpfVGOvYgcF6_UFDnbUSrns_ywHowos';

    fetch(proxyFetch, {
        method: 'GET',
        headers: headers
    })
        .then(response => {
            return response.json();
        })
        .then(data => {
            return data;
        })
        .catch(error => {
            console.error(error);
            return error;
        });
}

function proxyFetchPOST(url, requestObj) {
    proxyUrl = 'https://prod-111.westeurope.logic.azure.com:443/workflows/c1a7a2f208da4ca89aaca0346bdc3e98/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=8w8AVtZo0uZQrpfVGOvYgcF6_UFDnbUSrns_ywHowos';

    fetch(proxyFetch, {
        method: 'POST',
        headers: headers,
        body: requestObj.body
    })
        .then(response => {
            return response.json();
        })
        .then(data => {
            return data;
        })
        .catch(error => {
            console.error(error);
            return error;
        });
}

function proxyFetchPUT(url, requestObj) {
    proxyUrl = 'https://prod-111.westeurope.logic.azure.com:443/workflows/c1a7a2f208da4ca89aaca0346bdc3e98/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=8w8AVtZo0uZQrpfVGOvYgcF6_UFDnbUSrns_ywHowos';

    fetch(proxyFetch, {
        method: 'PUT',
        headers: headers,
        body: requestObj.body
    })
        .then(response => {
            return response.json();
        })
        .then(data => {
            return data;
        })
        .catch(error => {
            console.error(error);
            return error;
        });
}
function proxyFetch(url, requestObj) {

    const method = requestObj.method;

    proxyUrl = 'https://prod-111.westeurope.logic.azure.com:443/workflows/c1a7a2f208da4ca89aaca0346bdc3e98/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=8w8AVtZo0uZQrpfVGOvYgcF6_UFDnbUSrns_ywHowos';
    requestObj.headers.method = method
    requestObj.headers.url = url;

    const headers = requestObj.headers;
    const body = requestObj.body;

    console.log(`Running request with method: ${method}, Headers: ${headers}, Body: ${body}`);
    console.log(headers);

    await fetch(proxyUrl, {
        method: 'POST',
        headers: headers,
        body: body
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

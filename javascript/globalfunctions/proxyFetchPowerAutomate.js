async function proxyFetch(url, requestObj) {
    const method = requestObj.method;

    const proxyUrl = 'https://prod-111.westeurope.logic.azure.com:443/workflows/c1a7a2f208da4ca89aaca0346bdc3e98/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=8w8AVtZo0uZQrpfVGOvYgcF6_UFDnbUSrns_ywHowos';

    if (requestObj.headers && requestObj.headers.Authorization) {
        // Rename the property from Authorization to _Authorization
        requestObj.headers._Authorization = requestObj.headers.Authorization;
        delete requestObj.headers.Authorization;
    }

    requestObj.headers.method = method;
    requestObj.headers.url = url;

    const headers = requestObj.headers;
    const body = requestObj.body;

    requestObj.method = 'POST';

    console.log(`Running request with method: ${method}, Headers: ${JSON.stringify(headers)}, Body: ${body}`);

    try {
        const response = await fetch(proxyUrl, requestObj);
        console.log('Raw response:', response); // Voeg deze log toe
        if (!response.ok) {
            throw new Error(`Fetch failed with status ${response.status}`);
        }
        const jsonResponse = await response.json();
        console.log('Parsed response:', jsonResponse); // Voeg deze log toe
        return jsonResponse;
    } catch (error) {
        console.error('Proxy fetch error:', error);
        throw error;
    }
}

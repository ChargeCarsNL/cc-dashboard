// Call the function when the page loads
window.onload = tokenHandling();

function tokenHandling() {

    const code = getUrlParameter('code');
    const accessToken = getAccessToken(code);

    if (accessToken != null) {
        const userCredentials = getAuthorizedUser(accessToken);
        if (userCredentials != null) {

            const token = accessToken;
            const userName = userCredentials.username;
            const userImageUrl = userCredentials.profilePicture;
            const userId = userCredentials.id;
            const userEmail = userCredentials.email;

            // set time till expire (days)
            const timeTillExpire = 14;

            // Set cookies for the data
            setCookie('cu_user_token', token, timeTillExpire);
        }

    }

}

function getAccessToken(code) {
    const clientId = 'IPQVKKJYVDD3YTE3X1P1A1D0U0LKBT06';
    const clientSecret = '6N7K27ELRG2U3NY2VD8UN8FJ8HJFDCS2Z0610056XKP2YB0K0RJ7FUSRP9BA8PLW';
    const url = 'https://prod-111.westeurope.logic.azure.com:443/workflows/c1a7a2f208da4ca89aaca0346bdc3e98/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=8w8AVtZo0uZQrpfVGOvYgcF6_UFDnbUSrns_ywHowos';

    fetch(url, {
        method: 'POST',
        headers: {
            'client_id': clientId,
            'client_secret': clientSecret,
            'code': code
        }
    })
        .then(response => {
            return response.json();
        })
        .then(data => {
            console.log('Flow trigger respons:', data);
            const accessToken = data.access_token;
            return accessToken;
        })
        .catch(error => {
            console.error('Flow trigger fout:', error);
            // Log de volledige foutrespons
            console.log('Volledige foutrespons:', error.response);
            return null;
        });
}

// Function to set a cookie
function setCookie(name, value, days) {
    const expires = new Date();
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = `${name}=${encodeURIComponent(value)};expires=${expires.toUTCString()};path=/`;
}

function getAuthorizedUser(accessToken) {

    const url = 'https://prod-178.westeurope.logic.azure.com:443/workflows/cccd6a9d2bc247e5a813834f87228b15/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=0HRqHNN8VdMtpQ2tkcmv__5je-xZAmi7hr1zrTI1Rs0';

    fetch(url, {
        method: 'GET',
        headers: {
            'Authorization': accessToken
        }
    })
        .then(response => {
            return response.json();
        })
        .then(data => {
            console.log('Flow trigger respons:', data);
            return data;
        })
        .catch(error => {
            console.error('Flow trigger fout:', error);
            // Log de volledige foutrespons
            console.log('Volledige foutrespons:', error.response);
            return null;
        });

}

// Function to get the value of a URL parameter
function getUrlParameter(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}


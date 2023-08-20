// Call the function when the page loads
window.onload = tokenHandling;

async function tokenHandling() {
    try {
        const code = getUrlParameter('code');
        const accessToken = await getAccessToken(code);

        if (accessToken) {

            const userCredentials = await getAuthorizedUser(accessToken);

            if (userCredentials) {
                console.log('User credentials are available');
                const token = accessToken;
                const { username: userName, profilePicture: userImageUrl, id: userId, email: userEmail } = userCredentials;

                // set time till expire (days)
                const timeTillExpire = 30;
                console.log('Setting cookies');
                // Set cookies for the data
                setCookie('cu_user_token', token, timeTillExpire);
                runLoggedInScreen();
            } else {
                console.log('User credentials are not available');
            }
        } else {
            console.log('Access token is not available');
        }
    } catch (error) {
        console.error('An error occurred:', error);
    }
}

async function getAccessToken(code) {
    const clientId = 'IPQVKKJYVDD3YTE3X1P1A1D0U0LKBT06';
    const clientSecret = '6N7K27ELRG2U3NY2VD8UN8FJ8HJFDCS2Z0610056XKP2YB0K0RJ7FUSRP9BA8PLW';
    const url = `https://api.clickup.com/api/v2/oauth/token?client_id=${clientId}&client_secret=${clientSecret}&code=${code}`;

    const accessCode = await proxyFetch(url, {
        method: 'POST',
        headers: {
            'client_id': clientId,
            'client_secret': clientSecret,
            'code': code
        }
    });

    const accessToken = accessCode.access_token;

    if (accessToken) {
        console.log(`AccessCode: ${accessToken} obtained`);
        return accessToken;
    }

    console.log('No access token obtained');
    return null;
}

// Other functions remain unchanged

// Function to get the value of a URL parameter
function getUrlParameter(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

async function getAuthorizedUser(accessToken) {
    const url = 'https://prod-178.westeurope.logic.azure.com:443/workflows/cccd6a9d2bc247e5a813834f87228b15/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=0HRqHNN8VdMtpQ2tkcmv__5je-xZAmi7hr1zrTI1Rs0';

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'access_token': accessToken
            }
        });

        if (!response.ok) {
            throw new Error(`Fetch failed with status ${response.status}`);
        }

        const data = await response.json();
        console.log('Flow trigger respons:', data);
        return data;
    } catch (error) {
        console.error('Flow trigger error:', error);
        // Log the full error response
        console.log('Full error response:', error.response);
        return null;
    }
}

// Function to set a cookie
function setCookie(name, value, days) {
    const expires = new Date();
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = `${name}=${encodeURIComponent(value)};expires=${expires.toUTCString()};path=/`;
}
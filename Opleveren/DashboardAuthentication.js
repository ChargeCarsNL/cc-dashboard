// Function to check if the token is valid
function getUserCredentials(token) {

    const url = 'https://prod-178.westeurope.logic.azure.com:443/workflows/cccd6a9d2bc247e5a813834f87228b15/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=0HRqHNN8VdMtpQ2tkcmv__5je-xZAmi7hr1zrTI1Rs0';

    fetch(flowTriggerUrl, {
        method: 'GET',
        headers: {
            'cu_token': token
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
            // token is not valid / outdated
            return null;
        });

    return token !== '';
}

// Function to get the value of a cookie
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

// Main function to check token validity and redirect if needed
function tokenValidation() {
    if (!isRedirectOrLoginUrl()) {
        const token = getCookie('cu_user_token'); // Change 'your_token_cookie_name' to the actual cookie name
        if (token) {
            // Token exists. Start validation and getting user info
            userCredentials = getUserCredentials(token);
            if (userCredentials != null) {
                // Unable to get user credentials. Re-authenticate at url
                reAuthenticate();
            }
        } else {
            // Redirect the user to the authentication page
            reAuthenticate();
        }
    }
}

function reAuthenticate() {
    /*const clientId = 'BZDURFU0XGCONAQRFRSOH5XOENTIHDK5';
    const redirectUri = 'https://dash.chargecars.nl/oauth';
    authUrl = `https://app.clickup.com/api?client_id=${clientId}&redirect_uri=${redirectUri}`;
    // brings user to authentication page
    window.location.href = authUrl;*/

    const loginUrl = 'https://dash.chargecars.nl/user-login';
    // bring user to login page
    window.location.href = loginUrl;

}

// Function to check if the current URL matches the redirect URL
function isRedirectOrLoginUrl() {
    const currentUrl = window.location.href;
    const redirectUrlPath = '/oauth';
    const loginUrlPath = '/user-login'; 
    if (currentUrl.includes(redirectUrlPath)) {
        return true;
    } else if (currentUrl.includes(loginUrlPath)) {
        return true;
    }
    return false;
}

// Call the function when the page loads
window.onload = tokenValidation();
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
            setCookie('token', token, timeTillExpire);
            setCookie('user_name', userName, timeTillExpire);
            setCookie('user_image_url', userImageUrl, timeTillExpire);
            setCookie('user_id', userId, timeTillExpire);
            setCookie('user_email', userEmail, timeTillExpire);
        }

    }

}

function getAccessToken(code) {
    const clientId = '';
    const clientSecret = '';
    const url = `https://api.clickup.com/api/v2/oauth/token?client_id=${clientId}&client_secret=${clientSecret}&code=${code}`;

    fetch(url, {
        method: 'POST'
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

    const url = 'https://api.clickup.com/api/v2/user';

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


window.addEventListener('load', function () {

    let errorMessageScreen = document.getElementById('error_message_screen');
    let errorMessageText = document.getElementById('error_message_text');
    let succesMessageScreen = document.getElementById('succes_message_screen');
    let succesMessageText = document.getElementById('succes_message_text');

});

function runErrorMessage(message) {
    // Annuleer het vorige timeout als het bestaat
    if (timeoutId) {
        clearTimeout(timeoutId);
    }
    stopLoadingScreen();
    console.error(`Fout. ${message}`);
    errorMessageText.innerHTML = message;
    errorMessageScreen.style.top = '80px'; // get element in view
    errorMessageScreen.style.opacity = '1'; // fade in

    // After the specified duration, hide the element and set timeoutId
    timeoutId = setTimeout(function () {
        errorMessageScreen.style.top = '-100px'; // Hide the element
        errorMessageScreen.style.opacity = '0'; // fade out
    }, 3000);
}

function runSuccesMessage(message) {
    // Annuleer het vorige timeout als het bestaat
    if (timeoutId) {
        clearTimeout(timeoutId);
    }
    stopLoadingScreen();
    console.log(`Succes. ${message}`);
    succesMessageText.innerHTML = message;
    succesMessageScreen.style.top = '80px'; // get element in view
    succesMessageScreen.style.opacity = '1'; // fade in


    // After the specified duration, hide the element and set timeoutId
    timeoutId = setTimeout(function () {
        succesMessageScreen.style.top = '-100px'; // Hide the element
        succesMessageScreen.style.opacity = '0'; // fade out
    }, 3000);
}
function runLoadingScreen(message) {
    console.log(`Aan het laden...`);
    const loadingScreen = document.getElementById('loading_screen');
    loadingScreen.style.display = 'flex';
    if (message && message.length > 0 ) {
        document.getElementById('loading_text').innerHTML = message;
    } else {
        document.getElementById('loading_text').innerHTML = 'Aan het laden...';
    }
}
    

function stopLoadingScreen() {
    const loadingScreen = document.getElementById('loading_screen');
    loadingScreen.style.display = 'none';
    document.getElementById('loading_text').innerHTML = '';
}
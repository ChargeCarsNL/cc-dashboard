function runLoadingScreen(message) {
    console.log(`Aan het laden...`);
    const loadingScreen = document.getElementById('loading_screen');
    loadingScreen.style.display = 'flex';
    document.getElementById('loading_text').innerHTML = message;
}

function stopLoadingScreen() {
    const loadingScreen = document.getElementById('loading_screen');
    loadingScreen.style.display = 'none';
    document.getElementById('loading_text').innerHTML = 'Aan het laden...';
}
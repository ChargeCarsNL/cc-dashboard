function runLoadingScreen(message) {

    const brixContent = document.getElementById('brx-content');

    if (document.getElementById('brx-content')) {

        brixContent.style.display = 'none';

    }

    console.log(`Aan het laden...`);
    const loadingScreen = document.getElementById('loading_screen');
    loadingScreen.style.display = 'flex';
    if (message && message.length > 0) {
        document.getElementById('loading_text').innerHTML = message;
    } else {
        document.getElementById('loading_text').innerHTML = 'Aan het laden...';
    }
}


function stopLoadingScreen() {

    const brixContent = document.getElementById('brx-content');

    if (document.getElementById('brx-content')) {

        brixContent.style.display = 'block';

    }

    const loadingScreen = document.getElementById('loading_screen');
    loadingScreen.style.display = 'none';
    document.getElementById('loading_text').innerHTML = '';
}
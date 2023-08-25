/* Deze script is in de header van dash.chargecars.nl geplaatst */

function runLoadingScreen(message) {
    const brixContent = document.getElementById('brx-content');
    if (brixContent) {
        brixContent.style.opacity = 0; // Begin met volledig transparant
    }

    const loadingScreen = document.getElementById('loading_screen');
    loadingScreen.style.display = 'flex';
    loadingScreen.style.zIndex = 99; // Zet z-index op 99 als het laadscherm zichtbaar is

    const loadingText = document.getElementById('loading_text');
    if (message && message.length > 0) {
        loadingText.innerHTML = message;
    } else {
        loadingText.innerHTML = 'Aan het laden...';
    }

    // Fade in
    loadingScreen.style.opacity = 1; // Zet de laadachtergrond op volledige dekking
    loadingText.style.opacity = 1; // Zet de tekst op volledige dekking
    loadingScreen.style.display = 'flex';
}

function stopLoadingScreen() {
    const brixContent = document.getElementById('brx-content');
    if (brixContent) {
        brixContent.style.opacity = 1; // Herstel de content naar volledige dekking
    }

    const loadingScreen = document.getElementById('loading_screen');
    const loadingText = document.getElementById('loading_text');

    // Fade uit
    loadingScreen.style.opacity = 0; // Maak de laadachtergrond transparant
    loadingText.style.opacity = 0; // Maak de tekst transparant

    // Wacht tot de fade-out is voltooid en verberg dan het laadscherm
    setTimeout(() => {
        loadingScreen.style.display = 'none !imoportant';
        loadingScreen.style.zIndex = -1; // Zet z-index op 0 als het laadscherm verborgen is
        loadingText.innerHTML = '';
    }, 500); // Wacht 0,5 seconden voor de fade-out (pas dit aan naar je voorkeur)
}

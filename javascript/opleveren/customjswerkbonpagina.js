window.addEventListener('load', function () {

    // get properties from querystring
    const urlParams = new URLSearchParams(window.location.search);

    const taskId = urlParams.get('taskid');
    const opdRef = urlParams.get('opdref');
    const opdrachtgever = urlParams.get('opdrachtgever');
    const naamKlant = urlParams.get('naamklant');
    const adres = urlParams.get('adres');

    // Haal een referentie naar het HTML-element op basis van het ID
    var jobInfoContainer = document.getElementById("jobinfo");

    // Create paragraph elements for each propertie
    var opdRefElement = document.createElement("p");
    opdRefElement.textContent = opdRef;
    opdRefElement.style.fontWeight = "bold";

    const opdrachtgeverKlantText = `${opdrachtgever} - ${naamKlant}`;
    var opdrachtGeverKlantElement = document.createElement("p");
    opdrachtGeverKlantElement.textContent = opdrachtgeverKlantText;

    var adresElement = document.createElement("p");
    adresElement.textContent = adres;

    // Append the elements to the container
    jobInfoContainer.appendChild(opdRefElement);
    jobInfoContainer.appendChild(opdrachtGeverKlantElement);
    jobInfoContainer.appendChild(adresElement);
    
});
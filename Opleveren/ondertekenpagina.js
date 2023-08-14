window.addEventListener('load', function () {

    currentUrl = window.location.search;
    console.log(currentUrl);
    const dlForm = currentUrl.split('dlform=')[1];
    console.log(dlForm);

    const dlFormfield = document.getElementsByName('dlform')[0];

    dlFormfield.value = dlForm;
})
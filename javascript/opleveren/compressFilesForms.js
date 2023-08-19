// Wacht tot de DOM volledig is geladen
document.addEventListener("DOMContentLoaded", function () {
    setupFileInput();
});

function setupFileInput() {
    const fileInputs = document.querySelectorAll("input[type='file']");

    fileInputs.forEach(fileInput => {
        fileInput.addEventListener("change", function (event) {
            console.log("Bestand geselecteerd");

            const files = event.target.files;

            if (!files || files.length === 0) {
                console.log("Geen bestanden geselecteerd");
                return;
            }

            for (let i = 0; i < files.length; i++) {
                const originalSize = formatSize(files[i].size);
                console.log(`Bestand ${i + 1} (${files[i].name}) - Oorspronkelijke grootte: ${originalSize}`);

                compressFile(files[i], function (compressedFile) {
                    const compressedSize = formatSize(compressedFile.size);
                    console.log(`Bestand ${i + 1} (${files[i].name}) - Gecomprimeerde grootte: ${compressedSize}`);
                    addCompressedFileToInput(fileInput, compressedFile);
                });
            }
        });
    });
}

function compressFile(file, callback) {
    const reader = new FileReader();

    reader.onload = function (event) {
        const image = new Image();
        image.src = event.target.result;

        image.onload = function () {
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");

            canvas.width = image.width;
            canvas.height = image.height;

            ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

            canvas.toBlob(function (blob) {
                const compressedFile = new File([blob], file.name, { type: "image/jpeg", lastModified: Date.now() });
                callback(compressedFile);
            }, "image/jpeg", 0.7); // Pas de compressiekwaliteit aan indien nodig
        };
    };

    reader.readAsDataURL(file);
}

function formatSize(bytes) {
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    if (bytes === 0) return "0 Byte";
    const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    return Math.round(bytes / Math.pow(1024, i), 2) + " " + sizes[i];
}

function addCompressedFileToInput(inputElement, file) {
    const files = inputElement.files;
    const newFiles = Array.from(files);

    // Verpakt de gecomprimeerde file in een FileList
    const compressedFileList = new DataTransfer();
    newFiles.forEach(existingFile => compressedFileList.items.add(existingFile));
    compressedFileList.items.add(file);

    inputElement.files = compressedFileList.files;

    console.log("Inputveld bijgewerkt met gecomprimeerd bestand:", file.name);
}

setupFileInput(); // Roep deze functie eenmaal aan om de eventlistener in te stellen

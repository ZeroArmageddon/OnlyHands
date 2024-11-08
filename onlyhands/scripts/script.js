document.getElementById('uploadForm').addEventListener('submit', function (event) {
    event.preventDefault(); // Ne töltsön be újra az oldal, amikor az űrlap elküldése történik

    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];

    if (file) {
        // Itt történik a fájl feltöltésének kezelése
        const reader = new FileReader();
        
        reader.onload = function (e) {
            const img = document.createElement('img');
            img.src = e.target.result; // A képfájl base64 kódolt formátumban
            document.getElementById('imageGallery').appendChild(img); // A kép hozzáadása a galériához
        };

        reader.readAsDataURL(file); // A fájl beolvasása base64 kódolt formátumban
    } else {
        alert("Kérlek válassz egy képet!");
    }
});

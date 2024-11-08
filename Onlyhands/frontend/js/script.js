// Function to render gallery
function renderGallery() {
    const gallery = document.getElementById("gallery");
    gallery.innerHTML = "";

    fetch('/api/getImages')  // Backend endpoint to get images
        .then(response => response.json())
        .then(data => {
            data.files.forEach(file => {
                const imageUrl = `https://drive.google.com/uc?export=view&id=${file.id}`;
                const imageContainer = document.createElement("div");
                imageContainer.className = "image-container";
                imageContainer.innerHTML = `
                    <img src="${imageUrl}" alt="Uploaded Image">
                `;
                gallery.appendChild(imageContainer);
            });
        });
}

// Function to upload image
function uploadImage() {
    const fileInput = document.getElementById("imageUpload");
    const file = fileInput.files[0];

    const formData = new FormData();
    formData.append("file", file);

    fetch("/api/upload", {
        method: "POST",
        body: formData,
    })
    .then(response => response.json())
    .then(() => renderGallery());
}

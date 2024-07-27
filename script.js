// Define the correct passcode
const correctPasscode = '1234';

// Array to store uploaded files
let uploadedFiles = [];

// Elements
const addFileButton = document.getElementById('addFileButton');
const fileInput = document.getElementById('file-input');
const fileGrid = document.getElementById('file-grid');

// Function to prompt for passcode
function promptForPasscode() {
    const enteredPasscode = prompt('Enter passcode:');

    if (enteredPasscode === correctPasscode) {
        // Show file input if the passcode is correct
        fileInput.style.display = 'block';
    } else {
        alert('Incorrect passcode. Please try again.');
    }
}

// Event listener for file input change
fileInput.addEventListener('change', function(event) {
    const files = Array.from(event.target.files);

    // Add new files to the array
    uploadedFiles = uploadedFiles.concat(files);

    // Save files to local storage
    saveFilesToLocalStorage();

    // Update the grid display
    updateFileGrid();
});

// Function to update the file grid display
function updateFileGrid() {
    fileGrid.innerHTML = ''; // Clear the grid

    uploadedFiles.forEach((file, index) => {
        const fileReader = new FileReader();

        fileReader.onload = function(e) {
            const gridItem = document.createElement('div');
            gridItem.className = 'grid-item';

            // Check if the file is an image
            if (file.type.startsWith('image/')) {
                const img = document.createElement('img');
                img.src = e.target.result;
                img.style.maxWidth = '100px'; // Resize for display
                img.style.maxHeight = '100px'; // Resize for display
                gridItem.appendChild(img);
            } else {
                gridItem.textContent = file.name;
            }

            // Create a delete button
            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'X';
            deleteButton.className = 'delete-button';
            deleteButton.onclick = () => removeFile(index);
            gridItem.appendChild(deleteButton);

            fileGrid.appendChild(gridItem);
        };

        fileReader.readAsDataURL(file);
    });
}

// Function to remove a file from the array
function removeFile(index) {
    // Remove the file from the array
    uploadedFiles.splice(index, 1);

    // Save files to local storage
    saveFilesToLocalStorage();

    // Update the grid display
    updateFileGrid();
}

// Function to save files to local storage
function saveFilesToLocalStorage() {
    const fileData = uploadedFiles.map(file => ({
        name: file.name,
        type: file.type,
        size: file.size,
        lastModified: file.lastModified
    }));
    localStorage.setItem('uploadedFiles', JSON.stringify(fileData));
}

// Function to load files from local storage
function loadFilesFromLocalStorage() {
    const fileData = JSON.parse(localStorage.getItem('uploadedFiles')) || [];
    uploadedFiles = fileData.map(data => new File([data], data.name, { type: data.type, lastModified: data.lastModified }));
    updateFileGrid();
}

// Event listener for add file button
addFileButton.addEventListener('click', promptForPasscode);

// Load files from local storage on page load
window.addEventListener('load', loadFilesFromLocalStorage);

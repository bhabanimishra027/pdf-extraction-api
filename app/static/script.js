const dropZone = document.getElementById('dropZone');
const fileInput = document.getElementById('pdfFile');
const fileInfo = document.getElementById('fileInfo');
const dropZoneContent = document.querySelector('.drop-zone-content');
const fileNameDisplay = document.getElementById('fileName');
const removeFileBtn = document.getElementById('removeFileBtn');
const extractBtn = document.getElementById('extractBtn');
const btnText = document.querySelector('.btn-text');
const btnLoader = document.getElementById('btnLoader');
const resultsSection = document.getElementById('resultsSection');
const resultFileName = document.getElementById('resultFileName');
const extractedDataContainer = document.getElementById('extractedDataContainer');
const rawJsonContainer = document.getElementById('rawJsonContainer');
const responseBox = document.getElementById('responseBox');
const keywordInput = document.getElementById('keyword');

let currentFile = null;
let rawData = null;

// Drag and Drop Events
['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    dropZone.addEventListener(eventName, preventDefaults, false);
});

function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
}

['dragenter', 'dragover'].forEach(eventName => {
    dropZone.addEventListener(eventName, () => dropZone.classList.add('dragover'), false);
});

['dragleave', 'drop'].forEach(eventName => {
    dropZone.addEventListener(eventName, () => dropZone.classList.remove('dragover'), false);
});

dropZone.addEventListener('drop', handleDrop, false);

function handleDrop(e) {
    const dt = e.dataTransfer;
    const files = dt.files;
    
    if (files.length > 0 && files[0].type === 'application/pdf') {
        handleFile(files[0]);
    } else {
        alert('Please drop a valid PDF file.');
    }
}

fileInput.addEventListener('change', function(e) {
    if (this.files.length > 0) {
        handleFile(this.files[0]);
    }
});

function handleFile(file) {
    currentFile = file;
    dropZoneContent.classList.add('hidden');
    fileInfo.classList.remove('hidden');
    fileNameDisplay.textContent = file.name;
    document.getElementById('fileStatus').textContent = `${(file.size / 1024 / 1024).toFixed(2)} MB • Ready`;
}

removeFileBtn.addEventListener('click', (e) => {
    e.stopPropagation(); // prevent triggering file dialog
    currentFile = null;
    fileInput.value = '';
    fileInfo.classList.add('hidden');
    dropZoneContent.classList.remove('hidden');
    resultsSection.classList.add('hidden');
});

async function extractData() {
    if (!currentFile) {
        alert("Please select a PDF file first.");
        return;
    }

    const keyword = keywordInput.value.trim();
    
    // UI Loading state
    extractBtn.disabled = true;
    btnText.textContent = 'Extracting...';
    btnLoader.classList.remove('hidden');
    resultsSection.classList.add('hidden');
    rawJsonContainer.classList.add('hidden');

    const formData = new FormData();
    formData.append("file", currentFile);
    if (keyword) {
        formData.append("keyword", keyword);
    }

    try {
        const response = await fetch("https://pdf-extraction-api-o2h7.onrender.com/parse-pdf", {
            method: "POST",
            body: formData
        });

        if (!response.ok) {
            throw new Error(`HTTP Error ${response.status}`);
        }

        const data = await response.json();
        rawData = data;
        
        displayResults(data);

    } catch (error) {
        console.error(error);
        alert("Error extracting data: " + error.message);
    } finally {
        extractBtn.disabled = false;
        btnText.textContent = 'Extract Information';
        btnLoader.classList.add('hidden');
    }
}

function displayResults(data) {
    resultFileName.textContent = currentFile.name;
    resultsSection.classList.remove('hidden');
    
    // Populate accordion
    extractedDataContainer.innerHTML = '';
    
    if (data && typeof data === 'object') {
        const keys = Object.keys(data);
        
        if (keys.length === 0) {
            extractedDataContainer.innerHTML = '<p style="padding:1rem; color:var(--text-secondary)">No specific data fields found.</p>';
        } else {
            keys.forEach((key, index) => {
                const val = data[key];
                const displayVal = typeof val === 'object' ? JSON.stringify(val, null, 2) : val;
                
                const item = document.createElement('div');
                item.className = 'accordion-item';
                
                if (index === 0) item.classList.add('active');
                
                item.innerHTML = `
                    <div class="accordion-header" onclick="toggleAccordion(this)">
                        <span class="chevron">▶</span>
                        <span>${key}</span>
                    </div>
                    <div class="accordion-content">
                        ${typeof val === 'object' ? `<pre style="background:transparent; padding:0; color:inherit; font-family: inherit;">${displayVal}</pre>` : `<p>${displayVal}</p>`}
                    </div>
                `;
                
                extractedDataContainer.appendChild(item);
            });
        }
    } else {
        extractedDataContainer.innerHTML = '<p style="padding:1rem; color:var(--text-secondary)">Could not parse structured information.</p>';
    }

    // Populate raw JSON
    responseBox.textContent = JSON.stringify(data, null, 4);
}

function toggleAccordion(headerElement) {
    const item = headerElement.parentElement;
    item.classList.toggle('active');
}

function toggleRawJson() {
    rawJsonContainer.classList.toggle('hidden');
}

function copyJson() {
    if (rawData) {
        navigator.clipboard.writeText(JSON.stringify(rawData, null, 4));
        const btn = document.querySelector('.copy-btn');
        btn.textContent = 'Copied!';
        setTimeout(() => {
            btn.textContent = 'Copy';
        }, 2000);
    }
}
async function extractData() {

    const fileInput =
        document.getElementById("pdfFile");

    const keyword =
        document.getElementById("keyword").value;

    const responseBox =
        document.getElementById("responseBox");

    if (fileInput.files.length === 0) {

        alert("Please select a PDF file");

        return;
    }

    const formData = new FormData();

    formData.append(
        "file",
        fileInput.files[0]
    );

    formData.append(
        "keyword",
        keyword
    );

    responseBox.textContent =
        "Processing PDF...";

    try {

        const response =
            await fetch(
                "https://pdf-extraction-api-o2h7.onrender.com/parse-pdf",
                {
                    method: "POST",
                    body: formData
                }
            );

        if (!response.ok) {

            throw new Error(
                `HTTP Error ${response.status}`
            );
        }

        const data =
            await response.json();

        responseBox.textContent =
            JSON.stringify(
                data,
                null,
                4
            );

    }

    catch (error) {

        console.error(error);

        responseBox.textContent =
            "Error: " + error.message;
    }
}

function copyJson() {

    const content =
        document.getElementById(
            "responseBox"
        ).textContent;

    navigator.clipboard.writeText(
        content
    );

    alert("JSON copied successfully");
}

function downloadJson() {
    const content = document.getElementById("responseBox").textContent;
    
    // Check if the content is the default placeholder or an error
    if (content.trim() === "Upload a PDF and click Extract Information" || content.includes("Processing PDF...") || content.startsWith("Error:")) {
        alert("No valid JSON data to download.");
        return;
    }

    try {
        const blob = new Blob([content], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement("a");
        a.href = url;
        a.download = "extracted_data.json";
        
        document.body.appendChild(a);
        a.click();
        
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    } catch (error) {
        console.error("Error creating download:", error);
        alert("Failed to download JSON.");
    }
}
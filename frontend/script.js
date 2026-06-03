async function extractData(){

    const fileInput =
        document.getElementById("pdfFile");

    const keyword =
        document.getElementById("keyword").value;

    if(fileInput.files.length === 0){

        alert("Please select a PDF");

        return;
    }

    const formData =
        new FormData();

    formData.append(
        "file",
        fileInput.files[0]
    );

    formData.append(
        "keyword",
        keyword
    );

    const responseBox =
        document.getElementById("responseBox");

    responseBox.textContent =
        "Processing...";

    try{

        const response =
            await fetch(
                "https://pdf-extraction-api-o2h7.onrender.com/parse-pdf",
                {
                    method:"POST",
                    body:formData
                }
            );

        const data =
            await response.json();

        responseBox.textContent =
            JSON.stringify(
                data,
                null,
                4
            );
    }

    catch(error){

        responseBox.textContent =
            "Error: " + error.message;
    }
}

function copyJson(){

    navigator.clipboard.writeText(
        document.getElementById(
            "responseBox"
        ).textContent
    );

    alert("JSON copied");
}
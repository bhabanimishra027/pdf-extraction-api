async function extractData(){

    const fileInput =
        document.getElementById("pdfFile");

    const keyword =
        document.getElementById("keyword").value;

    if(fileInput.files.length === 0){

        alert("Please select a PDF");

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

    try{

        const response =
            await fetch(
                "/parse-pdf",
                {
                    method:"POST",
                    body:formData
                }
            );

        const data =
            await response.json();

        showDocumentInfo(data);

        showAccordion(
            data.extracted_data
        );

        document
            .getElementById("responseBox")
            .textContent =
            JSON.stringify(
                data,
                null,
                4
            );

    }

    catch(error){

        alert(error.message);
    }
}

function showDocumentInfo(data){

    document
        .getElementById("documentInfo")
        .innerHTML = `

        <div class="doc-card">

            <div>
                <h3>📄 ${data.filename}</h3>
            </div>

            <div>
                <strong>Type:</strong>
                ${data.document_type}
            </div>

            <div>
                <strong>Status:</strong>
                ${data.status}
            </div>

        </div>
    `;
}

function showAccordion(extractedData){

    const container =
        document.getElementById(
            "accordionContainer"
        );

    container.innerHTML = "";

    for(const key in extractedData){

        const button =
            document.createElement(
                "button"
            );

        button.className =
            "accordion";

        button.textContent =
            key;

        const panel =
            document.createElement(
                "div"
            );

        panel.className =
            "panel";

        panel.innerHTML =
            `<p>${extractedData[key]}</p>`;

        button.onclick =
            function(){

                if(
                    panel.style.display
                    ===
                    "block"
                ){

                    panel.style.display =
                    "none";
                }

                else{

                    panel.style.display =
                    "block";
                }
            };

        container.appendChild(
            button
        );

        container.appendChild(
            panel
        );
    }
}

function toggleJson(){

    const jsonBox =
        document.getElementById(
            "responseBox"
        );

    if(
        jsonBox.style.display
        ===
        "block"
    ){

        jsonBox.style.display =
        "none";
    }

    else{

        jsonBox.style.display =
        "block";
    }
}
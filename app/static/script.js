async function extractData(){

    const file =
        document.getElementById("pdfFile");

    const keyword =
        document.getElementById("keyword").value;

    if(file.files.length === 0){

        alert("Please upload a PDF");

        return;
    }

    const formData =
        new FormData();

    formData.append(
        "file",
        file.files[0]
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
            .getElementById(
                "responseBox"
            )
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
        .getElementById(
            "documentInfo"
        ).innerHTML = `

        <div class="doc-card">

            <div>
                <h3>📄 ${data.filename}</h3>
            </div>

            <div class="badge">
                ${data.document_type}
            </div>

            <div class="badge">
                ${data.status}
            </div>

        </div>
    `;
}

function showAccordion(data){

    const container =
        document.getElementById(
            "accordionContainer"
        );

    container.innerHTML = "";

    for(const key in data){

        const button =
            document.createElement(
                "button"
            );

        button.className =
            "accordion";

        button.innerHTML =
            `▶ ${key}`;

        const panel =
            document.createElement(
                "div"
            );

        panel.className =
            "panel";

        panel.innerHTML =
            `<p>${data[key]}</p>`;

        button.onclick =
            () => {

                panel.style.display =
                panel.style.display ===
                "block"
                ?
                "none"
                :
                "block";
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

    const box =
        document.getElementById(
            "responseBox"
        );

    box.style.display =
        box.style.display ===
        "block"
        ?
        "none"
        :
        "block";
}
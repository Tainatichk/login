document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("login-form");
    const libraryContainer = document.getElementById("library-container");
    const loginContainer = document.getElementById("login-container");
    const loginError = document.getElementById("login-error");

    const pdfContainer = document.getElementById("pdf-container");
    const pdfRender = document.getElementById("pdf-render");
    const closePdfButton = document.getElementById("close-pdf");
    const prevPageButton = document.getElementById("prev-page");
    const nextPageButton = document.getElementById("next-page");
    const pageInfo = document.getElementById("page-info");

    const validUsername = "admin";
    const validPassword = "Jack";

    const storedPdfLink = document.getElementById("curso.html");
    const storedPdfUrl = "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf";

    let pdfDoc = null;
    let pageNum = 1;
    let pageIsRendering = false;
    let pageNumIsPending = null;

    loginForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const username = document.getElementById("username").value;
        const password = document.getElementById("Jack").value;

        if (username === validUsername && password === validPassword) {
            loginContainer.style.display = "none";
            libraryContainer.style.display = "block";
        } else {
            loginError.textContent = "Usuário ou senha incorretos.";
        }
    });

    storedPdfLink.addEventListener("click", (event) => {
        event.preventDefault();
        openPDF(storedPdfUrl);
    });

    function openPDF(url) {
        const loadingTask = pdfjsLib.getDocument(url);
        loadingTask.promise.then(pdfDoc_ => {
            pdfDoc = pdfDoc_;
            pdfContainer.style.display = "block";
            pageNum = 1;
            renderPage(pageNum);
        });
    }

    function renderPage(num) {
        pageIsRendering = true;

        pdfDoc.getPage(num).then(page => {
            const viewport = page.getViewport({ scale: 1.5 });
            pdfRender.height = viewport.height;
            pdfRender.width = viewport.width;

            const renderContext = {
                canvasContext: pdfRender.getContext("2d"),
                viewport: viewport
            };

            const renderTask = page.render(renderContext);

            renderTask.promise.then(() => {
                pageIsRendering = false;

                if (pageNumIsPending !== null) {
                    renderPage(pageNumIsPending);
                    pageNumIsPending = null;
                }
            });

            pageInfo.textContent = `Página ${num} de ${pdfDoc.numPages}`;
        });
    }

    function queueRenderPage(num) {
        if (pageIsRendering) {
            pageNumIsPending = num;
        } else {
            renderPage(num);
        }
    }

    function showPrevPage() {
        if (pageNum <= 1) {
            return;
        }
        pageNum--;
        queueRenderPage(pageNum);
    }

    function showNextPage() {
        if (pageNum >= pdfDoc.numPages) {
            return;
        }
        pageNum++;
        queueRenderPage(pageNum);
    }

    prevPageButton.addEventListener("click", showPrevPage);
    nextPageButton.addEventListener("click", showNextPage);

    closePdfButton.addEventListener("click", () => {
        pdfContainer.style.display = "none";
        pdfRender.getContext("2d").clearRect(0, 0, pdfRender.width, pdfRender.height);
    });
});


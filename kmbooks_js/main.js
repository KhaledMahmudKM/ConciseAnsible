
let bookMeta = {};
async function loadBookMeta() {

    const response = await fetch("book.json");
    bookMeta = await response.json();

    // Set page title
    document.title = bookMeta.title;

    // Header title
    document.getElementById("book-title").textContent =
        bookMeta.title;

    // Footer
    document.getElementById("book-copyright").textContent =
        bookMeta.copyright;
}

// Function to fetch and render markdown
function loadMarkdown(path) {
  fetch(path)
    .then((response) => {
      if (!response.ok) throw new Error(response.statusText);
      return response.text();
    })
    .then((markdown) => {
      const html = marked.parse(markdown);
      document.getElementById("content").innerHTML = html;
      hljs.highlightAll(); // Highlight code blocks
    })
    .catch((err) => {
      document.getElementById("content").innerHTML = `<p>Error loading file: ${err}</p>`;
      console.error(err);
    });
}
//Load Table of Contents
async function generateTOC() {

  const response = await fetch("chapters/chapters.json");
  const files = await response.json();
  const toc = document.getElementById("toc");

  const homeLi = document.createElement("li");
  const homeA = document.createElement("a");
  homeA.href = "#";
  homeA.textContent = "Home";
  homeA.onclick = function () {
    loadMarkdown("chapters/home.md");
    return false;
  };

homeLi.appendChild(homeA);

toc.appendChild(homeLi);    

    for (let i = 0; i < files.length; i++) {

        const file = files[i];

        // Load markdown file
        const mdResponse = await fetch(`chapters/${file}`);

        const markdown = await mdResponse.text();

        // Extract first heading
        const match = markdown.match(/^#\s+(.*)/m);

        let title;

        if (match) {
            title = match[1];
        } else {
            title = file.replace(".md", "");
        }

        // Create list item
        const li = document.createElement("li");

        const a = document.createElement("a");

        a.href = "#";

        a.textContent = title;

        a.onclick = function () {
            loadMarkdown(`chapters/${file}`);
            return false;
        };

        li.appendChild(a);

        toc.appendChild(li);
    }
}

//<!-- Initialize Highlight.js -->
// Configure marked to use highlight.js
marked.setOptions({
  highlight: function(code, lang) {
    if (lang && hljs.getLanguage(lang)) {
      return hljs.highlight(code, { language: lang }).value;
    } else {
      return hljs.highlightAuto(code).value;
    }
  }
});
//<!-- Load MathJax -->
window.MathJax = {
  tex: {
    inlineMath: [['$', '$'], ['\\(', '\\)']],
    displayMath: [['$$', '$$'], ['\\[', '\\]']]
  },
  svg: {
    fontCache: 'global'
  }
};

async function initializeBook() {

    await loadBookMeta();

    await generateTOC();

    loadMarkdown("chapters/home.md");
}

initializeBook();




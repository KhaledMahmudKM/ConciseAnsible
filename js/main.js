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



const baseURL = "http://localhost:3000/posts";

document.addEventListener("DOMContentLoaded", main);

function main() {
  displayPosts();
  addNewPostListener();
}

function displayPosts() {
  fetch(baseURL)
    .then(res => res.json())
    .then(posts => {
      const postList = document.getElementById("post-list");
      postList.innerHTML = "";
      posts.forEach(post => {
        const postEl = document.createElement("div");
        postEl.textContent = post.title;
        postEl.classList.add("post-title");
        postEl.dataset.id = post.id;
        postEl.addEventListener("click", () => handlePostClick(post.id));
        postList.appendChild(postEl);
      });
      // Advanced: auto display first post
      if (posts.length) handlePostClick(posts[0].id);
    });
}

function handlePostClick(id) {
  fetch(`${baseURL}/${id}`)
    .then(res => res.json())
    .then(post => {
      const postDetail = document.getElementById("post-detail");
      postDetail.innerHTML = `
        <h2>${post.title}</h2>
        <p>${post.content}</p>
        <p><strong>Author:</strong> ${post.author}</p>
        <button id="edit-button">Edit</button>
        <button id="delete-button">Delete</button>
      `;

      document.getElementById("edit-button").addEventListener("click", () => showEditForm(post));
      document.getElementById("delete-button").addEventListener("click", () => deletePost(post.id));
    });
}

function addNewPostListener() {
  document.getElementById("new-post-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const title = document.getElementById("new-title").value;
    const content = document.getElementById("new-content").value;
    const author = document.getElementById("new-author").value;

    const newPost = { title, content, author };

    fetch(baseURL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newPost)
    })
      .then(res => res.json())
      .then(() => {
        displayPosts();
        e.target.reset();
      });
  });
}

// Advanced
function showEditForm(post) {
  const form = document.getElementById("edit-post-form");
  form.classList.remove("hidden");
  document.getElementById("edit-title").value = post.title;
  document.getElementById("edit-content").value = post.content;

  form.onsubmit = (e) => {
    e.preventDefault();
    const updatedPost = {
      title: document.getElementById("edit-title").value,
      content: document.getElementById("edit-content").value
    };
    fetch(`${baseURL}/${post.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedPost)
    })
      .then(res => res.json())
      .then(() => {
        form.classList.add("hidden");
        displayPosts();
        handlePostClick(post.id);
      });
  };

  document.getElementById("cancel-edit").onclick = () => form.classList.add("hidden");
}

function deletePost(id) {
  fetch(`${baseURL}/${id}`, {
    method: "DELETE"
  }).then(() => {
    displayPosts();
    document.getElementById("post-detail").innerHTML = "<p>Select a post to view details.</p>";
  });
}
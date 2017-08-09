// TODO: Find a module bundle and serving system. Webpack is a good choice.
// TODO: This is client-side code that using ES6 syntax. We need a polyfill
// system to support all browsers (maybe webpack + babel).
// TODO: There is no input validation.

function showRater() {
  fetch('/showRater').then(function(response) {
    return response.text();
  }).then(function(content) {
    // TODO: Using a client-side rendering system instead.
    // Using innerHTML has a big security risk such as XSS.
    document.getElementById('rater').innerHTML = content;
    // Add binding for buttons. This is stupid since we should not do it
    // everytime we render the page. Consider using a framework such as ReactJS
    // to do a modern way of rendering.
    document.getElementById('add-rater').addEventListener('click', addRater);
    for (let button of document.getElementsByClassName('delete-rater')) {
      button.addEventListener('click', deleteRater);
    }
  });
}

function addRater() {
  const formData = new FormData();
  // TODO: We should not assign ID manually.
  formData.append('rater_id',
    document.getElementById('rater-id-input').value.trim());
  formData.append('rater_account',
    document.getElementById('rater-account-input').value.trim());
  formData.append('rater_nickname',
    document.getElementById('rater-nickname-input').value.trim());
  fetch('/addRater', {
    method: 'POST',
    body: formData,
  }).then((response) => {
    if (response.ok) {
      showRater();
    }
  });
}

function deleteRater(e) {
  const raterRow = e.target.closest('tr');
  const formData = new FormData();
  // ID is enough for deletion since id is primary key
  formData.append('rater_id', raterRow.childNodes[0].innerText);
  fetch('/deleteRater', {
    method: 'POST',
    body: formData,
  }).then((response) => {
    if (response.ok) {
      showRater();
    }
  });
}

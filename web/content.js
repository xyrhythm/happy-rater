function showRater() {
  const xhr = new XMLHttpRequest();
  // TODO(fenghaolw): Use url param to pass table name? security concern?
  xhr.open('GET', '/showRater');

  xhr.onreadystatechange = function() {
    if (xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200) {
      document.getElementById('rater').innerText = xhr.responseText;
    }
  };
  xhr.send();
}

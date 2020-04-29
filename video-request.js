const $formVidReq = document.getElementById("form");
const $listOfRequests = document.getElementById("listOfRequests");

const listRequestedVideo = (vidInfo) => {
  const videoListTemplate = `
    <div class="card mb-3">
      <div class="card-body d-flex justify-content-between flex-row">
        <div class="d-flex flex-column">
          <h3>${vidInfo.topic_title}</h3>
          <p class="text-muted mb-2">${vidInfo.topic_details}</p>
          <p class="mb-0 text-muted">
            <strong>Expected results:</strong>${vidInfo.expected_result}</p>
        </div>
        <div class="d-flex flex-column text-center">
          <a class="btn btn-link">🔺</a>
          <h3>0</h3>
          <a class="btn btn-link">🔻</a>
        </div>
      </div>
      <div class="card-footer d-flex flex-row justify-content-between">
        <div>
          <span class="text-info">${vidInfo.status.toUpperCase()}</span>
          &bullet; added by <strong>${vidInfo.author_name}</strong> on
          <strong>${new Date(vidInfo.update_date).toLocaleDateString()}</strong>
        </div>
        <div
          class="d-flex justify-content-center flex-column 408ml-auto mr-2"
        >
          <div class="badge badge-success">
            ${vidInfo.target_level}
          </div>
        </div>
      </div>
    </div>
  `;
  const vidListContainer = document.createElement("div");
  vidListContainer.innerHTML = videoListTemplate;
  const videoItem = $listOfRequests.append(vidListContainer);
  return videoItem;
};

function renderVideoList() {
  fetch("http://localhost:7777/video-request", {
    method: "GET",
  })
    .then((data) => data.json())
    .then(({data}) => {
      console.log("Load...", data);
      data.forEach((video) => {
        listRequestedVideo(video);
      });
    })
    .catch((err) => {
      console.log(err);
    });
}

document.addEventListener("DOMContentLoaded", function () {
  $formVidReq.addEventListener("submit", (e) => {
    e.preventDefault();
    const formData = new FormData($formVidReq);
    // const author_name = document.getElementById("author_name").value;
    // const author_email = document.getElementById("author_email").value;
    // const topic_title = document.getElementById("topic_title").value;
    // const mylist = document.getElementById("target_level");
    // const listValue = mylist.options[mylist.selectedIndex].text;
    // const data = {
    //   author_name,
    //   author_email,
    //   topic_title,
    //   listValue,
    // };
    fetch("http://localhost:7777/video-request", {
      method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      body: formData,
    })
      .then((data) => {
        console.log(formData);
        return data.json();
      })
      .then((results) => {
        console.log(results);
        location.reload();
      })
      .catch((err) => console.log(err));
  });

  renderVideoList();
});

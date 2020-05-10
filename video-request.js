const $formVidReq = document.getElementById("form");
const $listOfRequests = document.getElementById("listOfRequests");
let sortBy = "newFirst";
let searchValue = "";

const listRequestedVideo = (vidInfo) => {
  const videoListTemplate = `
    <div class="card mb-3">
      <div class="card-body d-flex justify-content-between flex-row">
        <div class="d-flex flex-column">
          <h3>${vidInfo.topic_title}</h3>
          <p class="text-muted mb-2">${vidInfo.topic_details}</p>
          <p class="mb-0 text-muted">
            ${
              vidInfo.expected_result &&
              `<strong>Expected results: </strong>${vidInfo.expected_result}</p>`
            }
        </div>
        <div class="d-flex flex-column text-center">
          <a class="btn btn-link" id="up-vote_${vidInfo._id}">🔺</a>
          <h3 id="vote-value_${vidInfo._id}">${
    vidInfo.votes.ups - vidInfo.votes.downs
  }</h3>
          <a class="btn btn-link" id="down-vote_${vidInfo._id}">🔻</a>
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
  const videoItem = $listOfRequests.appendChild(vidListContainer);
  return videoItem;
};

function renderVideoList(sortBy = "newFirst", searchTerm = "") {
  fetch(
    `http://localhost:7777/video-request?sortBy=${sortBy}&searchTerm=${searchTerm}`,
    {
      method: "GET",
    }
  )
    .then((data) => data.json())
    .then(({ data }) => {
      // console.log("Load...", data);
      $listOfRequests.innerHTML = "";
      data.forEach((video) => {
        listRequestedVideo(video);
        const $upVote = document.getElementById(`up-vote_${video._id}`);
        const $downVote = document.getElementById(`down-vote_${video._id}`);
        const $voteValue = document.getElementById(`vote-value_${video._id}`);

        $upVote.addEventListener("click", (e) => {
          e.preventDefault();
          fetch("http://localhost:7777/video-request/vote", {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              id: video._id,
              vote_type: "ups",
            }),
          })
            .then((data) => data.json())
            .then(({ votes }) => {
              $voteValue.innerText = votes.ups - votes.downs;
            });
        });

        $downVote.addEventListener("click", (e) => {
          e.preventDefault();
          fetch("http://localhost:7777/video-request/vote", {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              id: video._id,
              vote_type: "downs",
            }),
          })
            .then((data) => data.json())
            .then(({ votes }) => {
              $voteValue.innerText = votes.ups - votes.downs;
            });
        });
      });
    })
    .catch((err) => {
      console.log(err);
    });
}

function debounce(fn, time) {
  let timeout;

  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn.apply(this, args), time);
  };
}

document.addEventListener("DOMContentLoaded", function () {
  const $sortBy = document.querySelectorAll("[id*=sort_by_]");
  const $searchVideo = document.getElementById("search_video");

  $sortBy.forEach((el) => {
    el.addEventListener("click", function (e) {
      e.preventDefault();
      sortBy = this.querySelector("input").value;
      renderVideoList(sortBy, searchValue);
      this.classList.add("active");
      if (sortBy === "topVotedFirst") {
        document.getElementById("sort_by_first").classList.remove("active");
      } else {
        document.getElementById("sort_by_top_voted").classList.remove("active");
        // this.classList.add("active");
      }
    });
  });

  $searchVideo.addEventListener(
    "input",
    debounce(function (e) {
      searchValue = e.target.value;
      // console.log(searchValue);
      renderVideoList(sortBy, searchValue);
    }, 500)
  );

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

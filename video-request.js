const $formVidReq = document.getElementById("form");
const $listOfRequests = document.getElementById("listOfRequests");
// const $loginForm = document.getElementById("login_form");

const state = {
  sortBy: "newFirst",
  searchValue: "",
  userId: "",
};

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
    vidInfo.votes.ups.length - vidInfo.votes.downs.length
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
              user_id: state.userId
            }),
          })
            .then((data) => data.json())
            .then(({ votes }) => {
              $voteValue.innerText = votes.ups.length - votes.downs.length;
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
              user_id: state.userId
            }),
          })
            .then((data) => data.json())
            .then(({ votes }) => {
              $voteValue.innerText = votes.ups.length - votes.downs.length;
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

const checkValidity = (formData) => {
  // const name = formData.get("author_name");
  // const email = formData.get("author_email");
  const title = formData.get("topic_title");
  const details = formData.get("topic_details");

  // const emailPattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  // if (!name) {
  //   document.querySelector("[name=author_name]").classList.add("is-invalid");
  // }
  // if (!email || !emailPattern.test(email)) {
  //   document.querySelector("[name=author_email]").classList.add("is-invalid");
  // }
  if (!title || title.length > 30) {
    document.querySelector("[name=topic_title]").classList.add("is-invalid");
  }
  if (!details) {
    document.querySelector("[name=topic_details]").classList.add("is-invalid");
  }

  const invalidAllElm = document
    .getElementById("form")
    .querySelectorAll(".is-invalid");

  if (invalidAllElm.length) {
    invalidAllElm.forEach((el) => {
      el.addEventListener("input", function () {
        this.classList.remove("is-invalid");
      });
    });
    return false;
  }
  return true;
};

document.addEventListener("DOMContentLoaded", function () {
  const $sortBy = document.querySelectorAll("[id*=sort_by_]");
  const $searchVideo = document.getElementById("search_video");

  $sortBy.forEach((el) => {
    el.addEventListener("click", function (e) {
      e.preventDefault();
      state.sortBy = this.querySelector("input").value;
      renderVideoList(state.sortBy, state.searchValue);
      this.classList.add("active");
      if (state.sortBy === "topVotedFirst") {
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
      state.searchValue = e.target.value;
      // console.log(searchValue);
      renderVideoList(state.sortBy, state.searchValue);
    }, 500)
  );

  const $loginForm = document.querySelector(".login-form");
  const $appContent = document.querySelector(".app-content");
  if (window.location.search) {
    state.userId = new URLSearchParams(window.location.search).get("id");
    $loginForm.classList.add("d-none");
    $appContent.classList.remove("d-none");
  }

  $formVidReq.addEventListener("submit", (e) => {
    e.preventDefault();
    const formData = new FormData($formVidReq);
    formData.append("author_id", state.userId);
    const isValid = checkValidity(formData);

    if (!isValid) {
      return;
    }

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

  // $loginForm.addEventListener("submit", (e) => {
  //   e.preventDefault();

  //   const formData = new FormData($loginForm);

  //   fetch("http://localhost:7777/users/login", {
  //     method: "POST",
  //     body: formData,
  //   })
  //     .then((data) => {
  //       console.log(formData);
  //       return data.json();
  //     })
  //     .then((result) => {
  //       console.log(result);
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });
  // });

  renderVideoList();
});

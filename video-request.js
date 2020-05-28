const $formVidReq = document.getElementById("form");
const $listOfRequests = document.getElementById("listOfRequests");
const SUPER_USER_ID = "Aa8C052FBb00E9ee";
// const $loginForm = document.getElementById("login_form");

const state = {
  sortBy: "newFirst",
  searchValue: "",
  userId: "",
  isSuperUser: false,
};

const listRequestedVideo = (vidInfo) => {
  const videoListTemplate = `
    <div class="card mb-3">
    ${
      state.isSuperUser
        ? `<div class="card-header d-flex justify-content-between">
        <select id="admin_change-status_${vidInfo._id}" value="">
          <option value="new">New</option>
          <option value="planned">Planned</option>
          <option value="done">Done</option>
        </select>
        <div class="input-group ml-2 mr-5 ${
          vidInfo.status !== "done" ? "d-none" : ""
        }" id="admin_video_res_container_${vidInfo._id}">
          <input type="text" class="form-control"
            id="admin_video_res_${vidInfo._id}"
            placeholder="Paste here youtube video id"/>
          <div class="input-group-append">
            <button class="btn btn-outline-secondary"
              type="button"
              id="admin_save_video_res_${vidInfo._id}"
            >Save</button>
          </div>
        </div>
        <button class="btn btn-danger"
        id="admin_delete_video_res_${vidInfo._id}"
        >Delete</button>
      </div>`
        : ""
    }
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
          <a class="btn btn-link" id="votes_ups_${vidInfo._id}">🔺</a>
          <h3 id="vote-value_${vidInfo._id}">${
    vidInfo.votes.ups.length - vidInfo.votes.downs.length
  }</h3>
          <a class="btn btn-link" id="votes_downs_${vidInfo._id}">🔻</a>
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

function votesButtonsStyle(video_id, votes_list, votes_type) {
  const $upVote = document.getElementById(`votes_ups_${video_id}`);
  const $downVote = document.getElementById(`votes_downs_${video_id}`);

  if (state.isSuperUser) {
    $upVote.style.opacity = "0.5";
    $upVote.style.cursor = "not-allowed";
    $downVote.style.opacity = "0.5";
    $downVote.style.cursor = "not-allowed";
    return;
  }

  if (!votes_type) {
    if (votes_list.ups.includes(state.userId)) {
      votes_type = "ups";
    } else if (votes_list.downs.includes(state.userId)) {
      votes_type = "downs";
    } else {
      return;
    }
  }

  const voteDirElm = votes_type === "ups" ? $upVote : $downVote;
  const otherElms = votes_type === "ups" ? $downVote : $upVote;

  if (votes_list[votes_type].includes(state.userId)) {
    voteDirElm.style.opacity = "1";
    otherElms.style.opacity = "0.6";
  } else {
    otherElms.style.opacity = "1";
  }
}

function updateVideoRequest(id, status, resVideo = "") {
  fetch("http://localhost:7777/video-request", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id,
      status,
      resVideo,
    }),
  })
    .then((res) => res.json())
    .then((data) => {
      window.location.reload();
      console.log(data);
    })
    .catch((err) => console.log(err));
}

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

        const $adminStatusElm = document.getElementById(
          `admin_change-status_${video._id}`
        );
        const $adminVideoResElm = document.getElementById(
          `admin_video_res_${video._id}`
        );
        const $adminVideoResContainer = document.getElementById(
          `admin_video_res_container_${video._id}`
        );
        const $adminSaveElm = document.getElementById(
          `admin_save_video_res_${video._id}`
        );
        const $adminDeleteElm = document.getElementById(
          `admin_delete_video_res_${video._id}`
        );

        if (state.isSuperUser) {
          $adminStatusElm.value = video.status;
          $adminVideoResElm.value = video.video_ref.link;

          // Update Video Status
          $adminStatusElm.addEventListener("change", (e) => {
            if (e.target.value === "done") {
              $adminVideoResContainer.classList.remove("d-none");
            } else {
              updateVideoRequest(video._id, e.target.value);
            }
          });

          // Delete Video Res
          $adminDeleteElm.addEventListener("click", (e) => {
            // Make Sure Before You want To Delete Items
            const isSure = confirm(
              `Are you sure you are want to delete ${video.topic_title}`
            );

            if (!isSure) return;

            fetch("http://localhost:7777/video-request", {
              method: "DELETE",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                id: video._id,
              }),
            })
              .then((res) => res.json())
              .then((data) => {
                window.location.reload();
                console.log(data);
              })
              .catch((err) => console.log(err));
          });

          // Add Video Res
          $adminSaveElm.addEventListener("click", (e) => {
            e.preventDefault();
            if (!$adminVideoResElm.value) {
              $adminVideoResElm.classList.add("is-invalid");
              $adminVideoResElm.addEventListener("input", (e) => {
                $adminVideoResElm.classList.remove("is-invalid");
              });
              return;
            }

            updateVideoRequest(video._id, "done", $adminVideoResElm.value);
          });
        }

        votesButtonsStyle(video._id, video.votes);

        const $voteValue = document.getElementById(`vote-value_${video._id}`);
        const $voteElms = document.querySelectorAll(
          `[id^=votes_][id$=_${video._id}]`
        );

        $voteElms.forEach((el) => {
          if (state.isSuperUser) return;
          el.addEventListener("click", function (e) {
            const [, votes_type, id] = e.target.getAttribute("id").split("_");
            e.preventDefault();
            fetch("http://localhost:7777/video-request/vote", {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                id,
                votes_type,
                user_id: state.userId,
              }),
            })
              .then((data) => data.json())
              .then(({ votes }) => {
                $voteValue.innerText = votes.ups.length - votes.downs.length;
                votesButtonsStyle(id, votes, votes_type);
              });
          });
        });

        // $upVote.addEventListener("click", (e) => {
        //   e.preventDefault();
        //   fetch("http://localhost:7777/video-request/vote", {
        //     method: "PUT",
        //     headers: {
        //       "Content-Type": "application/json",
        //     },
        //     body: JSON.stringify({
        //       id: video._id,
        //       vote_type: "ups",
        //       user_id: state.userId,
        //     }),
        //   })
        //     .then((data) => data.json())
        //     .then(({ votes }) => {
        //       $voteValue.innerText = votes.ups.length - votes.downs.length;
        //     });
        // });

        // $downVote.addEventListener("click", (e) => {
        //   e.preventDefault();
        //   fetch("http://localhost:7777/video-request/vote", {
        //     method: "PUT",
        //     headers: {
        //       "Content-Type": "application/json",
        //     },
        //     body: JSON.stringify({
        //       id: video._id,
        //       vote_type: "downs",
        //       user_id: state.userId,
        //     }),
        //   })
        //     .then((data) => data.json())
        //     .then(({ votes }) => {
        //       $voteValue.innerText = votes.ups.length - votes.downs.length;
        //     });
        // });
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

    if (state.userId === SUPER_USER_ID) {
      state.isSuperUser = true;
      const $normalUserContent = document.querySelector(".normal-user-content");
      $normalUserContent.classList.add("d-none");
    }

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

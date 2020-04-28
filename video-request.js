document.addEventListener("DOMContentLoaded", function () {
  const formVidReq = document.getElementById("form");

  formVidReq.addEventListener("submit", (e) => {
    e.preventDefault();
    const formData = new FormData(formVidReq);
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
      .then((result) => {
        console.log(result);
      })
      .catch((err) => console.log(err));
  });
});
window.onload = (e) => {
  fetch("http://localhost:7777/video-request", {
    method: "GET",
  })
    .then((data) => data.json())
    .then((result) => {
      console.log("Load...", result);
    })
    .catch((err) => {
      console.log(err);
    });
};

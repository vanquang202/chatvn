(() => {
  const user = { gender: 1, name: "" };
  let isOk = false;
  let uFr;
  let idFr;
  window.users;
  user.uid = generateRandomUID(0, 99999999);
  window.Echo = new Echo({
    broadcaster: "socket.io",
    host: `https://adpixel.jimdev.id.vn`,
    withCredentials: true,
    auth: {
      headers: {
        Authorization: user.uid, // Thay YOUR_ACCESS_TOKEN bằng access token của người dùng đã được xác thực
      },
    },
  });
  let echo = window.Echo.join("chat")
    .here((users) => {
      window.users = users;
      getUserOnline();
    })
    .joining((uj) => {
      window.users.push(uj);
      getUserOnline();
    })
    .leaving((ul) => {
      if (ul.id == idFr) {
        uFr = null;
        idFr = null;
        $(".ws").html("Đối phương đã ngắt kết nối !");
      }
      window.users = window.users.filter((u) => u.id != ul.id);
      getUserOnline();
    });
  $(".ip").on("input", function () {
    user.name = $(this).val();
    if (user.name.trim() == "") {
      $(this).removeClass("border-m border-3");
      $(this).addClass("border-danger border-1");
    } else {
      $(this).removeClass("border-danger border-1");
      $(this).addClass("border-m border-3");
    }
    $(".un").html(user.name);
  });
  $(".cb").on("click", function () {
    $(".cb").removeClass("border-n border-3 text-m");
    $(".cb").addClass("border border-dark text-dark");
    $(this).removeClass("border border-dark text-dark");
    $(this).addClass("border-m border-3 text-m");
    user.gender = $(this).data("gender");
  });

  function getUserOnline() {
    $(".uo").html(window.users.length);
  }
  function generateRandomUID(min, max) {
    const randomNum =
      Math.floor(Math.random() * (max - min + 1)) +
      min +
      Math.floor(Math.random() * (max - min + 700)) +
      min +
      Math.floor(Math.floor(Math.random()) + Math.floor(Math.random()));
    return randomNum.toString();
  }

  $(".btsm").on("click", function () {
    if (user.name.trim() == "") {
      toastr.warning("Bạn chưa nhập tên");
      return;
    }
    $(".btsmc").removeClass("d-none");

    $(".btsm").html(
      `Đang ghép <img style="width: 50px;" src="https://www.phuriengrubber.vn/images/loading2.gif" alt="https://www.phuriengrubber.vn/images/loading2.gif">`
    );
    user.isFind = true;
    user.isProcess = false;
    const audio = document.createElement("video");
    audio.src = "./notification.mp3";
    audio.play();
    userConnect();
  });
  $(".btsmc").on("click", function () {
    $(".btsmc").addClass("d-none");
    $(".btsm").html("Ghép đôi");
    user.isFind = false;
    user.isProcess = false;
  });
  function userConnect() {
    $(".ws").html("");
    function createRoomChat(uID) {
      $(".leave").removeClass("d-none");
      idFr = uID;
      dataChat = [];
      $("#load").addClass("d-none");
      $("#m").removeClass("d-none");
      $("#f").removeClass("d-none");
      $("#fdt").on("input", function () {
        echo.whisper("ws-" + user.uid, { name: user.name });
      });

      let cn2 = echo
        .listenForWhisper("chat-" + uID, (event) => {
          if (event.chat.isEmoji == true) {
            dataChat[event.chat.index].emoji = event.chat.src;
            $(".icacr-" + event.chat.index).attr("src", event.chat.src);
            return;
          } else {
            const audio = document.createElement("video");
            audio.src = "./notification.mp3";
            audio.play();
            dataChat.push(event.chat);
            renderChat(event.chat);
          }
        })
        .listenForWhisper("ws-" + uID, (event) => {
          $(".ws").html(event.name + " đang nhập ...");
          setTimeout(() => {
            $(".ws").html("");
          }, 1000);
        })
        .listenForWhisper("leave-" + uID, (event) => {
          uFr = null;
          idFr = null;
          $(".ws").html("Đối phương đã ngắt kết nối !");
        });
      $(".leave").on("click", function () {
        location.reload();
      });
      function renderChat(chat) {
        let html = "";

        if (chat.id == user.uid) {
          html += `
                            <div class="r d-flex flex-row gap-2 py-2 position-relative">
                                <div  class="c ms-auto flex-fill text-wrap">
                                    <div style="background: rgb(255, 81, 177);" class="cm text-wrap shadow pb-0 p-2 rounded text-white">
                                        ${chat.text}
                                        <p class="text-secondary text-center mb-1">${chat.time}</p>
                                    </div>
                                    
                                    <img class="icacl icacr-${chat.index}" style="max-width: 30px; max-height: 30px" src="${chat.emoji}" alt="${chat.emoji}">
                                    <!-- <div data-id="${chat.index}" class="ic p-2 rounded-pill sahdow bg-white">
                                        <img data-id="${chat.index}" class="emoil" style="width: 40px; height: 40px"
                                            src="https://media.tenor.com/_e4JAx0iHS0AAAAj/facebook-emoji.gif"
                                            alt="https://media.tenor.com/_e4JAx0iHS0AAAAj/facebook-emoji.gif">
                                        <img data-id="${chat.index}" class="emoil" style="width: 40px; height: 40px"
                                            src="https://media1.giphy.com/media/hVlZnRT6QW1DeYj6We/giphy.gif?cid=ecf05e47re4b6mnythfjfac2vas4ng420r9pjwkxqfruxiy7&ep=v1_gifs_related&rid=giphy.gif&ct=e"
                                            alt="https://media1.giphy.com/media/hVlZnRT6QW1DeYj6We/giphy.gif?cid=ecf05e47re4b6mnythfjfac2vas4ng420r9pjwkxqfruxiy7&ep=v1_gifs_related&rid=giphy.gif&ct=e">
                                        <img data-id="${chat.index}" class="emoil" style="width: 40px; height: 40px"
                                            src="https://media1.giphy.com/media/nuoSzPYhqz3qCbSMMq/giphy.gif?cid=6c09b9526mi30nbhbes1zjc87o2g0oj2qve6oaq5ksyhrek4&ep=v1_internal_gif_by_id&rid=giphy.gif&ct=s"
                                            alt="https://media1.giphy.com/media/nuoSzPYhqz3qCbSMMq/giphy.gif?cid=6c09b9526mi30nbhbes1zjc87o2g0oj2qve6oaq5ksyhrek4&ep=v1_internal_gif_by_id&rid=giphy.gif&ct=s">
                                    </div> -->
                                    
                                </div>
                                 
                                 

                            </div>
                            `;
        } else {
          html += `
                             <div class="l d-flex flex-row gap-2 py-2 position-relative">
                                <img style="width : 20px;height : 20px" class="rounded-circle mt-2"
                                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTlzOvBOBqc0SO0l2JE0Nd9wLbYlWehloZ4TA&s"
                                    alt="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTlzOvBOBqc0SO0l2JE0Nd9wLbYlWehloZ4TA&s">
                                <div class="c flex-fill ">
                                  
                                    <b>${chat.name}</b> 
                                    <div style="background: rgb(255, 118, 193);" class="cm shadow pb-0 p-2 rounded text-white">
                                         ${chat.text}
                                         <p class="text-secondary text-center mb-1">${chat.time}</p>
                                    </div>
                                    <img class="icacr icacr-${chat.index}" style="max-width: 30px; max-height: 30px"
                                        src="${chat.emoji}"
                                        alt="${chat.emoji}">
                                    <div data-id="${chat.index}" class="ic p-2   flex-row rounded-pill sahdow bg-white">
                                        <img data-id="${chat.index}" class="emoil"  style="width: 40px; height: 40px"
                                            src="https://media.tenor.com/_e4JAx0iHS0AAAAj/facebook-emoji.gif"
                                            alt="https://media.tenor.com/_e4JAx0iHS0AAAAj/facebook-emoji.gif">
                                        <img data-id="${chat.index}" class="emoil" style="width: 40px; height: 40px"
                                            src="https://media1.giphy.com/media/hVlZnRT6QW1DeYj6We/giphy.gif?cid=ecf05e47re4b6mnythfjfac2vas4ng420r9pjwkxqfruxiy7&ep=v1_gifs_related&rid=giphy.gif&ct=e"
                                            alt="https://media1.giphy.com/media/hVlZnRT6QW1DeYj6We/giphy.gif?cid=ecf05e47re4b6mnythfjfac2vas4ng420r9pjwkxqfruxiy7&ep=v1_gifs_related&rid=giphy.gif&ct=e">
                                        <img data-id="${chat.index}" class="emoil" style="width: 40px; height: 40px"
                                            src="https://media1.giphy.com/media/nuoSzPYhqz3qCbSMMq/giphy.gif?cid=6c09b9526mi30nbhbes1zjc87o2g0oj2qve6oaq5ksyhrek4&ep=v1_internal_gif_by_id&rid=giphy.gif&ct=s"
                                            alt="https://media1.giphy.com/media/nuoSzPYhqz3qCbSMMq/giphy.gif?cid=6c09b9526mi30nbhbes1zjc87o2g0oj2qve6oaq5ksyhrek4&ep=v1_internal_gif_by_id&rid=giphy.gif&ct=s">
                                              <img data-id="${chat.index}" class="emoil" style="width: 40px; height: 40px"
                                            src="https://media.tenor.com/RYibGej0GvcAAAAi/facebook-emoji.gif"
                                            alt="https://media.tenor.com/RYibGej0GvcAAAAi/facebook-emoji.gif">
                                    </div>
                                </div>
                                <svg data-id="${chat.index}" class="reply my-auto" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-reply" viewBox="0 0 16 16">
                                    <path d="M6.598 5.013a.144.144 0 0 1 .202.134V6.3a.5.5 0 0 0 .5.5c.667 0 2.013.005 3.3.822.984.624 1.99 1.76 2.595 3.876-1.02-.983-2.185-1.516-3.205-1.799a8.7 8.7 0 0 0-1.921-.306 7 7 0 0 0-.798.008h-.013l-.005.001h-.001L7.3 9.9l-.05-.498a.5.5 0 0 0-.45.498v1.153c0 .108-.11.176-.202.134L2.614 8.254l-.042-.028a.147.147 0 0 1 0-.252l.042-.028zM7.8 10.386q.103 0 .223.006c.434.02 1.034.086 1.7.271 1.326.368 2.896 1.202 3.94 3.08a.5.5 0 0 0 .933-.305c-.464-3.71-1.886-5.662-3.46-6.66-1.245-.79-2.527-.942-3.336-.971v-.66a1.144 1.144 0 0 0-1.767-.96l-3.994 2.94a1.147 1.147 0 0 0 0 1.946l3.994 2.94a1.144 1.144 0 0 0 1.767-.96z"/>
                                </svg>
                            </div>
                        `;
        }
        $("#m").prepend(html);
      }
      $(document).on("click", ".reply", function () {
        $(".ic").hide();
        let index = $(this).data("id");
      });
      $(document).on("click", ".emoil", function () {
        $(".ic").hide();
        let index = $(this).data("id");
        let src = $(this).attr("src");
        dataChat[index].emoji = src;
        $(".icacr-" + index).attr("src", src);
        echo.whisper("chat-" + user.uid, {
          chat: {
            index: index,
            src: src,
            isEmoji: true,
          },
        });
      });
      $("#bsm").on("click", function () {
        let val = $("#fdt").val().replace(/\n/g, "<br />");
        $("#fdt").val("");
        if (val.trim("") != "") {
          const now = new Date();
          const day = now.getDate();
          const month = now.getMonth() + 1;
          const year = now.getFullYear();
          const hours = now.getHours();
          const minutes = now.getMinutes();
          const seconds = now.getSeconds();
          const time = `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
          dataChat.push({
            id: user.uid,
            name: user.name,
            text: val,
            emoji: "",
            index: dataChat.length - 1,
            time: time,
          });
          renderChat({
            id: user.uid,
            name: user.name,
            text: val,
            emoji: "",
            index: dataChat.length - 1,
            time: time,
          });
          echo.whisper("chat-" + user.uid, {
            chat: {
              id: user.uid,
              name: user.name,
              text: val,
              emoji: "",
              index: dataChat.length - 1,
              time: time,
            },
          });
        }
      });
    }

    echo.listenForWhisper(
      "connect-user-" + user.uid + user.gender,
      async (event) => {
        if (uFr) return;
        if (idFr && idFr != event.userId) {
          idFr = null;
          return;
        }
        console.log(event);
        idFr = event.userId;
        if (user.isFind && !user.isChat) {
          user.isProcess = true;
          if (
            event.isOk == true &&
            isOk == true &&
            user.isFind &&
            user.isProcess
          ) {
            uFr = event;
            createRoomChat(event.userId);
            echo.whisper("connect-user-" + event.userId + event.gender, {
              userId: user.uid,
              gender: user.gender,
              name: user.name,
              isOk: isOk,
            });
            user.isFind = false;
            user.isProcess = false;
          } else {
            isOk = true;
            echo.whisper("connect-user-" + event.userId + event.gender, {
              userId: user.uid,
              gender: user.gender,
              name: user.name,
              isOk: isOk,
            });
          }
        }
      }
    );
    for (let u of window.users) {
      if (u.gender !== user.gender)
        echo.whisper("connect-user-" + u.id + (user.gender == 1 ? 2 : 1), {
          userId: user.uid,
          gender: user.gender,
          name: user.name,
        });
    }
  }
})();

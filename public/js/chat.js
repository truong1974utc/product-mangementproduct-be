
// CLIENT SEND MES
const formSendData = document.querySelector(".chat .inner-form")
if(formSendData) {
    formSendData.addEventListener("submit", (e) => {
        e.preventDefault();
        const content = e.target.elements.content.value;
        
        if(content) {
            socket.emit("CLIENT_SEND_MES", content);
            e.target.elements.content.value = "";
        }
    })
}
//end CLIENT SEND MES

// server return mes
socket.on("SERVER_RETURN_MES", (data) => {
    const myId = document.querySelector("[my-id]").getAttribute("my-id")
    const body = document.querySelector(".chat .inner-body")

    const div = document.createElement("div")

    let htmlFullName = ""

    if(myId == data.userId) {
        div.classList.add("inner-outgoing")
    }else {
        div.classList.add("inner-incoming");
        htmlFullName = `<div class="inner-name">${data.fullName}</div>`
    }

    div.innerHTML = `
        ${htmlFullName}
        <div class="inner-content">${data.content}</div>
    `;

    body.appendChild(div)

    body.scrollTop = body.scrollHeight
})
// end server return mes

// scroll chat to bottom
const bodyChat = document.querySelector(".chat .inner-body")
if(bodyChat) {
    bodyChat.scrollTop = bodyChat.scrollHeight
}
//end scroll chat to bottom

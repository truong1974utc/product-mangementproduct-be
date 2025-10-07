// [GET] /chat/
module.exports.index = async (req, res) => {
    // SocketIo
    _io.on('connection', (socket) => {
    console.log('a user connected');
})
    // SocketIo
    res.render("client/pages/chat/index", {
        pageTitle: "chat"
    })
}
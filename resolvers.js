const user = {
    _id: "1",
    name: "Sushanth",
    email: "sushanth.nukala14@gmail.com",
    picture: "https://cloudinary.com/asdf"
}

module.exports = {
    Query: {
        me: () => user
    }
}
class Annonce{
    constructor(
        title,
        description,
        image,
        userId,
        likes,
        comments,
        followers,
    ) {
        this.title = title
        this.description = description
        this.image = image
        this.userId = userId
        this.likes = [likes]
        this.comments = [comments]
        this.followers = [followers]
            
    }
}
module.exports = { Annonce }
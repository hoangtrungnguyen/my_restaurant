function Blog(title, summary,content) {
    this.id = Date.now().toString()
    this.title = title
    this.summary = summary
    this.content = content //html base
    this.banner_url = ""

}


module.exports = Blog
const Comment = {
  author(parent, args, { db }, info) {
    return db.users.find(user => user.id === parent.author);
  },

  post(parent, args, { db }, info) {
    return db.posts.find(post => parent.post === post.id);
  }
}

export { Comment }

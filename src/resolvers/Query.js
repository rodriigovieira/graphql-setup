const Query = {
  me() {
    return {
      id: '123098',
      name: 'Mike',
      email: 'mike@example.com'
    }
  },

  users(parent, args, { db }, info) {
    if (!args.query) return db.users;

    return db.users.filter(value => value.name.toLowerCase().includes(args.query.toLowerCase()));
  },

  posts(parent, args, { db }, info) {
    if (!args.query) return db.posts;

    return db.posts.filter(post => {
      if (post.body.toLowerCase().includes(args.query.toLowerCase()) ||
        post.title.toLowerCase().includes(args.query.toLowerCase())) {
        return post;
      }
    })
  },

  comments(parent, args, { db }, info) {
    return db.comments;
  },

  post() {
    return {
      id: '092',
      title: 'GraphQL 101',
      body: '',
      published: false
    }
  }
}

export { Query };

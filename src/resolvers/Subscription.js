const Subscription = {
  comment: {
    subscribe(parent, args, { pubsub, db }, info) {
      const post = db.posts.find(post => post.id === args.postId && post.published);

      if (!post) throw new Error(`Post with ID ${args.postId} not found or not published.`);

      return pubsub.asyncIterator(`comment ${args.postId}`);
    }
  },

  post: {
    subscribe(parent, args, { pubsub, db }, info) {
      return pubsub.asyncIterator('post');
    }
  }
}

export { Subscription };

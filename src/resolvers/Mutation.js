import uuidv4 from 'uuid/v4';

const Mutation = {
  // Users CRUD Methods
  createUser(parent, args, { db }, info) {
    const emailTaken = db.users.some(user => args.data.email === user.email);

    if (emailTaken) throw new Error('Email already taken.');

    const user = { id: uuidv4(), ...args.data };

    db.users.push(user);

    return user;
  },

  updateUser(parent, args, { db }, info) {
    const user = db.users.find(user => user.id === args.id);

    if (!user) throw new Error(`User with ID ${args.id} not found.`);

    if (typeof args.data.email === 'string') {
      const emailIsUsed = db.users.some(user => user.email === args.data.email);

      if (emailIsUsed) throw new Error(`Email ${args.data.email} already in use.`);

      user.email = args.data.email;
    }

    if (typeof args.data.name === 'string') user.name = args.data.name;
    if (typeof args.data.age !== 'undefined') user.age = args.data.age;

    return user;
  },

  deleteUser(parent, args, { db }, info) {
    const userIndex = db.users.findIndex(user => args.id === user.id);

    if (userIndex === -1) throw new Error('Id did not match any user.');

    const deletedUserArray = db.users.splice(userIndex, 1);

    // Deleting all posts of this user, and all comments of this post
    db.posts = db.posts.filter(post => {
      const match = post.author === args.id;

      if (match) {
        comments = comments.filter(comment => comment.post !== post.id)
      }

      return !match;
    });

    // Deleting all comments of this user
    db.comments = db.comments.filter(comment => comment.author !== args.id);

    return deletedUserArray[0];
  },

  // Posts CRUD Methods
  createPost(parent, args, { db, pubsub }, info) {
    const userExists = db.users.some(user => user.id === args.data.author);

    if (!userExists) throw new Error('No user found with the provided ID.');

    const post = { id: uuidv4(), ...args.data };

    db.posts.push(post);

    if (post.published) pubsub.publish('post', {
      post: {
        mutation: 'CREATED',
        data: post,
      }
    });

    return post;
  },

  updatePost(parent, args, { db, pubsub}, info) {
    const { data, id } = args;
    const post = db.posts.find(post => post.id === id);
    const originalPost = { ...post };

    if (!post) throw new Error(`Post with ID ${id} not found.`);

    // Updating Post Data
    if (typeof data.title === 'string') post.title = data.title;
    if (typeof data.body === 'string') post.body = data.body;

    if (typeof data.published === 'boolean') {
      post.published = data.published;

      // create
      if (!originalPost.published && post.published) {
        pubsub.publish('post', {
          post: {
            mutation: 'CREATED',
            data: post
          }
        })
      // delete
      } else if (originalPost.published && !post.published) {
        pubsub.publish('post', {
          post: {
            mutation: 'DELETED',
            data: originalPost
          }
        })
      }
      // update
    } else if (post.published) {
      pubsub.publish('post', {
        post: {
          mutation: "UPDATED",
          data: post
        }
      })
    }

    return post;
  },

  deletePost(parent, args, { db, pubsub }, info) {
    const postIndex = db.posts.findIndex(post => post.id === args.id);

    if (postIndex === -1) throw new Error('No post found with the ID provided.');

    const [post] = db.posts.splice(postIndex, 1);

    if (postIndex !== -1) {
      db.comments = db.comments.filter(comment => comment.post !== args.id);
    }

    if (post.published) pubsub.publish('post', {
      post: {
        mutation: 'DELETED',
        data: post
      }
    })

    return post;
  },

  // Comments CRUD Methods
  createComment(parent, args, { db, pubsub }, info) {
    const postExistsAndIsPublished = db.posts.some(post => post.published && post.id == args.data.post);
    const userExists = db.users.some(user => args.data.author === user.id);

    if (!postExistsAndIsPublished) throw new Error('Post not found or not publshed.');
    if (!userExists) throw new Error('No user found with the provied ID.');

    const comment = { id: uuidv4(), ...args.data };

    db.comments.push(comment);

    pubsub.publish(`comment ${args.data.post}`, {
      comment: {
        mutation: 'CREATED',
        data: comment,
      }
    });

    return comment;
  },

  updateComment(parent, { id, data }, { db, pubsub }, info) {
    const comment = db.comments.find(comment => comment.id === id);

    if (!comment) throw new Error(`Comment with ID ${id} not found.`);

    comment.text = data.text;

    pubsub.publish(`comment ${comment.post}`, {
      comment: {
        mutation: 'UPDATED',
        data: comment,
      }
    })

    return comment;
  },

  deleteComment(parent, args, { db, pubsub }, info) {
    const commentIndex = db.comments.findIndex(comment => comment.id === args.id);

    if (commentIndex === -1) throw new Error(`No comment found with the ID of ${args.id}.`);

    const [deletedComment] = db.comments.splice(commentIndex, 1);
    
    pubsub.publish(`comment ${deletedComment.post}`, {
      comment: {
        mutation: 'DELETED',
        data: deletedComment,
      }
    })
    
    return deletedComment;
  }
}

export { Mutation };

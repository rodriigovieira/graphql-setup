const users = [{
  id: '1',
  name: 'Rodrigo',
  email: 'rodriigovieia@example.com',
  age: 35,
},
{
  id: '439040mdsk',
  name: 'Tyler',
  email: 'tyler@example.com',
},
{
  id: '4394i34kfed',
  name: 'Johnson',
  email: 'johnson@example.com',
}]

const posts = [
  {
    id: "1",
    title: 'Post 101',
    body: 'lorem10',
    published: false,
    author: '1',
  },

  {
    id: "2",
    title: 'Post 201',
    body: 'lorem20',
    published: true,
    author: '1',
  },

  {
    id: "3",
    title: 'Post 102',
    body: 'lorem30',
    published: true,
    author: '4394i34kfed',
  }
]

const comments = [
  {
    id: '12ab',
    text: 'Commnet One',
    author: '1',
    post: "1",
  },
  {
    id: '34bc',
    text: 'Comment Two',
    author: '1',
    post: "2",
  },
  {
    id: '58qs',
    text: 'Comment Three',
    author: '439040mdsk',
    post: "3",
  },
  {
    id: '39pq',
    text: 'Comment Four',
    author: '4394i34kfed',
    post: "2",
  }
]

const db = { users, posts, comments };

export default db;
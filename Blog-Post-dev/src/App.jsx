import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useParams } from 'react-router-dom';
import axios from 'axios';


const PostCard = ({ title, content, id }) => (
  <div className="bg-white shadow-md rounded-lg p-6 mb-4 hover:shadow-lg transition-shadow duration-300">
    <h2 className="text-2xl font-bold mb-2 text-gray-800">{title}</h2>
    <p className="text-gray-600 mb-4">{content.substring(0, 100)}...</p>
    <Link to={`/post/${id}`} className="text-blue-500 hover:text-blue-700 font-semibold">Read More</Link>
  </div>
);


const PostList = () => {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setIsLoading(true);
        //api which contain all the posts 
        const response = await axios.get('http://localhost:8080/api/posts');
        if (Array.isArray(response.data)) {
          setPosts(response.data);
        } else {
          setError('Received invalid data from the server');
        }
      } catch (err) {
        setError('Failed to fetch posts. Please try again later.');
        console.error('Error fetching posts:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (isLoading) {
    return <div className="text-center mt-8">Loading posts...</div>;
  }

  if (error) {
    return <div className="text-center mt-8 text-red-500">{error}</div>;
  }

  return (
    <div className="max-w-4xl mx-auto mt-8">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Blog Posts</h1>
      {posts.length > 0 ? (
        <div className="space-y-6">
          {posts.map(post => (
            <PostCard key={post.id} {...post} />
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-600">No posts found.</div>
      )}
    </div>
  );
};


const CreatePost = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post('http://localhost:8080/api/posts', { title, content });
    
  };

  return (
    <div className="max-w-2xl mx-auto mt-8">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Create New Post</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Content"
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 h-40"
        />
        <button type="submit" className="w-full bg-blue-500 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-600 transition-colors duration-300">
          Create Post
        </button>
      </form>
    </div>
  );
};


const SearchPost = () => {
  const [id, setId] = useState('');
  const [post, setPost] = useState(null);

  const handleSearch = async () => {
    //search post by id wala api
    const response = await axios.get('http://localhost:8080/api/posts/${id}');
    setPost(response.data);
  };

  return (
    <div className="max-w-2xl mx-auto mt-8">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Search Post</h1>
      <div className="flex space-x-4 mb-8">
        <input
          type="text"
          value={id}
          onChange={(e) => setId(e.target.value)}
          placeholder="Enter Post ID"
          className="flex-grow px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button onClick={handleSearch} className="bg-blue-500 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-600 transition-colors duration-300">
          Search
        </button>
      </div>
      {post && <PostCard {...post} />}
    </div>
  );
};


const IndividualPost = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      const response = await axios.get(`http://localhost:8080/api/posts/${id}`);
      setPost(response.data);
    };
    fetchPost();
  }, [id]);

  if (!post) return <div>Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto mt-8">
      <h1 className="text-3xl font-bold mb-4 text-gray-800">{post.title}</h1>
      <p className="text-gray-600">{post.content}</p>
    </div>
  );
};


const App = () => {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <nav className="bg-white shadow-md">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex justify-between">
              <div className="flex space-x-4">
                <Link to="/" className="flex items-center py-4 px-2 text-gray-700 hover:text-gray-900">Home</Link>
                <Link to="/create" className="flex items-center py-4 px-2 text-gray-700 hover:text-gray-900">Create Post</Link>
                <Link to="/search" className="flex items-center py-4 px-2 text-gray-700 hover:text-gray-900">Search Post</Link>
              </div>
            </div>
          </div>
        </nav>

        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<PostList />} />
            <Route path="/create" element={<CreatePost />} />
            <Route path="/search" element={<SearchPost />} />
            <Route path="/post/:id" element={<IndividualPost />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import path from 'path';

const app = express();
const PORT = 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-here';

// Warn if using default secret in production
if (process.env.NODE_ENV === 'production' && JWT_SECRET === 'your-secret-key-here') {
  console.warn('WARNING: Using default JWT secret in production environment!');
}

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

// Add /api prefix to all routes
app.use('/api', (req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  console.error('Stack:', err.stack);

  // Handle specific error types
  if (err.name === 'ValidationError') {
    return res.status(400).json({ message: err.message });
  }
  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({ message: 'Invalid token' });
  }
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({ message: 'Invalid token format' });
  }
  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({ message: 'Token expired' });
  }

  // Default error
  res.status(500).json({ 
    message: process.env.NODE_ENV === 'production' 
      ? 'An unexpected error occurred' 
      : err.message || 'Something went wrong!'
  });
});

// In-memory database (for demo purposes)
let users = [];
let posts = [];
let comments = [];
let follows = [];
let stories = [];
let bookmarks = [];
let notifications = [];

// Load data from files if they exist
const loadData = () => {
  try {
    if (fs.existsSync('server/data/users.json')) {
      users = JSON.parse(fs.readFileSync('server/data/users.json', 'utf8'));
    }
    if (fs.existsSync('server/data/posts.json')) {
      posts = JSON.parse(fs.readFileSync('server/data/posts.json', 'utf8'));
    }
    if (fs.existsSync('server/data/comments.json')) {
      comments = JSON.parse(fs.readFileSync('server/data/comments.json', 'utf8'));
    }
    if (fs.existsSync('server/data/follows.json')) {
      follows = JSON.parse(fs.readFileSync('server/data/follows.json', 'utf8'));
    }
    if (fs.existsSync('server/data/stories.json')) {
      stories = JSON.parse(fs.readFileSync('server/data/stories.json', 'utf8'));
      // Clean up expired stories
      stories = stories.filter(story => new Date(story.expiresAt) > new Date());
    }
    if (fs.existsSync('server/data/bookmarks.json')) {
      bookmarks = JSON.parse(fs.readFileSync('server/data/bookmarks.json', 'utf8'));
    }
    if (fs.existsSync('server/data/notifications.json')) {
      notifications = JSON.parse(fs.readFileSync('server/data/notifications.json', 'utf8'));
    }
  } catch (error) {
    console.log('No existing data found, starting fresh');
  }
};

// Save data to files
const saveData = () => {
  if (!fs.existsSync('server/data')) {
    fs.mkdirSync('server/data', { recursive: true });
  }
  fs.writeFileSync('server/data/users.json', JSON.stringify(users, null, 2));
  fs.writeFileSync('server/data/posts.json', JSON.stringify(posts, null, 2));
  fs.writeFileSync('server/data/comments.json', JSON.stringify(comments, null, 2));
  fs.writeFileSync('server/data/follows.json', JSON.stringify(follows, null, 2));
  fs.writeFileSync('server/data/stories.json', JSON.stringify(stories, null, 2));
  fs.writeFileSync('server/data/bookmarks.json', JSON.stringify(bookmarks, null, 2));
  fs.writeFileSync('server/data/notifications.json', JSON.stringify(notifications, null, 2));
};

// Auth middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.sendStatus(401);
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// Initialize data
loadData();

// Add some sample data if empty
if (users.length === 0) {
  const sampleUsers = [
    {
      id: uuidv4(),
      username: 'john_doe',
      email: 'john@example.com',
      password: bcrypt.hashSync('password123', 10),
      fullName: 'John Doe',
      bio: 'Software developer and tech enthusiast',
      avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1',
      createdAt: new Date().toISOString()
    },
    {
      id: uuidv4(),
      username: 'jane_smith',
      email: 'jane@example.com',
      password: bcrypt.hashSync('password123', 10),
      fullName: 'Jane Smith',
      bio: 'Digital artist and creative mind',
      avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1',
      createdAt: new Date().toISOString()
    }
  ];
  
  users = sampleUsers;
  
  // Add sample posts
  posts = [
    {
      id: uuidv4(),
      userId: users[0].id,
      content: 'Just finished working on an amazing new project! The future of web development is looking bright. 🚀',
      image: 'https://images.pexels.com/photos/1181467/pexels-photo-1181467.jpeg?auto=compress&cs=tinysrgb&w=800',
      likes: [users[1].id],
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
    },
    {
      id: uuidv4(),
      userId: users[1].id,
      content: 'Beautiful sunset today! Nature never fails to inspire my art. 🌅',
      image: 'https://images.pexels.com/photos/416978/pexels-photo-416978.jpeg?auto=compress&cs=tinysrgb&w=800',
      likes: [users[0].id],
      createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString()
    }
  ];
  
  saveData();
}

// Routes

// Auth routes
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { username, email, password, fullName } = req.body;
    
    // Check if user exists
    const existingUser = users.find(u => u.email === email || u.username === username);
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create user
    const user = {
      id: uuidv4(),
      username,
      email,
      password: hashedPassword,
      fullName,
      bio: '',
      avatar: `https://images.pexels.com/photos/771742/pexels-photo-771742.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1`,
      createdAt: new Date().toISOString()
    };
    
    users.push(user);
    saveData();
    
    // Generate token
    const token = jwt.sign({ userId: user.id }, JWT_SECRET);
    
    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        fullName: user.fullName,
        bio: user.bio,
        avatar: user.avatar
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user
    const user = users.find(u => u.email === email);
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    // Generate token
    const token = jwt.sign({ userId: user.id }, JWT_SECRET);
    
    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        fullName: user.fullName,
        bio: user.bio,
        avatar: user.avatar
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// User routes
app.get('/api/users/me', authenticateToken, (req, res) => {
  const user = users.find(u => u.id === req.user.userId);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  
  res.json({
    id: user.id,
    username: user.username,
    email: user.email,
    fullName: user.fullName,
    bio: user.bio,
    avatar: user.avatar
  });
});

app.get('/api/users/:id', (req, res) => {
  const user = users.find(u => u.id === req.params.id);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  
  const userPosts = posts.filter(p => p.userId === user.id).length;
  const followers = follows.filter(f => f.followedId === user.id).length;
  const following = follows.filter(f => f.followerId === user.id).length;
  
  res.json({
    id: user.id,
    username: user.username,
    fullName: user.fullName,
    bio: user.bio,
    avatar: user.avatar,
    postsCount: userPosts,
    followersCount: followers,
    followingCount: following
  });
});

app.get('/api/users', (req, res) => {
  const { search } = req.query;
  let filteredUsers = users;
  
  if (search) {
    filteredUsers = users.filter(u => 
      u.username.toLowerCase().includes(search.toLowerCase()) ||
      u.fullName.toLowerCase().includes(search.toLowerCase())
    );
  }
  
  const usersWithStats = filteredUsers.map(user => {
    const followers = follows.filter(f => f.followedId === user.id).length;
    const following = follows.filter(f => f.followerId === user.id).length;
    
    return {
      id: user.id,
      username: user.username,
      fullName: user.fullName,
      bio: user.bio,
      avatar: user.avatar,
      followersCount: followers,
      followingCount: following
    };
  });
  
  res.json(usersWithStats);
});

// Posts routes
app.get('/api/posts', (req, res) => {
  const postsWithUsers = posts
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .map(post => {
      const user = users.find(u => u.id === post.userId);
      const postComments = comments.filter(c => c.postId === post.id);
      
      return {
        ...post,
        user: {
          id: user.id,
          username: user.username,
          fullName: user.fullName,
          avatar: user.avatar
        },
        likesCount: post.likes.length,
        commentsCount: postComments.length
      };
    });
  
  res.json(postsWithUsers);
});

app.get('/api/posts/feed', authenticateToken, (req, res) => {
  const userFollows = follows.filter(f => f.followerId === req.user.userId);
  const followedUserIds = userFollows.map(f => f.followedId);
  followedUserIds.push(req.user.userId); // Include own posts
  
  const feedPosts = posts
    .filter(post => followedUserIds.includes(post.userId))
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .map(post => {
      const user = users.find(u => u.id === post.userId);
      const postComments = comments.filter(c => c.postId === post.id);
      
      return {
        ...post,
        user: {
          id: user.id,
          username: user.username,
          fullName: user.fullName,
          avatar: user.avatar
        },
        likesCount: post.likes.length,
        commentsCount: postComments.length,
        isLiked: post.likes.includes(req.user.userId)
      };
    });
  
  res.json(feedPosts);
});

app.post('/api/posts', authenticateToken, (req, res) => {
  const { content, image, videoUrl, contentType = 'post' } = req.body;
  
  const post = {
    id: uuidv4(),
    userId: req.user.userId,
    content,
    image: image || null,
    videoUrl: videoUrl || null,
    contentType, // 'post', 'reel', or 'story'
    likes: [],
    shares: [],
    hashtags: content.match(/#[a-zA-Z0-9]+/g) || [],
    createdAt: new Date().toISOString()
  };
  
  posts.push(post);
  saveData();
  
  const user = users.find(u => u.id === req.user.userId);
  
  res.json({
    ...post,
    user: {
      id: user.id,
      username: user.username,
      fullName: user.fullName,
      avatar: user.avatar
    },
    likesCount: 0,
    commentsCount: 0,
    isLiked: false
  });
});

app.post('/api/posts/:id/like', authenticateToken, (req, res) => {
  const post = posts.find(p => p.id === req.params.id);
  if (!post) {
    return res.status(404).json({ message: 'Post not found' });
  }
  
  const userId = req.user.userId;
  const likedIndex = post.likes.indexOf(userId);
  
  if (likedIndex > -1) {
    post.likes.splice(likedIndex, 1);
  } else {
    post.likes.push(userId);
  }
  
  saveData();
  
  res.json({
    likesCount: post.likes.length,
    isLiked: post.likes.includes(userId)
  });
});

// Comments routes
app.get('/api/posts/:id/comments', (req, res) => {
  const postComments = comments
    .filter(c => c.postId === req.params.id)
    .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
    .map(comment => {
      const user = users.find(u => u.id === comment.userId);
      return {
        ...comment,
        user: {
          id: user.id,
          username: user.username,
          fullName: user.fullName,
          avatar: user.avatar
        }
      };
    });
  
  res.json(postComments);
});

app.post('/api/posts/:id/comments', authenticateToken, (req, res) => {
  const { content } = req.body;
  
  const comment = {
    id: uuidv4(),
    postId: req.params.id,
    userId: req.user.userId,
    content,
    createdAt: new Date().toISOString()
  };
  
  comments.push(comment);
  saveData();
  
  const user = users.find(u => u.id === req.user.userId);
  
  res.json({
    ...comment,
    user: {
      id: user.id,
      username: user.username,
      fullName: user.fullName,
      avatar: user.avatar
    }
  });
});

// Follow routes
app.post('/api/users/:id/follow', authenticateToken, (req, res) => {
  const followedId = req.params.id;
  const followerId = req.user.userId;
  
  if (followedId === followerId) {
    return res.status(400).json({ message: 'Cannot follow yourself' });
  }
  
  const existingFollow = follows.find(f => f.followerId === followerId && f.followedId === followedId);
  
  if (existingFollow) {
    // Unfollow
    follows.splice(follows.indexOf(existingFollow), 1);
  } else {
    // Follow
    follows.push({
      id: uuidv4(),
      followerId,
      followedId,
      createdAt: new Date().toISOString()
    });
  }
  
  saveData();
  
  const isFollowing = !existingFollow;
  const followersCount = follows.filter(f => f.followedId === followedId).length;
  
  res.json({ isFollowing, followersCount });
});

app.get('/api/users/:id/follow-status', authenticateToken, (req, res) => {
  const followedId = req.params.id;
  const followerId = req.user.userId;
  
  const isFollowing = follows.some(f => f.followerId === followerId && f.followedId === followedId);
  const followersCount = follows.filter(f => f.followedId === followedId).length;
  
  res.json({ isFollowing, followersCount });
});

// Bookmarks routes
app.post('/api/posts/:id/bookmark', authenticateToken, (req, res) => {
  const postId = req.params.id;
  const userId = req.user.userId;
  
  const existingBookmark = bookmarks.find(b => b.postId === postId && b.userId === userId);
  
  if (existingBookmark) {
    bookmarks.splice(bookmarks.indexOf(existingBookmark), 1);
  } else {
    bookmarks.push({
      id: uuidv4(),
      userId,
      postId,
      createdAt: new Date().toISOString()
    });
  }
  
  saveData();
  res.json({ isBookmarked: !existingBookmark });
});

// Stories routes
app.post('/api/stories', authenticateToken, (req, res) => {
  const { content, image, videoUrl } = req.body;
  
  const story = {
    id: uuidv4(),
    userId: req.user.userId,
    content,
    image: image || null,
    videoUrl: videoUrl || null,
    views: [],
    createdAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours expiry
  };
  
  stories.push(story);
  saveData();
  
  const user = users.find(u => u.id === req.user.userId);
  res.json({
    ...story,
    user: {
      id: user.id,
      username: user.username,
      fullName: user.fullName,
      avatar: user.avatar
    }
  });
});

// Notifications routes
app.get('/api/notifications', authenticateToken, (req, res) => {
  const userNotifications = notifications
    .filter(n => n.userId === req.user.userId)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  
  res.json(userNotifications);
});

// Search routes with improved capabilities
app.get('/api/search', authenticateToken, (req, res) => {
  const { query, type = 'all' } = req.query;
  const results = {};
  
  if (type === 'all' || type === 'users') {
    results.users = users.filter(u =>
      u.username.toLowerCase().includes(query.toLowerCase()) ||
      u.fullName.toLowerCase().includes(query.toLowerCase())
    ).map(u => ({
      id: u.id,
      username: u.username,
      fullName: u.fullName,
      avatar: u.avatar
    }));
  }
  
  if (type === 'all' || type === 'posts') {
    results.posts = posts.filter(p =>
      p.content.toLowerCase().includes(query.toLowerCase()) ||
      p.hashtags.some(h => h.toLowerCase().includes(query.toLowerCase()))
    ).map(post => {
      const user = users.find(u => u.id === post.userId);
      return {
        ...post,
        user: {
          id: user.id,
          username: user.username,
          avatar: user.avatar
        }
      };
    });
  }
  
  if (type === 'all' || type === 'hashtags') {
    const allHashtags = posts.reduce((acc, post) => acc.concat(post.hashtags), []);
    results.hashtags = [...new Set(allHashtags)]
      .filter(h => h.toLowerCase().includes(query.toLowerCase()))
      .slice(0, 10);
  }
  
  res.json(results);
});

// Get user suggestions
app.get('/api/users/suggestions', authenticateToken, (req, res) => {
  try {
    const currentUser = users.find(u => u.id === req.user.userId);
    const followingIds = follows
      .filter(f => f.followerId === req.user.userId)
      .map(f => f.followingId);

    const suggestions = users
      .filter(u => u.id !== req.user.userId && !followingIds.includes(u.id))
      .slice(0, 5); // Get top 5 suggestions

    res.json(suggestions);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user profile
app.put('/api/users/:id', authenticateToken, async (req, res) => {
  if (req.user.userId !== req.params.id) {
    return res.status(403).json({ message: 'You can only update your own profile.' });
  }

  try {
    const { fullName, username, bio } = req.body;
    const userIndex = users.findIndex(u => u.id === req.params.id);

    if (userIndex === -1) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if new username is already taken
    if (username !== users[userIndex].username) {
      if (users.some(u => u.username === username)) {
        return res.status(400).json({ message: 'Username is already taken.' });
      }
    }

    users[userIndex] = {
      ...users[userIndex],
      fullName: fullName || users[userIndex].fullName,
      username: username || users[userIndex].username,
      bio: bio || users[userIndex].bio,
    };

    saveData();

    const { password, ...userWithoutPassword } = users[userIndex];
    res.json(userWithoutPassword);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get stories for the user's feed
app.get('/api/stories', authenticateToken, (req, res) => {
  try {
    const followedUsers = follows
      .filter(f => f.followerId === req.user.userId)
      .map(f => f.followingId);

    const feedStories = stories
      .filter(s => followedUsers.includes(s.userId) || s.userId === req.user.userId)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .map(story => {
        const user = users.find(u => u.id === story.userId);
        return {
          ...story,
          user: {
            username: user.username,
            avatar: user.avatar
          }
        };
      });

    res.json(feedStories);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/users/:userId/stories', (req, res) => {
  try {
    const userStories = stories
      .filter(s => s.userId === req.params.userId)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.json(userStories);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update a post
app.put('/api/posts/:id', authenticateToken, (req, res) => {
  try {
    const { content } = req.body;
    const postIndex = posts.findIndex(p => p.id === req.params.id);

    if (postIndex === -1) {
      return res.status(404).json({ message: 'Post not found' });
    }

    if (posts[postIndex].userId !== req.user.userId) {
      return res.status(403).json({ message: 'You can only edit your own posts' });
    }

    posts[postIndex].content = content;
    saveData();
    res.json(posts[postIndex]);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete a post
app.delete('/api/posts/:id', authenticateToken, (req, res) => {
  try {
    const postIndex = posts.findIndex(p => p.id === req.params.id);
    if (postIndex === -1) {
      return res.status(404).json({ message: 'Post not found' });
    }

    if (posts[postIndex].userId !== req.user.userId) {
      return res.status(403).json({ message: 'You can only delete your own posts' });
    }

    // Also delete associated comments
    comments = comments.filter(c => c.postId !== req.params.id);

    posts.splice(postIndex, 1);
    saveData();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user profile
app.get('/api/users/:username', (req, res) => {
  const username = req.params.username.toLowerCase();
  const user = users.find(u => u.username.toLowerCase() === username);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  
  const userPosts = posts.filter(p => p.userId === user.id).length;
  const followers = follows.filter(f => f.followedId === user.id).length;
  const following = follows.filter(f => f.followerId === user.id).length;
  
  res.json({
    id: user.id,
    username: user.username,
    fullName: user.fullName,
    bio: user.bio,
    avatar: user.avatar,
    postsCount: userPosts,
    followersCount: followers,
    followingCount: following
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
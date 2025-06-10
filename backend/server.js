const express = require('express');
const multer = require('multer');
const cors = require('cors');
const session = require('express-session');
const path = require('path');
const fs = require('fs').promises;
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 4080;

// Middleware
app.use(cors({
  origin: ['http://localhost:4000', 'http://frontend:4000'],
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use(session({
  secret: 'photo-contest-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: false,
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Serve uploaded files with proper headers
app.use('/uploads', express.static(path.join(__dirname, 'uploads'), {
  setHeaders: (res, path) => {
    // Set proper content type for images
    if (path.endsWith('.jpg') || path.endsWith('.jpeg')) {
      res.setHeader('Content-Type', 'image/jpeg');
    } else if (path.endsWith('.png')) {
      res.setHeader('Content-Type', 'image/png');
    } else if (path.endsWith('.gif')) {
      res.setHeader('Content-Type', 'image/gif');
    } else if (path.endsWith('.webp')) {
      res.setHeader('Content-Type', 'image/webp');
    }
    
    // Enable CORS for images
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');
  }
}));

// Storage configuration for multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'));
    }
  }
});

// Data file paths
const DATA_DIR = path.join(__dirname, 'data');
const PHOTOS_FILE = path.join(DATA_DIR, 'photos.json');
const VOTES_FILE = path.join(DATA_DIR, 'votes.json');

// Initialize data files
async function initializeData() {
  try {
    await fs.mkdir('uploads', { recursive: true });
    await fs.mkdir(DATA_DIR, { recursive: true });
    
    // Initialize photos.json if it doesn't exist
    try {
      await fs.access(PHOTOS_FILE);
    } catch {
      await fs.writeFile(PHOTOS_FILE, JSON.stringify([]));
    }
    
    // Initialize votes.json if it doesn't exist
    try {
      await fs.access(VOTES_FILE);
    } catch {
      await fs.writeFile(VOTES_FILE, JSON.stringify({}));
    }
  } catch (error) {
    console.error('Error initializing data:', error);
  }
}

// Helper functions
async function readPhotos() {
  try {
    const data = await fs.readFile(PHOTOS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading photos:', error);
    return [];
  }
}

async function writePhotos(photos) {
  try {
    await fs.writeFile(PHOTOS_FILE, JSON.stringify(photos, null, 2));
  } catch (error) {
    console.error('Error writing photos:', error);
  }
}

async function readVotes() {
  try {
    const data = await fs.readFile(VOTES_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading votes:', error);
    return {};
  }
}

async function writeVotes(votes) {
  try {
    await fs.writeFile(VOTES_FILE, JSON.stringify(votes, null, 2));
  } catch (error) {
    console.error('Error writing votes:', error);
  }
}

// API Routes

// Get all photos
app.get('/api/photos', async (req, res) => {
  try {
    const photos = await readPhotos();
    const votes = await readVotes();
    
    // Add vote counts to photos and ensure proper image URLs
    const photosWithVotes = photos.map(photo => ({
      ...photo,
      votes: Object.values(votes).filter(vote => vote.photoId === photo.id).length,
      url: photo.url.startsWith('/uploads/') ? photo.url : `/uploads/${photo.url.replace(/^\/+/, '')}`
    }));
    
    res.json(photosWithVotes);
  } catch (error) {
    console.error('Error getting photos:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Add new photo
app.post('/api/photos', upload.single('photo'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Photo file is required' });
    }
    
    const { title, author, category, year } = req.body;
    
    if (!title || !author || !category) {
      return res.status(400).json({ error: 'Title, author, and category are required' });
    }
    
    const photos = await readPhotos();
    const newPhoto = {
      id: Date.now(),
      title,
      author,
      category,
      year: parseInt(year) || new Date().getFullYear(),
      url: `/uploads/${req.file.filename}`,
      votes: 0
    };
    
    photos.push(newPhoto);
    await writePhotos(photos);
    
    res.status(201).json(newPhoto);
  } catch (error) {
    console.error('Error adding photo:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update photo
app.put('/api/photos/:id', upload.single('photo'), async (req, res) => {
  try {
    const photoId = parseInt(req.params.id);
    const { title, author, category, year } = req.body;
    
    const photos = await readPhotos();
    const photoIndex = photos.findIndex(p => p.id === photoId);
    
    if (photoIndex === -1) {
      return res.status(404).json({ error: 'Photo not found' });
    }
    
    const updatedPhoto = {
      ...photos[photoIndex],
      title: title || photos[photoIndex].title,
      author: author || photos[photoIndex].author,
      category: category || photos[photoIndex].category,
      year: year ? parseInt(year) : photos[photoIndex].year
    };
    
    // Update photo file if provided
    if (req.file) {
      updatedPhoto.url = `/uploads/${req.file.filename}`;
    }
    
    photos[photoIndex] = updatedPhoto;
    await writePhotos(photos);
    
    res.json(updatedPhoto);
  } catch (error) {
    console.error('Error updating photo:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete photo
app.delete('/api/photos/:id', async (req, res) => {
  try {
    const photoId = parseInt(req.params.id);
    const photos = await readPhotos();
    const photoIndex = photos.findIndex(p => p.id === photoId);
    
    if (photoIndex === -1) {
      return res.status(404).json({ error: 'Photo not found' });
    }
    
    photos.splice(photoIndex, 1);
    await writePhotos(photos);
    
    res.json({ message: 'Photo deleted successfully' });
  } catch (error) {
    console.error('Error deleting photo:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Vote for photo
app.post('/api/photos/:id/vote', async (req, res) => {
  try {
    const photoId = parseInt(req.params.id);
    const clientId = req.ip || req.connection.remoteAddress;
    
    const votes = await readVotes();
    const voteKey = `${clientId}-${photoId}`;
    
    if (votes[voteKey]) {
      return res.status(400).json({ error: 'You have already voted for this photo' });
    }
    
    votes[voteKey] = {
      photoId,
      clientId,
      timestamp: new Date().toISOString()
    };
    
    await writeVotes(votes);
    
    res.json({ message: 'Vote recorded successfully' });
  } catch (error) {
    console.error('Error voting:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Admin login
app.post('/api/admin/login', (req, res) => {
  const { password } = req.body;
  
  if (password === 'pass3662') {
    req.session.isAdmin = true;
    res.json({ success: true, message: 'Login successful' });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

// Check admin authentication
app.get('/api/admin/check', (req, res) => {
  if (req.session.isAdmin) {
    res.json({ authenticated: true });
  } else {
    res.status(401).json({ authenticated: false });
  }
});

// Admin logout
app.post('/api/admin/logout', (req, res) => {
  req.session.destroy();
  res.json({ message: 'Logged out successfully' });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File size too large' });
    }
  }
  console.error('Unhandled error:', error);
  res.status(500).json({ error: 'Internal server error' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start server
initializeData().then(() => {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
  });
});

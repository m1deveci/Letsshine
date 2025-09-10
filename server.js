const express = require('express');
const path = require('path');
const cors = require('cors');
const pg = require('pg');
const multer = require('multer');

const app = express();
const PORT = process.env.PORT || 3030;

// Database configuration - basitleştirilmiş config
const pool = new pg.Pool({
  host: 'localhost',
  port: 5432,
  database: 'letsshine_db',
  user: 'postgres',
  // password olmadan peer authentication kullanılır
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from React build
app.use(express.static(path.join(__dirname, 'dist')));
// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, 'uploads/'))
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, 'team-' + uniqueSuffix + path.extname(file.originalname))
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// API Routes
app.get('/api/services', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM services WHERE is_active = true ORDER BY created_at');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching services:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/services/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    const result = await pool.query('SELECT * FROM services WHERE slug = $1 AND is_active = true', [slug]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Service not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching service:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/applications', async (req, res) => {
  try {
    const { name, email, phone, serviceId, serviceName, category, message } = req.body;
    
    const result = await pool.query(
      'INSERT INTO applications (name, email, phone, service_id, service_name, category, message) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [name, email, phone, serviceId, serviceName, category, message]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating application:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/settings', async (req, res) => {
  try {
    const result = await pool.query('SELECT setting_key, setting_value FROM site_settings');
    const settings = {};
    result.rows.forEach(row => {
      settings[row.setting_key] = row.setting_value;
    });
    res.json(settings);
  } catch (error) {
    console.error('Error fetching settings:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Admin API Routes (basic auth needed)
app.post('/api/admin/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Simple demo auth - in production use proper password hashing
    if (email === 'admin@letsshine.com' && password === 'admin123') {
      res.json({ 
        user: { id: '1', email, role: 'admin' },
        token: 'demo-token'
      });
    } else {
      res.status(401).json({ error: 'Invalid credentials' });
    }
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/admin/applications', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM applications ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching applications:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.put('/api/admin/applications/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const result = await pool.query(
      'UPDATE applications SET status = $1 WHERE id = $2 RETURNING *',
      [status, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Application not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating application status:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Team Members API Routes
app.get('/api/team', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM team_members WHERE is_active = true ORDER BY order_position');
    res.json(result.rows.map(row => ({
      id: row.id.toString(),
      name: row.name,
      title: row.title,
      bio: row.bio,
      email: row.email,
      linkedin: row.linkedin,
      image: row.image,
      order: row.order_position,
      isActive: row.is_active,
      expertise: row.expertise || [],
      createdAt: row.created_at,
      updatedAt: row.updated_at
    })));
  } catch (error) {
    console.error('Error fetching team members:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/admin/team', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM team_members ORDER BY order_position');
    res.json(result.rows.map(row => ({
      id: row.id.toString(),
      name: row.name,
      title: row.title,
      bio: row.bio,
      email: row.email,
      linkedin: row.linkedin,
      image: row.image,
      order: row.order_position,
      isActive: row.is_active,
      expertise: row.expertise || [],
      createdAt: row.created_at,
      updatedAt: row.updated_at
    })));
  } catch (error) {
    console.error('Error fetching team members:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/admin/team', async (req, res) => {
  try {
    const { name, title, bio, email, linkedin, image, order, isActive, expertise } = req.body;
    
    const result = await pool.query(
      'INSERT INTO team_members (name, title, bio, email, linkedin, image, order_position, is_active, expertise) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *',
      [name, title, bio, email, linkedin, image, order, isActive, expertise]
    );
    
    const row = result.rows[0];
    res.status(201).json({
      id: row.id.toString(),
      name: row.name,
      title: row.title,
      bio: row.bio,
      email: row.email,
      linkedin: row.linkedin,
      image: row.image,
      order: row.order_position,
      isActive: row.is_active,
      expertise: row.expertise || [],
      createdAt: row.created_at,
      updatedAt: row.updated_at
    });
  } catch (error) {
    console.error('Error creating team member:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.put('/api/admin/team/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, title, bio, email, linkedin, image, order, isActive, expertise } = req.body;
    
    const result = await pool.query(
      'UPDATE team_members SET name = $1, title = $2, bio = $3, email = $4, linkedin = $5, image = $6, order_position = $7, is_active = $8, expertise = $9, updated_at = CURRENT_TIMESTAMP WHERE id = $10 RETURNING *',
      [name, title, bio, email, linkedin, image, order, isActive, expertise, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Team member not found' });
    }
    
    const row = result.rows[0];
    res.json({
      id: row.id.toString(),
      name: row.name,
      title: row.title,
      bio: row.bio,
      email: row.email,
      linkedin: row.linkedin,
      image: row.image,
      order: row.order_position,
      isActive: row.is_active,
      expertise: row.expertise || [],
      createdAt: row.created_at,
      updatedAt: row.updated_at
    });
  } catch (error) {
    console.error('Error updating team member:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.delete('/api/admin/team/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await pool.query('DELETE FROM team_members WHERE id = $1 RETURNING *', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Team member not found' });
    }
    
    res.json({ message: 'Team member deleted successfully' });
  } catch (error) {
    console.error('Error deleting team member:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// File upload endpoint for team photos
app.post('/api/admin/upload', upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    
    const fileUrl = `/uploads/${req.file.filename}`;
    res.json({ 
      message: 'File uploaded successfully',
      url: fileUrl,
      filename: req.file.filename 
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Serve React app for all non-API routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Unhandled error:', error);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
app.listen(PORT, '127.0.0.1', () => {
  console.log(`Server running on http://127.0.0.1:${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  pool.end();
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  pool.end();
  process.exit(0);
});
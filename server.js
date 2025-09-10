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

// Security middleware
app.use((req, res, next) => {
  // Security headers
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
  next();
});

// CORS configuration
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://letsshine.com.tr', 'https://www.letsshine.com.tr']
    : ['http://localhost:3000', 'http://localhost:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parsing middleware with limits
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

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
    
    // Input validation
    if (!name || !email || !phone || !serviceId || !message) {
      return res.status(400).json({ error: 'Required fields are missing' });
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }
    
    // Phone validation (basic)
    const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/;
    if (!phoneRegex.test(phone)) {
      return res.status(400).json({ error: 'Invalid phone format' });
    }
    
    // Sanitize inputs
    const sanitizedName = name.trim().substring(0, 100);
    const sanitizedEmail = email.trim().toLowerCase().substring(0, 100);
    const sanitizedPhone = phone.trim().substring(0, 20);
    const sanitizedMessage = message.trim().substring(0, 1000);
    
    const result = await pool.query(
      'INSERT INTO applications (name, email, phone, service_id, service_name, category, message) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [sanitizedName, sanitizedEmail, sanitizedPhone, serviceId, serviceName, category, sanitizedMessage]
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

// Admin authentication middleware
const authenticateAdmin = (req, res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  
  // Simple token validation - in production use JWT
  if (token === 'demo-token') {
    req.user = { id: '1', email: 'admin@letsshine.com', role: 'admin' };
    next();
  } else {
    res.status(401).json({ error: 'Unauthorized' });
  }
};

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

app.get('/api/admin/applications', authenticateAdmin, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM applications ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching applications:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.put('/api/admin/applications/:id/status', authenticateAdmin, async (req, res) => {
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

// About Content API Route
app.get('/api/about', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM about_content ORDER BY order_position');
    const sections = result.rows.map(row => ({
      id: row.id.toString(),
      title: row.title,
      content: row.content,
      image: row.image,
      order: row.order_position
    }));
    
    res.json({
      title: 'Hakkımızda',
      subtitle: 'İnsan Odaklı Çözümler',
      description: 'Let\'s Shine olarak, insan kaynakları alanında uzman ekibimizle şirketlerinizin en değerli varlığı olan insan kaynağını en verimli şekilde yönetmenize yardımcı oluyoruz.',
      sections: sections
    });
  } catch (error) {
    console.error('Error fetching about content:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Admin About Content API Routes
app.get('/api/admin/about', authenticateAdmin, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM about_content ORDER BY order_position');
    const sections = result.rows.map(row => ({
      id: row.id.toString(),
      title: row.title,
      content: row.content,
      image: row.image,
      order: row.order_position
    }));
    
    res.json({
      title: 'Hakkımızda',
      subtitle: 'İnsan Odaklı Çözümler',
      description: 'Let\'s Shine olarak, insan kaynakları alanında uzman ekibimizle şirketlerinizin en değerli varlığı olan insan kaynağını en verimli şekilde yönetmenize yardımcı oluyoruz.',
      sections: sections
    });
  } catch (error) {
    console.error('Error fetching about content:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/admin/about/sections', authenticateAdmin, async (req, res) => {
  try {
    const { title, content, image, order } = req.body;
    
    const result = await pool.query(
      'INSERT INTO about_content (title, content, image, order_position) VALUES ($1, $2, $3, $4) RETURNING *',
      [title, content, image, order]
    );
    
    const newSection = {
      id: result.rows[0].id.toString(),
      title: result.rows[0].title,
      content: result.rows[0].content,
      image: result.rows[0].image,
      order: result.rows[0].order_position
    };
    
    res.status(201).json(newSection);
  } catch (error) {
    console.error('Error adding about section:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.put('/api/admin/about/sections/:id', authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, image, order } = req.body;
    
    const result = await pool.query(
      'UPDATE about_content SET title = $1, content = $2, image = $3, order_position = $4, updated_at = CURRENT_TIMESTAMP WHERE id = $5 RETURNING *',
      [title, content, image, order, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Section not found' });
    }
    
    const updatedSection = {
      id: result.rows[0].id.toString(),
      title: result.rows[0].title,
      content: result.rows[0].content,
      image: result.rows[0].image,
      order: result.rows[0].order_position
    };
    
    res.json(updatedSection);
  } catch (error) {
    console.error('Error updating about section:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.delete('/api/admin/about/sections/:id', authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await pool.query('DELETE FROM about_content WHERE id = $1 RETURNING *', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Section not found' });
    }
    
    res.json({ message: 'Section deleted successfully' });
  } catch (error) {
    console.error('Error deleting about section:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Public Applications API Route (for form submissions)
app.get('/api/applications', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM applications ORDER BY created_at DESC');
    res.json(result.rows.map(row => ({
      id: row.id.toString(),
      name: row.name,
      email: row.email,
      phone: row.phone,
      serviceId: row.service_id,
      serviceName: row.service_name,
      category: row.category,
      message: row.message,
      status: row.status,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    })));
  } catch (error) {
    console.error('Error fetching applications:', error);
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

app.get('/api/admin/team', authenticateAdmin, async (req, res) => {
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

app.post('/api/admin/team', authenticateAdmin, async (req, res) => {
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

app.put('/api/admin/team/:id', authenticateAdmin, async (req, res) => {
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

app.delete('/api/admin/team/:id', authenticateAdmin, async (req, res) => {
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
app.post('/api/admin/upload', authenticateAdmin, upload.single('image'), (req, res) => {
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
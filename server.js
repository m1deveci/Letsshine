import express from 'express';
import path from 'path';
import cors from 'cors';
import pg from 'pg';
import multer from 'multer';
import sharp from 'sharp';
import rateLimit from 'express-rate-limit';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3030;

// Database configuration
const pool = new pg.Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'letsshine',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || undefined,
  // Connection pool settings
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // limit each IP to 1000 requests per windowMs (increased from 100)
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // limit each IP to 20 login attempts per windowMs (increased from 5)
  message: 'Too many login attempts, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(limiter);

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
const corsOrigins = process.env.CORS_ORIGINS 
  ? process.env.CORS_ORIGINS.split(',')
  : process.env.NODE_ENV === 'production' 
    ? ['https://letsshine.com.tr', 'https://www.letsshine.com.tr']
    : ['http://localhost:3000', 'http://localhost:5173'];

app.use(cors({
  origin: corsOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parsing middleware with limits
const maxFileSize = process.env.MAX_FILE_SIZE || '50mb';
app.use(express.json({ limit: maxFileSize }));
app.use(express.urlencoded({ extended: true, limit: maxFileSize }));

// Serve static files from React build with proper MIME types
app.use(express.static(path.join(__dirname, 'dist'), {
  setHeaders: (res, path) => {
    if (path.endsWith('.css')) {
      res.setHeader('Content-Type', 'text/css');
    } else if (path.endsWith('.js')) {
      res.setHeader('Content-Type', 'application/javascript');
    }
  }
}));
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
    fileSize: parseInt(process.env.MAX_FILE_SIZE || '104857600'), // 100MB default
  },
  fileFilter: (req, file, cb) => {
    // Allowed image types
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only image files (JPEG, PNG, GIF, WebP) are allowed'));
    }
  }
});

// API Routes
app.get('/api/services', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM services ORDER BY order_position');
    res.json(result.rows.map(row => ({
      id: row.id.toString(),
      title: row.title,
      description: row.description,
      content: row.content,
      features: row.features || [],
      icon: row.icon,
      slug: row.slug,
      isActive: row.is_active !== undefined ? row.is_active : true,
      order: row.order_position,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    })));
  } catch (error) {
    console.error('Error fetching services:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get single service by ID or slug
app.get('/api/services/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if id is numeric (for ID lookup) or string (for slug lookup)
    if (!/^\d+$/.test(id)) {
      // If not numeric, treat as slug
      const result = await pool.query('SELECT * FROM services WHERE slug = $1', [id]);
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Service not found' });
      }
      const row = result.rows[0];
      return res.json({
        id: row.id.toString(),
        title: row.title,
        description: row.description,
        content: row.content,
        features: row.features || [],
        icon: row.icon,
        slug: row.slug,
        isActive: row.is_active !== undefined ? row.is_active : true,
        order: row.order_position,
        createdAt: row.created_at,
        updatedAt: row.updated_at
      });
    }
    
    // If numeric, treat as ID
    const result = await pool.query('SELECT * FROM services WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Service not found' });
    }
    
    const service = result.rows[0];
    res.json({
      id: service.id.toString(),
      title: service.title,
      description: service.description,
      content: service.content,
      features: service.features || [],
      icon: service.icon,
      slug: service.slug,
      isActive: service.is_active !== undefined ? service.is_active : true,
      order: service.order_position,
      createdAt: service.created_at,
      updatedAt: service.updated_at
    });
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
    const result = await pool.query('SELECT * FROM site_settings ORDER BY id LIMIT 1');
    if (result.rows.length === 0) {
      return res.json({
        title: 'Let\'s Shine',
        description: 'İnsan Odaklı Çözümler',
        logo: null,
        favicon: null,
        phone: '+90 (XXX) XXX XX XX',
        email: 'info@letsshine.com',
        address: 'İzmir, Türkiye',
        socialMedia: {
          linkedin: '',
          twitter: '',
          instagram: '',
          facebook: ''
        },
        smtp: {
          host: '',
          port: 587,
          username: '',
          password: '',
          fromEmail: 'info@letsshine.com'
        }
      });
    }
    
    const row = result.rows[0];
    res.json({
      title: row.title,
      description: row.description,
      logo: row.logo,
      favicon: row.favicon,
      phone: row.phone,
      email: row.email,
      address: row.address,
      socialMedia: {
        linkedin: row.linkedin || '',
        twitter: row.twitter || '',
        instagram: row.instagram || '',
        facebook: row.facebook || ''
      },
      smtp: {
        host: row.smtp_host || '',
        port: row.smtp_port || 587,
        username: row.smtp_username || '',
        password: row.smtp_password || '',
        fromEmail: row.smtp_from_email || 'info@letsshine.com'
      }
    });
  } catch (error) {
    console.error('Error fetching settings:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Admin authentication middleware
const authenticateAdmin = (req, res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  
  // Simple token validation - in production use JWT
  if (token === process.env.ADMIN_TOKEN || token === 'demo-token') {
    req.user = { id: '1', email: process.env.ADMIN_EMAIL || 'admin@letsshine.com', role: 'admin' };
    next();
  } else {
    res.status(401).json({ error: 'Unauthorized' });
  }
};

// Admin API Routes (basic auth needed)
app.post('/api/admin/login', authLimiter, async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Simple demo auth - in production use proper password hashing
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@letsshine.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
    
    if (email === adminEmail && password === adminPassword) {
      res.json({ 
        user: { id: '1', email, role: 'admin' },
        token: process.env.ADMIN_TOKEN || 'demo-token'
      });
    } else {
      res.status(401).json({ error: 'Invalid credentials' });
    }
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.put('/api/settings', authenticateAdmin, async (req, res) => {
  try {
    const { title, description, logo, favicon, phone, email, address, socialMedia, smtp } = req.body;
    
    // Check if settings exist
    const existingResult = await pool.query('SELECT * FROM site_settings ORDER BY id LIMIT 1');
    
    if (existingResult.rows.length === 0) {
      // Insert new settings
      const result = await pool.query(
        `INSERT INTO site_settings (title, description, logo, favicon, phone, email, address, linkedin, twitter, instagram, facebook, smtp_host, smtp_port, smtp_username, smtp_password, smtp_from_email) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16) RETURNING *`,
        [
          title, description, logo, favicon, phone, email, address,
          socialMedia?.linkedin || '', socialMedia?.twitter || '', socialMedia?.instagram || '', socialMedia?.facebook || '',
          smtp?.host || '', smtp?.port || 587, smtp?.username || '', smtp?.password || '', smtp?.fromEmail || email
        ]
      );
      
      const row = result.rows[0];
      res.json({
        title: row.title,
        description: row.description,
        logo: row.logo,
        favicon: row.favicon,
        phone: row.phone,
        email: row.email,
        address: row.address,
        socialMedia: {
          linkedin: row.linkedin || '',
          twitter: row.twitter || '',
          instagram: row.instagram || '',
          facebook: row.facebook || ''
        },
        smtp: {
          host: row.smtp_host || '',
          port: row.smtp_port || 587,
          username: row.smtp_username || '',
          password: row.smtp_password || '',
          fromEmail: row.smtp_from_email || 'info@letsshine.com'
        }
      });
    } else {
      // Update existing settings
      const result = await pool.query(
        `UPDATE site_settings SET 
         title = $1, description = $2, logo = $3, favicon = $4, phone = $5, email = $6, address = $7,
         linkedin = $8, twitter = $9, instagram = $10, facebook = $11,
         smtp_host = $12, smtp_port = $13, smtp_username = $14, smtp_password = $15, smtp_from_email = $16,
         updated_at = NOW()
         WHERE id = $17 RETURNING *`,
        [
          title, description, logo, favicon, phone, email, address,
          socialMedia?.linkedin || '', socialMedia?.twitter || '', socialMedia?.instagram || '', socialMedia?.facebook || '',
          smtp?.host || '', smtp?.port || 587, smtp?.username || '', smtp?.password || '', smtp?.fromEmail || email,
          existingResult.rows[0].id
        ]
      );
      
      const row = result.rows[0];
      res.json({
        title: row.title,
        description: row.description,
        logo: row.logo,
        favicon: row.favicon,
        phone: row.phone,
        email: row.email,
        address: row.address,
        socialMedia: {
          linkedin: row.linkedin || '',
          twitter: row.twitter || '',
          instagram: row.instagram || '',
          facebook: row.facebook || ''
        },
        smtp: {
          host: row.smtp_host || '',
          port: row.smtp_port || 587,
          username: row.smtp_username || '',
          password: row.smtp_password || '',
          fromEmail: row.smtp_from_email || 'info@letsshine.com'
        }
      });
    }
  } catch (error) {
    console.error('Error updating settings:', error);
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

app.get('/api/admin/services', authenticateAdmin, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM services ORDER BY order_position');
    res.json(result.rows.map(row => ({
      id: row.id.toString(),
      title: row.title,
      description: row.description,
      content: row.content,
      features: row.features || [],
      icon: row.icon,
      slug: row.slug,
      isActive: row.is_active !== undefined ? row.is_active : true,
      order: row.order_position,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    })));
  } catch (error) {
    console.error('Error fetching services:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Services CRUD endpoints
app.post('/api/services', async (req, res) => {
  try {
    const { title, description, content, features, icon, slug, order, isActive } = req.body;
    
    const result = await pool.query(
      'INSERT INTO services (title, description, content, features, icon, slug, order_position, is_active) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
      [title, description, content, features || [], icon, slug, order || 0, isActive !== undefined ? isActive : true]
    );
    
    const service = result.rows[0];
    res.status(201).json({
      id: service.id.toString(),
      title: service.title,
      description: service.description,
      content: service.content,
      features: service.features || [],
      icon: service.icon,
      slug: service.slug,
      isActive: service.is_active,
      order: service.order_position,
      createdAt: service.created_at,
      updatedAt: service.updated_at
    });
  } catch (error) {
    console.error('Error creating service:', error);
    if (error.code === '23505') { // Unique constraint violation
      res.status(400).json({ error: 'Bu slug zaten kullanılıyor' });
    } else if (error.code === '23502') { // Not null violation
      res.status(400).json({ error: 'Gerekli alanlar eksik' });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
});

app.put('/api/services/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, content, features, icon, slug, order, isActive } = req.body;
    
    const result = await pool.query(
      'UPDATE services SET title = $1, description = $2, content = $3, features = $4, icon = $5, slug = $6, order_position = $7, is_active = $8, updated_at = NOW() WHERE id = $9 RETURNING *',
      [title, description, content, features || [], icon, slug, order || 0, isActive !== undefined ? isActive : true, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Service not found' });
    }
    
    const service = result.rows[0];
    res.json({
      id: service.id.toString(),
      title: service.title,
      description: service.description,
      content: service.content,
      features: service.features || [],
      icon: service.icon,
      slug: service.slug,
      isActive: service.is_active,
      order: service.order_position,
      createdAt: service.created_at,
      updatedAt: service.updated_at
    });
  } catch (error) {
    console.error('Error updating service:', error);
    if (error.code === '23505') { // Unique constraint violation
      res.status(400).json({ error: 'Bu slug zaten kullanılıyor' });
    } else if (error.code === '23502') { // Not null violation
      res.status(400).json({ error: 'Gerekli alanlar eksik' });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
});

app.delete('/api/services/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await pool.query('DELETE FROM services WHERE id = $1 RETURNING *', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Service not found' });
    }
    
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting service:', error);
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
    const result = await pool.query(`
      SELECT * FROM team_members 
      WHERE is_active = true 
      ORDER BY role DESC, order_index ASC, name ASC
    `);
    res.json(result.rows.map(row => ({
      id: row.id.toString(),
      name: row.name,
      title: row.title,
      bio: row.bio,
      email: row.email,
      linkedin: row.linkedin,
      image: row.image,
      role: row.role || 'consultant',
      parentId: row.parent_id,
      orderIndex: row.order_index || 0,
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

// Public Team CRUD endpoints
app.post('/api/team', async (req, res) => {
  try {
    const { name, title, bio, email, linkedin, image, role, parentId, orderIndex, isActive, expertise } = req.body;
    
    const result = await pool.query(
      'INSERT INTO team_members (name, title, bio, email, linkedin, image, role, parent_id, order_index, is_active, expertise) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *',
      [name, title, bio, email, linkedin, image, role || 'consultant', parentId, orderIndex || 0, isActive !== undefined ? isActive : true, expertise || []]
    );
    
    const member = result.rows[0];
    res.status(201).json({
      id: member.id.toString(),
      name: member.name,
      title: member.title,
      bio: member.bio,
      email: member.email,
      linkedin: member.linkedin,
      image: member.image,
      role: member.role || 'consultant',
      parentId: member.parent_id,
      orderIndex: member.order_index || 0,
      isActive: member.is_active,
      expertise: member.expertise || [],
      createdAt: member.created_at,
      updatedAt: member.updated_at
    });
  } catch (error) {
    console.error('Error creating team member:', error);
    if (error.code === '23502') { // Not null violation
      res.status(400).json({ error: 'Gerekli alanlar eksik' });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
});

app.put('/api/team/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, title, bio, email, linkedin, image, role, parentId, orderIndex, isActive, expertise } = req.body;
    
    const result = await pool.query(
      'UPDATE team_members SET name = $1, title = $2, bio = $3, email = $4, linkedin = $5, image = $6, role = $7, parent_id = $8, order_index = $9, is_active = $10, expertise = $11, updated_at = NOW() WHERE id = $12 RETURNING *',
      [name, title, bio, email, linkedin, image, role || 'consultant', parentId, orderIndex || 0, isActive !== undefined ? isActive : true, expertise || [], id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Team member not found' });
    }
    
    const member = result.rows[0];
    res.json({
      id: member.id.toString(),
      name: member.name,
      title: member.title,
      bio: member.bio,
      email: member.email,
      linkedin: member.linkedin,
      image: member.image,
      role: member.role || 'consultant',
      parentId: member.parent_id,
      orderIndex: member.order_index || 0,
      isActive: member.is_active,
      expertise: member.expertise || [],
      createdAt: member.created_at,
      updatedAt: member.updated_at
    });
  } catch (error) {
    console.error('Error updating team member:', error);
    if (error.code === '23502') { // Not null violation
      res.status(400).json({ error: 'Gerekli alanlar eksik' });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
});

app.delete('/api/team/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await pool.query('DELETE FROM team_members WHERE id = $1 RETURNING *', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Team member not found' });
    }
    
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting team member:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/admin/team', authenticateAdmin, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT * FROM team_members 
      ORDER BY role DESC, order_index ASC, name ASC
    `);
    res.json(result.rows.map(row => ({
      id: row.id.toString(),
      name: row.name,
      title: row.title,
      bio: row.bio,
      email: row.email,
      linkedin: row.linkedin,
      image: row.image,
      role: row.role || 'consultant',
      parentId: row.parent_id,
      orderIndex: row.order_index || 0,
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
    const { name, title, bio, email, linkedin, image, role, parentId, orderIndex, isActive, expertise } = req.body;
    
    const result = await pool.query(
      'INSERT INTO team_members (name, title, bio, email, linkedin, image, role, parent_id, order_index, is_active, expertise) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *',
      [name, title, bio, email, linkedin, image, role || 'consultant', parentId, orderIndex || 0, isActive, expertise]
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
      role: row.role || 'consultant',
      parentId: row.parent_id,
      orderIndex: row.order_index || 0,
      isActive: row.is_active,
      expertise: row.expertise || [],
      createdAt: row.created_at,
      updatedAt: row.updated_at
    });
  } catch (error) {
    console.error('Error creating team member:', error);
    if (error.code === '23502') { // Not null violation
      res.status(400).json({ error: 'Gerekli alanlar eksik' });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
});

app.put('/api/admin/team/:id', authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, title, bio, email, linkedin, image, role, parentId, orderIndex, isActive, expertise } = req.body;
    
    const result = await pool.query(
      'UPDATE team_members SET name = $1, title = $2, bio = $3, email = $4, linkedin = $5, image = $6, role = $7, parent_id = $8, order_index = $9, is_active = $10, expertise = $11, updated_at = CURRENT_TIMESTAMP WHERE id = $12 RETURNING *',
      [name, title, bio, email, linkedin, image, role || 'consultant', parentId, orderIndex || 0, isActive, expertise, id]
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
      role: row.role || 'consultant',
      parentId: row.parent_id,
      orderIndex: row.order_index || 0,
      isActive: row.is_active,
      expertise: row.expertise || [],
      createdAt: row.created_at,
      updatedAt: row.updated_at
    });
  } catch (error) {
    console.error('Error updating team member:', error);
    if (error.code === '23502') { // Not null violation
      res.status(400).json({ error: 'Gerekli alanlar eksik' });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
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
app.post('/api/admin/upload', authenticateAdmin, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    
    const originalPath = req.file.path;
    const resizedPath = originalPath.replace(/\.[^/.]+$/, '_resized.jpg');
    
    // Resize image to max 800x800 with quality 85%
    await sharp(originalPath)
      .resize(800, 800, {
        fit: 'inside',
        withoutEnlargement: true
      })
      .jpeg({ quality: 85 })
      .toFile(resizedPath);
    
    // Delete original file
    fs.unlinkSync(originalPath);
    
    // Update filename to resized version
    const resizedFilename = req.file.filename.replace(/\.[^/.]+$/, '_resized.jpg');
    const fileUrl = `/uploads/${resizedFilename}`;
    
    res.json({ 
      message: 'File uploaded and resized successfully',
      url: fileUrl,
      filename: resizedFilename 
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

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Unhandled error:', error);
  res.status(500).json({ error: 'Internal server error' });
});

// SPA fallback - serve index.html for all non-API routes
app.get('*', (req, res) => {
  // Skip API routes
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ error: 'API endpoint not found' });
  }
  
  // Serve React app for all other routes
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
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
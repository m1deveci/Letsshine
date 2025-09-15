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
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3030;

// Database configuration
const pool = new pg.Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'letsshine_db',
  user: process.env.DB_USER || 'letsshine_user',
  password: process.env.DB_PASSWORD || 'letsshine2025!',
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
  
  // Content Security Policy
  res.setHeader('Content-Security-Policy', 
    "default-src 'self'; " +
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://static.cloudflareinsights.com; " +
    "script-src-elem 'self' 'unsafe-inline' https://static.cloudflareinsights.com; " +
    "style-src 'self' 'unsafe-inline'; " +
    "img-src 'self' data: blob:; " +
    "font-src 'self' data:; " +
    "connect-src 'self' http://localhost:3030 https://letsshine.com.tr https://cloudflareinsights.com;"
  );
  
  next();
});

// CORS configuration
const corsOrigins = process.env.CORS_ORIGINS 
  ? process.env.CORS_ORIGINS.split(',')
  : process.env.NODE_ENV === 'production' 
    ? ['https://letsshine.com.tr', 'https://www.letsshine.com.tr']
    : ['http://localhost:3000', 'http://localhost:5173', 'http://localhost:4173'];

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
    const result = await pool.query('SELECT * FROM services ORDER BY id');
    console.log('Services query result:', result.rows.length, 'rows');
    res.json(result.rows.map(row => ({
      id: row.id.toString(),
      title: row.title,
      description: row.description,
      content: row.content,
      features: row.features || [],
      icon: row.icon,
      slug: row.slug,
      isActive: row.is_active !== undefined ? row.is_active : true,
      order: row.order_position || 0,
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
    // Get all settings from key-value table
    const result = await pool.query('SELECT setting_key, setting_value FROM site_settings');
    
    // Default values
    let settings = {
      title: 'Let\'s Shine',
      subtitle: 'İnsan Kaynakları',
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
    };
    
    // Merge settings from database
    result.rows.forEach(row => {
      if (row.setting_key === 'site_info') {
        const siteInfo = row.setting_value;
        settings.title = siteInfo.title || settings.title;
        settings.subtitle = siteInfo.subtitle || settings.subtitle;
        settings.description = siteInfo.description || settings.description;
        settings.logo = siteInfo.logo || settings.logo;
        settings.favicon = siteInfo.favicon || settings.favicon;
        settings.phone = siteInfo.phone || settings.phone;
        settings.email = siteInfo.email || settings.email;
        settings.address = siteInfo.address || settings.address;
      } else if (row.setting_key === 'social_media') {
        settings.socialMedia = { ...settings.socialMedia, ...row.setting_value };
      } else if (row.setting_key === 'smtp_config') {
        settings.smtp = { ...settings.smtp, ...row.setting_value };
      }
    });
    
    res.json(settings);
  } catch (error) {
    console.error('Error fetching settings:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Function to get real email usage from mail server
const getEmailUsage = (email) => {
  try {
    const username = email.split('@')[0];
    let totalSize = 0;

    // Check /var/mail/ for INBOX
    try {
      const inboxPath = `/var/mail/${username}`;
      if (fs.existsSync(inboxPath)) {
        const stats = fs.statSync(inboxPath);
        totalSize += stats.size;
      }
    } catch (error) {
      // Inbox doesn't exist or no permission
    }

    // Check home directory mail folders (~/mail)
    try {
      const homeMailPath = `/home/${username}/mail`;
      if (fs.existsSync(homeMailPath)) {
        const output = execSync(`du -sb "${homeMailPath}" 2>/dev/null || echo "0"`, { encoding: 'utf8' });
        const dirSize = parseInt(output.split('\t')[0]) || 0;
        totalSize += dirSize;
      }
    } catch (error) {
      // Home mail directory doesn't exist or no permission
    }

    // Convert bytes to MB
    return Math.round(totalSize / (1024 * 1024));
  } catch (error) {
    console.error(`Error calculating email usage for ${email}:`, error);
    return 0;
  }
};

// Function to update all email usage data
const updateAllEmailUsage = async () => {
  try {
    const result = await pool.query('SELECT id, email FROM email_accounts');

    for (const account of result.rows) {
      const realUsage = getEmailUsage(account.email);
      await pool.query(
        'UPDATE email_accounts SET used_mb = $1 WHERE id = $2',
        [realUsage, account.id]
      );
    }

    console.log('Email usage data updated for all accounts');
  } catch (error) {
    console.error('Error updating email usage data:', error);
  }
};

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
    const { title, subtitle, description, logo, favicon, phone, email, address, socialMedia, smtp } = req.body;
    
    // Get current settings first
    const currentResult = await pool.query('SELECT setting_key, setting_value FROM site_settings');
    const currentSettings = {};
    currentResult.rows.forEach(row => {
      currentSettings[row.setting_key] = row.setting_value;
    });
    
    // Update site_info - merge with existing data
    if (title !== undefined || subtitle !== undefined || description !== undefined || logo !== undefined || 
        favicon !== undefined || phone !== undefined || email !== undefined || address !== undefined) {
      const currentSiteInfo = currentSettings.site_info || {};
      const siteInfo = {
        ...currentSiteInfo,
        ...(title !== undefined && { title }),
        ...(subtitle !== undefined && { subtitle }),
        ...(description !== undefined && { description }),
        ...(logo !== undefined && { logo }),
        ...(favicon !== undefined && { favicon }),
        ...(phone !== undefined && { phone }),
        ...(email !== undefined && { email }),
        ...(address !== undefined && { address })
      };
      
      await pool.query(
        `INSERT INTO site_settings (setting_key, setting_value) 
         VALUES ('site_info', $1) 
         ON CONFLICT (setting_key) 
         DO UPDATE SET setting_value = $1, updated_at = NOW()`,
        [JSON.stringify(siteInfo)]
      );
    }
    
    // Update social_media - merge with existing data
    if (socialMedia !== undefined) {
      const currentSocialMedia = currentSettings.social_media || {};
      const socialMediaData = {
        ...currentSocialMedia,
        ...socialMedia
      };
      
      await pool.query(
        `INSERT INTO site_settings (setting_key, setting_value) 
         VALUES ('social_media', $1) 
         ON CONFLICT (setting_key) 
         DO UPDATE SET setting_value = $1, updated_at = NOW()`,
        [JSON.stringify(socialMediaData)]
      );
    }
    
    // Update smtp_config - merge with existing data
    if (smtp !== undefined) {
      const currentSmtp = currentSettings.smtp_config || {};
      const smtpData = {
        ...currentSmtp,
        ...smtp
      };
      
      await pool.query(
        `INSERT INTO site_settings (setting_key, setting_value) 
         VALUES ('smtp_config', $1) 
         ON CONFLICT (setting_key) 
         DO UPDATE SET setting_value = $1, updated_at = NOW()`,
        [JSON.stringify(smtpData)]
      );
    }
    
    // Return updated settings by fetching from database
    const updatedResult = await pool.query('SELECT setting_key, setting_value FROM site_settings');
    const updatedSettings = {};
    updatedResult.rows.forEach(row => {
      updatedSettings[row.setting_key] = row.setting_value;
    });
    
    const siteInfo = updatedSettings.site_info || {};
    const socialMediaData = updatedSettings.social_media || {};
    const smtpData = updatedSettings.smtp_config || {};
    
    res.json({
      title: siteInfo.title || 'Let\'s Shine',
      subtitle: siteInfo.subtitle || 'İnsan Kaynakları',
      description: siteInfo.description || 'İnsan Odaklı Çözümler',
      logo: siteInfo.logo || null,
      favicon: siteInfo.favicon || null,
      phone: siteInfo.phone || '+90 (XXX) XXX XX XX',
      email: siteInfo.email || 'info@letsshine.com',
      address: siteInfo.address || 'İzmir, Türkiye',
      socialMedia: {
        linkedin: socialMediaData.linkedin || '',
        twitter: socialMediaData.twitter || '',
        instagram: socialMediaData.instagram || '',
        facebook: socialMediaData.facebook || ''
      },
      smtp: {
        host: smtpData.host || '',
        port: smtpData.port || 587,
        username: smtpData.username || '',
        password: smtpData.password || '',
        fromEmail: smtpData.fromEmail || 'info@letsshine.com'
      }
    });
  } catch (error) {
    console.error('Error updating settings:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/admin/applications', authenticateAdmin, async (req, res) => {
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

// Delete application endpoint
app.delete('/api/admin/applications/:id', authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await pool.query('DELETE FROM applications WHERE id = $1 RETURNING *', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Application not found' });
    }
    
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting application:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Hero Content API endpoints
app.get('/api/hero', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM hero_content WHERE is_active = true ORDER BY id DESC LIMIT 1');
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Hero content not found' });
    }
    
    const row = result.rows[0];
    res.json({
      id: row.id.toString(),
      title: row.title,
      subtitle: row.subtitle,
      description: row.description,
      features: row.features || [],
      stats: row.stats || [],
      heroImage: row.hero_image,
      isActive: row.is_active,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    });
  } catch (error) {
    console.error('Error fetching hero content:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/admin/hero', authenticateAdmin, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM hero_content ORDER BY id DESC LIMIT 1');
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Hero content not found' });
    }
    
    const row = result.rows[0];
    res.json({
      id: row.id.toString(),
      title: row.title,
      subtitle: row.subtitle,
      description: row.description,
      features: row.features || [],
      stats: row.stats || [],
      heroImage: row.hero_image,
      isActive: row.is_active,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    });
  } catch (error) {
    console.error('Error fetching hero content:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.put('/api/admin/hero', authenticateAdmin, async (req, res) => {
  try {
    const { title, subtitle, description, features, stats, heroImage, isActive } = req.body;
    
    // Check if hero content exists
    const existingResult = await pool.query('SELECT id FROM hero_content ORDER BY id DESC LIMIT 1');
    
    if (existingResult.rows.length > 0) {
      // Update existing
      const result = await pool.query(
        'UPDATE hero_content SET title = $1, subtitle = $2, description = $3, features = $4, stats = $5, hero_image = $6, is_active = $7, updated_at = CURRENT_TIMESTAMP WHERE id = $8 RETURNING *',
        [title, subtitle, description, JSON.stringify(features), JSON.stringify(stats), heroImage, isActive, existingResult.rows[0].id]
      );
      
      const row = result.rows[0];
      res.json({
        id: row.id.toString(),
        title: row.title,
        subtitle: row.subtitle,
        description: row.description,
        features: row.features || [],
        stats: row.stats || [],
        heroImage: row.hero_image,
        isActive: row.is_active,
        createdAt: row.created_at,
        updatedAt: row.updated_at
      });
    } else {
      // Create new
      const result = await pool.query(
        'INSERT INTO hero_content (title, subtitle, description, features, stats, hero_image, is_active) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
        [title, subtitle, description, JSON.stringify(features), JSON.stringify(stats), heroImage, isActive]
      );
      
      const row = result.rows[0];
      res.json({
        id: row.id.toString(),
        title: row.title,
        subtitle: row.subtitle,
        description: row.description,
        features: row.features || [],
        stats: row.stats || [],
        heroImage: row.hero_image,
        isActive: row.is_active,
        createdAt: row.created_at,
        updatedAt: row.updated_at
      });
    }
  } catch (error) {
    console.error('Error updating hero content:', error);
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
app.post('/api/services', authenticateAdmin, async (req, res) => {
  try {
    const { title, description, content, features, icon, slug, order, isActive } = req.body;
    
    // Validation
    if (!title || !description) {
      return res.status(400).json({ error: 'Gerekli alanlar eksik' });
    }
    
    // Parse features if it's a string
    let parsedFeatures = features || [];
    if (typeof features === 'string') {
      try {
        parsedFeatures = JSON.parse(features);
      } catch (e) {
        parsedFeatures = [];
      }
    } else if (Array.isArray(features)) {
      parsedFeatures = features;
    } else if (features && typeof features === 'object') {
      // If it's an object, try to extract array values
      parsedFeatures = Object.values(features).filter(v => typeof v === 'string');
    }
    
    // Ensure it's always an array
    if (!Array.isArray(parsedFeatures)) {
      parsedFeatures = [];
    }
    
    const result = await pool.query(
      'INSERT INTO services (title, description, content, features, icon, slug, order_position, is_active) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
      [title, description, content, JSON.stringify(parsedFeatures), icon, slug, order || 0, isActive !== undefined ? isActive : true]
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

app.put('/api/services/:id', authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, content, features, icon, slug, order, isActive } = req.body;
    
    console.log('PUT /api/services/:id - Request body:', JSON.stringify(req.body, null, 2));
    console.log('Features type:', typeof features, 'Features value:', features);
    
    // Validation
    if (!title || !description) {
      return res.status(400).json({ error: 'Gerekli alanlar eksik' });
    }
    
    // Parse features if it's a string
    let parsedFeatures = features || [];
    if (typeof features === 'string') {
      try {
        parsedFeatures = JSON.parse(features);
        console.log('Parsed features:', parsedFeatures);
      } catch (e) {
        console.error('JSON parse error:', e);
        parsedFeatures = [];
      }
    } else if (Array.isArray(features)) {
      parsedFeatures = features;
    } else if (features && typeof features === 'object') {
      // If it's an object, try to extract array values
      parsedFeatures = Object.values(features).filter(v => typeof v === 'string');
    }
    
    // Ensure it's always an array
    if (!Array.isArray(parsedFeatures)) {
      parsedFeatures = [];
    }
    
    const result = await pool.query(
      'UPDATE services SET title = $1, description = $2, content = $3, features = $4, icon = $5, slug = $6, order_position = $7, is_active = $8, updated_at = NOW() WHERE id = $9 RETURNING *',
      [title, description, content, JSON.stringify(parsedFeatures), icon, slug, order || 0, isActive !== undefined ? isActive : true, id]
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

app.delete('/api/services/:id', authenticateAdmin, async (req, res) => {
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

// Contact Messages API
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    // Validation
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ error: 'Gerekli alanlar eksik' });
    }

    const result = await pool.query(
      'INSERT INTO contact_messages (name, email, phone, subject, message) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [name, email, phone, subject, message]
    );

    res.status(201).json({
      id: result.rows[0].id,
      message: 'Mesajınız başarıyla gönderildi'
    });
  } catch (error) {
    console.error('Error saving contact message:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/admin/messages', authenticateAdmin, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    // Get total count
    const countResult = await pool.query('SELECT COUNT(*) FROM contact_messages');
    const totalCount = parseInt(countResult.rows[0].count);

    // Get messages with pagination
    const result = await pool.query(
      'SELECT * FROM contact_messages ORDER BY created_at DESC LIMIT $1 OFFSET $2',
      [limit, offset]
    );

    res.json({
      messages: result.rows.map(row => ({
        id: row.id,
        name: row.name,
        email: row.email,
        phone: row.phone,
        subject: row.subject,
        message: row.message,
        createdAt: row.created_at,
        readStatus: row.read_status,
        replyStatus: row.reply_status
      })),
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching contact messages:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.put('/api/admin/messages/:id/read', authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'UPDATE contact_messages SET read_status = TRUE WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Mesaj bulunamadı' });
    }

    res.json({ message: 'Mesaj okundu olarak işaretlendi' });
  } catch (error) {
    console.error('Error updating message read status:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.delete('/api/admin/messages/:id', authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query('DELETE FROM contact_messages WHERE id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Mesaj bulunamadı' });
    }

    res.status(204).send();
  } catch (error) {
    console.error('Error deleting contact message:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Navigation API endpoints
app.get('/api/navigation', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM navigation WHERE is_active = true ORDER BY order_position ASC'
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching navigation items:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/navigation', authenticateAdmin, async (req, res) => {
  try {
    const { name, href, order_position, is_active } = req.body;
    
    if (!name || !href) {
      return res.status(400).json({ error: 'Name and href are required' });
    }
    
    const result = await pool.query(
      'INSERT INTO navigation (name, href, order_position, is_active) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, href, order_position || 0, is_active !== undefined ? is_active : true]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating navigation item:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.put('/api/navigation/:id', authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, href, order_position, is_active } = req.body;
    
    // Only validate name and href if they are being updated
    if (name !== undefined && !name) {
      return res.status(400).json({ error: 'Name is required when updating' });
    }
    if (href !== undefined && !href) {
      return res.status(400).json({ error: 'Href is required when updating' });
    }
    
    // Build dynamic query based on what fields are being updated
    const updateFields = [];
    const values = [];
    let paramCount = 1;
    
    if (name !== undefined) {
      updateFields.push(`name = $${paramCount}`);
      values.push(name);
      paramCount++;
    }
    
    if (href !== undefined) {
      updateFields.push(`href = $${paramCount}`);
      values.push(href);
      paramCount++;
    }
    
    if (order_position !== undefined) {
      updateFields.push(`order_position = $${paramCount}`);
      values.push(order_position);
      paramCount++;
    }
    
    if (is_active !== undefined) {
      updateFields.push(`is_active = $${paramCount}`);
      values.push(is_active);
      paramCount++;
    }
    
    updateFields.push(`updated_at = NOW()`);
    values.push(id);
    
    const query = `UPDATE navigation SET ${updateFields.join(', ')} WHERE id = $${paramCount} RETURNING *`;
    
    const result = await pool.query(query, values);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Navigation item not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating navigation item:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.delete('/api/navigation/:id', authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await pool.query(
      'DELETE FROM navigation WHERE id = $1 RETURNING *',
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Navigation item not found' });
    }
    
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting navigation item:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Email Accounts Management API endpoints
app.get('/api/admin/email-accounts', authenticateAdmin, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT id, email, quota, used_mb, is_active, created_at, updated_at
      FROM email_accounts
      ORDER BY created_at DESC
    `);

    res.json(result.rows.map(row => ({
      id: row.id.toString(),
      email: row.email,
      quota: row.quota,
      usedMb: row.used_mb || 0,
      isActive: row.is_active,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    })));
  } catch (error) {
    console.error('Error fetching email accounts:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/admin/email-accounts', authenticateAdmin, async (req, res) => {
  try {
    const { email, password, quota, isActive } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ error: 'E-posta adresi ve şifre gereklidir' });
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Geçerli bir e-posta adresi giriniz' });
    }

    // Check if email already exists
    const existingEmail = await pool.query('SELECT id FROM email_accounts WHERE email = $1', [email]);
    if (existingEmail.rows.length > 0) {
      return res.status(400).json({ error: 'Bu e-posta adresi zaten kullanılıyor' });
    }

    // Hash password (in production, use proper password hashing)
    const hashedPassword = password; // Simplified for demo

    const result = await pool.query(
      'INSERT INTO email_accounts (email, password_hash, quota, used_mb, is_active) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [email, hashedPassword, quota || 1000, 0, isActive !== undefined ? isActive : true]
    );

    const account = result.rows[0];
    res.status(201).json({
      id: account.id.toString(),
      email: account.email,
      quota: account.quota,
      usedMb: account.used_mb || 0,
      isActive: account.is_active,
      createdAt: account.created_at,
      updatedAt: account.updated_at
    });
  } catch (error) {
    console.error('Error creating email account:', error);
    if (error.code === '23505') { // Unique constraint violation
      res.status(400).json({ error: 'Bu e-posta adresi zaten kullanılıyor' });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
});

app.put('/api/admin/email-accounts/:id', authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { password, quota, usedMb, isActive } = req.body;

    // Build dynamic update query
    const updateFields = [];
    const values = [];
    let paramCount = 1;

    if (password) {
      updateFields.push(`password_hash = $${paramCount}`);
      values.push(password); // In production, hash the password
      paramCount++;
    }

    if (quota !== undefined) {
      updateFields.push(`quota = $${paramCount}`);
      values.push(quota);
      paramCount++;
    }

    if (usedMb !== undefined) {
      updateFields.push(`used_mb = $${paramCount}`);
      values.push(usedMb);
      paramCount++;
    }

    if (isActive !== undefined) {
      updateFields.push(`is_active = $${paramCount}`);
      values.push(isActive);
      paramCount++;
    }

    if (updateFields.length === 0) {
      return res.status(400).json({ error: 'Güncellenecek alan belirtilmedi' });
    }

    updateFields.push(`updated_at = NOW()`);
    values.push(id);

    const query = `UPDATE email_accounts SET ${updateFields.join(', ')} WHERE id = $${paramCount} RETURNING *`;

    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'E-posta hesabı bulunamadı' });
    }

    const account = result.rows[0];
    res.json({
      id: account.id.toString(),
      email: account.email,
      quota: account.quota,
      usedMb: account.used_mb || 0,
      isActive: account.is_active,
      createdAt: account.created_at,
      updatedAt: account.updated_at
    });
  } catch (error) {
    console.error('Error updating email account:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.delete('/api/admin/email-accounts/:id', authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query('DELETE FROM email_accounts WHERE id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'E-posta hesabı bulunamadı' });
    }

    res.status(204).send();
  } catch (error) {
    console.error('Error deleting email account:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Endpoint to manually update email usage data
app.post('/api/admin/email-accounts/sync-usage', authenticateAdmin, async (req, res) => {
  try {
    const startTime = Date.now();
    await updateAllEmailUsage();
    const endTime = Date.now();

    // Return updated data
    const result = await pool.query(`
      SELECT id, email, quota, used_mb, is_active, created_at, updated_at
      FROM email_accounts
      ORDER BY created_at DESC
    `);

    res.json({
      message: 'Email usage data synchronized successfully',
      duration: `${endTime - startTime}ms`,
      accounts: result.rows.map(row => ({
        id: row.id.toString(),
        email: row.email,
        quota: row.quota,
        usedMb: row.used_mb || 0,
        isActive: row.is_active,
        createdAt: row.created_at,
        updatedAt: row.updated_at
      }))
    });
  } catch (error) {
    console.error('Error syncing email usage:', error);
    res.status(500).json({ error: 'Failed to sync email usage data' });
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

  // Update email usage data every 15 minutes
  setInterval(async () => {
    console.log('Running scheduled email usage update...');
    await updateAllEmailUsage();
  }, 15 * 60 * 1000); // 15 minutes

  // Initial update after server start
  setTimeout(async () => {
    console.log('Running initial email usage update...');
    await updateAllEmailUsage();
  }, 10000); // 10 seconds after server start
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
module.exports = {
  apps: [{
    name: 'letsshine-backend',
    script: 'server.js',
    cwd: '/var/www/letsshine.com.tr',
    instances: 1,
    exec_mode: 'fork',
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 3030
    },
    error_file: '/var/log/pm2/letsshine-error.log',
    out_file: '/var/log/pm2/letsshine-out.log',
    log_file: '/var/log/pm2/letsshine-combined.log',
    time: true
  }]
};
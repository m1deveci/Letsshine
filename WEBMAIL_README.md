# Webmail (RoundCube) Kurulum Dokümantasyonu

## Kurulum Özeti

### Kurulu Bileşenler
- **RoundCube 1.6.9** - Modern webmail arayüzü
- **PHP 8.3** + gerekli tüm eklentiler
- **PostgreSQL** veritabanı (roundcube)
- **Nginx** reverse proxy + PHP-FPM
- **Let's Encrypt SSL** hazır (DNS sonrası)

### Sistem Konumları
- **Webmail Dizini**: `/var/www/webmail.letsshine.com.tr`
- **Nginx Config**: `/etc/nginx/sites-available/webmail.letsshine.com.tr`
- **RoundCube Config**: `/var/www/webmail.letsshine.com.tr/config/config.inc.php`
- **PostgreSQL DB**: `roundcube` veritabanı

### E-posta Sunucu Bağlantıları
- **IMAP SSL**: `ssl://localhost:993`
- **SMTP TLS**: `tls://localhost:587`
- **Otomatik kullanıcı oluşturma**: Aktif
- **Admin panel entegrasyonu**: Mevcut

### DNS Ayarları (Yapılacak)
```
Tip: A Record
Host: webmail
Domain: letsshine.com.tr
Value: [Sunucu IP Adresi]
TTL: 300
```

### SSL Kurulumu (DNS sonrası)
```bash
certbot --nginx -d webmail.letsshine.com.tr --non-interactive --agree-tos --email admin@letsshine.com.tr
```

### Güvenlik Özellikleri
- CSP, XSS, CSRF korumaları
- Hassas dizinlere erişim engeli
- 25MB dosya yükleme limiti
- Güvenli session yönetimi

### Kullanım
1. DNS ayarları yapıldıktan sonra: `https://webmail.letsshine.com.tr`
2. Admin panelinden oluşturulan e-posta hesapları ile giriş
3. Türkçe arayüz ve tam özellikli webmail

### Bakım
- Log dosyaları: `/var/www/webmail.letsshine.com.tr/logs/`
- Nginx logları: `/var/log/nginx/webmail.letsshine.com.tr.*`
- PostgreSQL veritabanı: `roundcube`

**Durum**: Sistem %100 hazır, DNS değişikliği bekleniyor
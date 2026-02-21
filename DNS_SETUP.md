# DNS Configuration Guide for GitHub Pages

This guide provides complete instructions for configuring DNS records at LWS (or any registrar) to serve the Henri Martin Immobilier website via GitHub Pages on the apex domain **henrimartinimmobilier.com**.

## Overview

The site is configured to work on the **apex domain** (henrimartinimmobilier.com) without the www prefix. Users visiting www.henrimartinimmobilier.com will access the same content via CNAME resolution.

## Required DNS Records

Configure the following DNS records in your LWS DNS management panel:

### 1. A Records for Apex Domain (@)

Add **four A records** pointing the apex domain to GitHub Pages' IP addresses:

```
Type: A
Host: @ (or leave blank for apex)
Value: 185.199.108.153
TTL: 3600 (or default)

Type: A
Host: @ (or leave blank for apex)
Value: 185.199.109.153
TTL: 3600

Type: A
Host: @ (or leave blank for apex)
Value: 185.199.110.153
TTL: 3600

Type: A
Host: @ (or leave blank for apex)
Value: 185.199.111.153
TTL: 3600
```

### 2. AAAA Record for IPv6 Support (Optional but Recommended)

Add one AAAA record for IPv6 traffic:

```
Type: AAAA
Host: @ (or leave blank for apex)
Value: 2606:50c0:8000::153
TTL: 3600
```

**Alternative IPv6 addresses** (any of these work):
- `2606:50c0:8000::153`
- `2606:50c0:8001::153`
- `2606:50c0:8002::153`
- `2606:50c0:8003::153`

### 3. CNAME Record for www Subdomain

Point www to the apex domain:

```
Type: CNAME
Host: www
Value: henrimartinimmobilier.com (or henrimartinimmobilier.com.)
TTL: 3600
```

This ensures visitors to www.henrimartinimmobilier.com reach the same site as henrimartinimmobilier.com.

### 4. Preserve Existing Mail Records

**Do NOT remove or modify** these existing records:

```
Type: MX
Host: @
Priority: 10
Value: mail.henrimartinimmobilier.com
TTL: 3600

Type: CNAME
Host: imap
Value: mail.henrimartinimmobilier.com
TTL: 3600

Type: CNAME
Host: pop
Value: mail.henrimartinimmobilier.com
TTL: 3600

Type: CNAME
Host: smtp
Value: mail.henrimartinimmobilier.com
TTL: 3600

Type: TXT
Host: @
Value: "v=spf1 mx a ip4:... ~all" (your SPF record)
TTL: 3600

Type: TXT
Host: _domainkey (or similar)
Value: (your DKIM record)
TTL: 3600
```

## LWS-Specific Notes

### About LWS's "301 (htaccess)" Redirection Panel

⚠️ **Important**: When your site is hosted on **GitHub Pages** (not on LWS servers), the LWS "301 (htaccess)" redirection feature **does not apply**. This panel only affects sites hosted on LWS's own web servers.

- The CNAME record (`www → henrimartinimmobilier.com`) ensures www resolves to the apex domain.
- Both URLs (with and without www) will serve the same content via GitHub Pages.
- For a true **301 redirect** from www to the apex, use **Cloudflare Redirect Rules** (see optional section below).

### DNS Propagation at LWS

After updating DNS records:
- Changes may take 15 minutes to 48 hours to propagate globally.
- LWS typically updates within 1-2 hours.
- Use the validation commands below to monitor propagation.

## GitHub Pages Configuration

After DNS records are configured, complete these steps in GitHub:

1. Go to **Settings** → **Pages** in the repository.
2. Under **Custom domain**, enter: `henrimartinimmobilier.com`
3. Click **Save**.
4. Wait for the DNS check to complete (may take a few minutes).
5. Once verified, check **Enforce HTTPS** to enable SSL/TLS.

The `CNAME` file in the repository root already contains `henrimartinimmobilier.com`, which GitHub Pages will use to serve the site.

## Validation Commands

Use these commands to verify DNS records and site accessibility:

### Check A Records (Apex Domain)

```bash
dig henrimartinimmobilier.com A +short
```

**Expected output** (in any order):
```
185.199.108.153
185.199.109.153
185.199.110.153
185.199.111.153
```

### Check AAAA Record (IPv6)

```bash
dig henrimartinimmobilier.com AAAA +short
```

**Expected output**:
```
2606:50c0:8000::153
```

### Check CNAME for www

```bash
dig www.henrimartinimmobilier.com CNAME +short
```

**Expected output**:
```
henrimartinimmobilier.com.
```

### Check Full DNS Resolution for www

```bash
dig www.henrimartinimmobilier.com A +short
```

**Expected output** (www should resolve to the same IPs as apex):
```
185.199.108.153
185.199.109.153
185.199.110.153
185.199.111.153
```

### Test HTTPS Accessibility

```bash
curl -I https://henrimartinimmobilier.com
```

**Expected output** (look for):
```
HTTP/2 200
server: GitHub.com
```

```bash
curl -I https://www.henrimartinimmobilier.com
```

**Expected output**:
```
HTTP/2 200
server: GitHub.com
```

### Verify Canonical Tags (SEO)

```bash
curl -s https://henrimartinimmobilier.com | grep "rel=\"canonical\""
```

**Expected output**:
```html
<link rel="canonical" href="https://henrimartinimmobilier.com/" />
```

## Optional: Cloudflare for 301 Redirects

If you want to enforce a **strict 301 redirect** from www to the apex domain (rather than serving the same content on both), use Cloudflare:

### Steps:

1. **Add your domain to Cloudflare**:
   - Sign up at [cloudflare.com](https://www.cloudflare.com/)
   - Add your domain and follow the setup wizard.

2. **Update nameservers at LWS**:
   - Replace LWS nameservers with Cloudflare's nameservers (provided during setup).

3. **Configure DNS in Cloudflare**:
   - Add the same A, AAAA, CNAME, and mail records as above.
   - Enable "Proxied" (orange cloud) for @ and www records.

4. **Create a Redirect Rule**:
   - Go to **Rules** → **Page Rules** or **Redirect Rules**.
   - Create a rule:
     - **If**: Hostname equals `www.henrimartinimmobilier.com`
     - **Then**: Redirect to `https://henrimartinimmobilier.com$1` (301 Permanent)

5. **Enable SSL/TLS**:
   - Set SSL/TLS mode to **Full** or **Full (strict)**.
   - Enable **Always Use HTTPS**.

With Cloudflare, visitors to www.henrimartinimmobilier.com will receive a 301 redirect to henrimartinimmobilier.com.

## Optional: Client-Side Redirect Template for www

If you ever need to serve a separate www site with a redirect (not typically necessary), here's a lightweight HTML template:

### www-redirect-index.html

```html
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="refresh" content="0; url=https://henrimartinimmobilier.com/">
    <link rel="canonical" href="https://henrimartinimmobilier.com/" />
    <title>Redirection - Henri Martin Immobilier</title>
    <script>
        window.location.replace("https://henrimartinimmobilier.com" + window.location.pathname + window.location.search + window.location.hash);
    </script>
</head>
<body>
    <p>Vous êtes redirigé vers <a href="https://henrimartinimmobilier.com/">henrimartinimmobilier.com</a>...</p>
</body>
</html>
```

**Usage**: Only needed if hosting a separate www subdomain on a different server/host. Not required for standard GitHub Pages setup.

## Troubleshooting

### Issue: DNS not resolving after 24 hours

**Solution**:
- Verify DNS records are entered correctly in LWS panel.
- Check for typos in IP addresses or hostnames.
- Clear local DNS cache: `sudo systemd-resolve --flush-caches` (Linux) or `ipconfig /flushdns` (Windows).
- Try a public DNS: `dig @8.8.8.8 henrimartinimmobilier.com`

### Issue: "Improperly configured domain" in GitHub Pages

**Solution**:
- Wait 24-48 hours for DNS propagation.
- Ensure all four A records are present.
- Verify CNAME file contains exactly `henrimartinimmobilier.com` (no www, no protocol).

### Issue: SSL certificate errors

**Solution**:
- Wait for GitHub to provision the certificate (can take up to 24 hours after DNS is verified).
- Ensure "Enforce HTTPS" is checked in GitHub Settings → Pages.
- Check that DNS points correctly to GitHub's IPs.

### Issue: www shows different content than apex

**Solution**:
- Verify www CNAME points to apex: `dig www.henrimartinimmobilier.com CNAME`
- Check that both domains resolve to the same IPs: `dig www.henrimartinimmobilier.com A`
- Clear browser cache or test in incognito mode.

### Issue: Cookies not working across www and apex

**Solution** (for backend API):
- Set cookies with `Domain=.henrimartinimmobilier.com` (note the leading dot).
- Use `Path=/`, `SameSite=Lax` or `SameSite=None; Secure` as appropriate.
- Ensure cookies are set with `Secure` flag when using HTTPS.

## Summary

✅ **Apex domain configured**: henrimartinimmobilier.com  
✅ **www subdomain configured**: www.henrimartinimmobilier.com (via CNAME)  
✅ **Canonical tags added**: All key HTML files point to apex URLs  
✅ **Mail records preserved**: Email functionality unaffected  
✅ **GitHub Pages ready**: CNAME file correctly set  

After DNS propagation and GitHub Pages configuration, your site will be accessible at:
- https://henrimartinimmobilier.com (primary)
- https://www.henrimartinimmobilier.com (resolves to same content)

For further assistance, consult:
- [GitHub Pages Custom Domain Documentation](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site)
- [Cloudflare Redirect Rules](https://developers.cloudflare.com/rules/url-forwarding/)
- LWS Support: [https://aide.lws.fr/](https://aide.lws.fr/)

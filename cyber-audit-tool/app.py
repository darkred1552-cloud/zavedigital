#!/usr/bin/env python3
"""
Zave Digital — Cybersecurity Audit & Hardening Tool
Professional vulnerability scanner with PDF report generation
"""

import os
import re
import json
import uuid
import subprocess
import datetime
import ipaddress
from pathlib import Path
from flask import Flask, render_template, request, jsonify, send_file, redirect, url_for
from concurrent.futures import ThreadPoolExecutor, as_completed
import markdown2

app = Flask(__name__)
app.config['SECRET_KEY'] = 'zave-digital-cyber-audit-2026'
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024

BASE_DIR = Path(__file__).parent
REPORTS_DIR = BASE_DIR / 'reports'
SCANS_DIR = BASE_DIR / 'scans'
REPORTS_DIR.mkdir(exist_ok=True)
SCANS_DIR.mkdir(exist_ok=True)

# ─── Helpers ────────────────────────────────────────────────

def is_valid_target(target):
    """Validate IP, domain, or URL"""
    target = target.strip()
    # Remove protocol if present
    clean = re.sub(r'^https?://', '', target).rstrip('/').split('/')[0].split(':')[0]
    # Check if valid IP
    try:
        ipaddress.ip_address(clean)
        return clean
    except ValueError:
        pass
    # Check if valid domain
    if re.match(r'^[a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z]{2,})+$', clean):
        return clean
    # Check if valid IP range (CIDR)
    try:
        ipaddress.ip_network(clean, strict=False)
        return clean
    except ValueError:
        pass
    return None

def run_cmd(cmd, timeout=300):
    """Run shell command safely"""
    try:
        result = subprocess.run(
            cmd, shell=True, capture_output=True, text=True,
            timeout=timeout, errors='replace'
        )
        return {
            'stdout': result.stdout,
            'stderr': result.stderr,
            'returncode': result.returncode
        }
    except subprocess.TimeoutExpired:
        return {'stdout': '', 'stderr': 'Scan timed out', 'returncode': -1}
    except Exception as e:
        return {'stdout': '', 'stderr': str(e), 'returncode': -1}

def parse_nmap_ports(nmap_output):
    """Parse open ports from nmap output"""
    ports = []
    for line in nmap_output.split('\n'):
        match = re.match(r'(\d+)/(tcp|udp)\s+(\S+)\s+(\S+)(.*)', line)
        if match:
            ports.append({
                'port': match.group(1),
                'protocol': match.group(2),
                'state': match.group(3),
                'service': match.group(4),
                'version': match.group(5).strip() if match.group(5).strip() else 'Unknown'
            })
    return ports

def parse_nmap_vulns(nmap_output):
    """Parse vulnerability findings from nmap scripts"""
    vulns = []
    current_vuln = None
    for line in nmap_output.split('\n'):
        if '|' in line and ('VULNERABLE' in line or 'CVE' in line or 'State:' in line):
            parts = line.split('|')
            for part in parts:
                part = part.strip()
                if 'VULNERABLE' in part:
                    vulns.append({
                        'title': part[:120],
                        'severity': 'HIGH',
                        'description': part,
                        'recommendation': 'Update/patch the affected software immediately.'
                    })
                elif 'CVE-' in part:
                    cve = re.search(r'CVE-\d{4}-\d+', part)
                    if cve:
                        vulns.append({
                            'title': cve.group(),
                            'severity': 'HIGH',
                            'description': part.strip()[:200],
                            'recommendation': 'Check vendor advisory and apply patches.'
                        })
    return vulns

def parse_nikto(nikto_output):
    """Parse Nikto findings"""
    findings = []
    for line in nikto_output.split('\n'):
        if line.startswith('+ ') and 'Target' not in line and 'Start' not in line:
            text = line[2:].strip()
            if text and len(text) > 5:
                severity = 'INFO'
                if any(w in text.lower() for w in ['xss', 'sql', 'injection', 'rce', 'command']):
                    severity = 'CRITICAL'
                elif any(w in text.lower() for w in ['vulnerab', 'exploit', 'cve']):
                    severity = 'HIGH'
                elif any(w in text.lower() for w in ['disclosure', 'exposed', 'leak']):
                    severity = 'MEDIUM'
                findings.append({
                    'title': text[:150],
                    'severity': severity,
                    'description': text,
                    'recommendation': 'Review and remediate this finding.'
                })
    return findings

def parse_whatweb(whatweb_output):
    """Parse WhatWeb technology detection"""
    techs = []
    for line in whatweb_output.split('\n'):
        if line.strip() and not line.startswith('WhatWeb'):
            techs.append(line.strip())
    return techs

def get_severity_score(findings):
    """Calculate overall risk score 0-10"""
    score = 0
    for f in findings:
        sev = f.get('severity', 'INFO')
        if sev == 'CRITICAL': score += 3
        elif sev == 'HIGH': score += 2
        elif sev == 'MEDIUM': score += 1
        elif sev == 'LOW': score += 0.5
    return min(10, round(score, 1))

def get_risk_level(score):
    if score >= 7: return 'CRITICAL'
    elif score >= 5: return 'HIGH'
    elif score >= 3: return 'MEDIUM'
    elif score >= 1: return 'LOW'
    return 'MINIMAL'

# ─── Scanning Functions ─────────────────────────────────────

def scan_port_scan(target):
    """Quick port scan"""
    print(f"[SCAN] Port scan: {target}")
    result = run_cmd(f"nmap -sS -sV -O --top-ports 100 -T4 --open {target}", timeout=180)
    return {
        'type': 'Port Scan & Service Detection',
        'tool': 'Nmap',
        'output': result['stdout'],
        'ports': parse_nmap_ports(result['stdout']),
        'raw': result['stdout']
    }

def scan_vuln_nmap(target):
    """Nmap vulnerability scripts"""
    print(f"[SCAN] Vuln scan: {target}")
    result = run_cmd(f"nmap -sV --script=vulners,vuln -T4 --open {target}", timeout=300)
    return {
        'type': 'Vulnerability Scan',
        'tool': 'Nmap NSE (vulners)',
        'output': result['stdout'],
        'vulns': parse_nmap_vulns(result['stdout']),
        'raw': result['stdout']
    }

def scan_nikto(target):
    """Nikto web vulnerability scan"""
    print(f"[SCAN] Nikto: {target}")
    # Only run if web port is likely open
    clean = re.sub(r'^https?://', '', target).rstrip('/')
    result = run_cmd(f"nikto -h {clean} -Tuning 123bde -timeout 10 -maxtime 120m -Format txt 2>&1 | head -200", timeout=300)
    return {
        'type': 'Web Vulnerability Scan',
        'tool': 'Nikto',
        'output': result['stdout'],
        'findings': parse_nikto(result['stdout']),
        'raw': result['stdout']
    }

def scan_tech_detect(target):
    """Technology detection"""
    print(f"[SCAN] Tech detect: {target}")
    clean = re.sub(r'^https?://', '', target).rstrip('/')
    result = run_cmd(f"whatweb -v -a 3 {clean} 2>&1", timeout=60)
    return {
        'type': 'Technology Detection',
        'tool': 'WhatWeb',
        'output': result['stdout'],
        'technologies': parse_whatweb(result['stdout']),
        'raw': result['stdout']
    }

def scan_ssl(target):
    """SSL/TLS check"""
    print(f"[SCAN] SSL: {target}")
    clean = re.sub(r'^https?://', '', target).rstrip('/').split('/')[0]
    # Check if testssl.sh is available
    result = run_cmd(f"echo | openssl s_client -connect {clean}:443 -servername {clean} 2>&1 | head -50", timeout=30)
    ssl_info = result['stdout']
    findings = []
    if 'SSLv3' in ssl_info or 'TLSv1.0' in ssl_info or 'TLSv1.1' in ssl_info:
        findings.append({
            'title': 'Outdated TLS/SSL Protocol Detected',
            'severity': 'HIGH',
            'description': 'Server supports outdated SSL/TLS protocols (SSLv3, TLS 1.0, or TLS 1.1)',
            'recommendation': 'Disable SSLv3, TLS 1.0, and TLS 1.1. Enable only TLS 1.2 and TLS 1.3.'
        })
    if 'expired' in ssl_info.lower():
        findings.append({
            'title': 'SSL Certificate Expired',
            'severity': 'HIGH',
            'description': 'The SSL certificate has expired',
            'recommendation': 'Renew SSL certificate immediately.'
        })
    if 'self-signed' in ssl_info.lower():
        findings.append({
            'title': 'Self-Signed SSL Certificate',
            'severity': 'MEDIUM',
            'description': 'Server is using a self-signed certificate',
            'recommendation': 'Use a certificate from a trusted CA (Let\'s Encrypt is free).'
        })
    return {
        'type': 'SSL/TLS Security Check',
        'tool': 'OpenSSL',
        'output': ssl_info,
        'findings': findings,
        'raw': ssl_info
    }

def scan_dns(target):
    """DNS enumeration"""
    print(f"[SCAN] DNS: {target}")
    clean = re.sub(r'^https?://', '', target).rstrip('/').split('/')[0].split(':')[0]
    result = run_cmd(f"dig +short {clean} ANY 2>&1; echo '---'; dig +short MX {clean} 2>&1; echo '---'; dig +short TXT {clean} 2>&1; echo '---'; whois {clean} 2>&1 | head -30", timeout=30)
    return {
        'type': 'DNS Enumeration',
        'tool': 'Dig / Whois',
        'output': result['stdout'],
        'raw': result['stdout']
    }

def scan_firewall(target):
    """Firewall/IDS detection"""
    print(f"[SCAN] Firewall: {target}")
    result = run_cmd(f"nmap -sA -T4 --top-ports 20 {target}", timeout=60)
    findings = []
    open_count = result['stdout'].count('unfiltered')
    if open_count > 15:
        findings.append({
            'title': 'No Firewall Detected',
            'severity': 'HIGH',
            'description': f'{open_count} ports appear unfiltered — no firewall may be in place',
            'recommendation': 'Install and configure a firewall (iptables/ufw on Linux, Windows Firewall on Windows).'
        })
    return {
        'type': 'Firewall Detection',
        'tool': 'Nmap (ACK scan)',
        'output': result['stdout'],
        'findings': findings,
        'raw': result['stdout']
    }

# ─── Report Generation ──────────────────────────────────────

def generate_html_report(scan_data, report_id):
    """Generate professional HTML report"""
    findings = scan_data.get('all_findings', [])
    ports = scan_data.get('ports', [])
    techs = scan_data.get('technologies', [])
    score = scan_data.get('risk_score', 0)
    risk_level = scan_data.get('risk_level', 'UNKNOWN')
    target = scan_data.get('target', 'Unknown')
    scan_time = scan_data.get('scan_time', datetime.datetime.now().isoformat())
    duration = scan_data.get('duration', 'N/A')

    # Severity colors
    sev_colors = {
        'CRITICAL': '#dc2626',
        'HIGH': '#ea580c',
        'MEDIUM': '#d97706',
        'LOW': '#65a30d',
        'INFO': '#2563eb'
    }

    risk_colors = {
        'CRITICAL': '#dc2626',
        'HIGH': '#ea580c',
        'MEDIUM': '#d97706',
        'LOW': '#65a30d',
        'MINIMAL': '#16a34a'
    }

    # Count by severity
    sev_counts = {}
    for f in findings:
        s = f.get('severity', 'INFO')
        sev_counts[s] = sev_counts.get(s, 0) + 1

    findings_html = ''
    for i, f in enumerate(findings, 1):
        color = sev_colors.get(f.get('severity', 'INFO'), '#6b7280')
        findings_html += f'''
        <div class="finding" style="border-left: 4px solid {color}">
            <div class="finding-header">
                <span class="finding-num">#{i}</span>
                <span class="sev-badge" style="background:{color}">{f.get('severity','INFO')}</span>
                <span class="finding-title">{f.get('title','Unknown')}</span>
            </div>
            <p class="finding-desc">{f.get('description','')}</p>
            <div class="recommendation">
                <strong>💡 Recommendation:</strong> {f.get('recommendation','Review and remediate.')}
            </div>
        </div>'''

    if not findings:
        findings_html = '<div class="no-findings">✅ No significant vulnerabilities detected. System appears secure.</div>'

    ports_html = ''
    for p in ports:
        ports_html += f'''
        <tr>
            <td>{p['port']}/{p['protocol']}</td>
            <td>{p['state']}</td>
            <td>{p['service']}</td>
            <td>{p['version']}</td>
        </tr>'''

    techs_html = ''
    for t in techs:
        techs_html += f'<span class="tech-tag">{t}</span>'

    html = f'''<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Cybersecurity Audit Report — {target}</title>
<style>
* {{ margin:0; padding:0; box-sizing:border-box; }}
body {{ font-family: 'Segoe UI', system-ui, sans-serif; background:#0a0a1a; color:#e2e8f0; line-height:1.6; }}
.container {{ max-width:900px; margin:0 auto; padding:20px; }}
.header {{ background: linear-gradient(135deg, #1e1b4b, #312e81); border-radius:16px; padding:40px; margin-bottom:24px; text-align:center; border:1px solid #4338ca; }}
.header h1 {{ font-size:28px; color:#fff; margin-bottom:8px; }}
.header .subtitle {{ color:#a5b4fc; font-size:14px; }}
.header .report-id {{ color:#6366f1; font-size:12px; margin-top:8px; }}
.score-card {{ background:linear-gradient(135deg, #1e1b4b, #111827); border-radius:16px; padding:30px; margin-bottom:24px; border:1px solid #374151; text-align:center; }}
.score-circle {{ width:120px; height:120px; border-radius:50%; background:conic-gradient({risk_colors.get(risk_level,'#6b7280')} {score*10}%, #1f2937 {score*10}%); display:flex; align-items:center; justify-content:center; margin:0 auto 16px; position:relative; }}
.score-inner {{ width:90px; height:90px; border-radius:50%; background:#111827; display:flex; flex-direction:column; align-items:center; justify-content:center; }}
.score-num {{ font-size:32px; font-weight:800; color:{risk_colors.get(risk_level,'#6b7280')}; }}
.score-label {{ font-size:10px; color:#9ca3af; text-transform:uppercase; }}
.risk-level {{ font-size:24px; font-weight:700; color:{risk_colors.get(risk_level,'#6b7280')}; margin-top:8px; }}
.section {{ background:#111827; border-radius:12px; padding:24px; margin-bottom:20px; border:1px solid #1f2937; }}
.section h2 {{ color:#a5b4fc; font-size:18px; margin-bottom:16px; padding-bottom:8px; border-bottom:1px solid #1f2937; }}
.info-grid {{ display:grid; grid-template-columns:1fr 1fr; gap:12px; }}
.info-item {{ background:#0a0a1a; padding:12px; border-radius:8px; }}
.info-item label {{ color:#6b7280; font-size:11px; text-transform:uppercase; display:block; margin-bottom:4px; }}
.info-item span {{ color:#e2e8f0; font-size:14px; }}
.sev-summary {{ display:flex; gap:12px; flex-wrap:wrap; margin-bottom:20px; }}
.sev-box {{ flex:1; min-width:100px; text-align:center; padding:16px; border-radius:10px; background:#0a0a1a; border:1px solid #1f2937; }}
.sev-box .count {{ font-size:28px; font-weight:800; }}
.sev-box .label {{ font-size:11px; text-transform:uppercase; color:#9ca3af; }}
.finding {{ background:#0a0a1a; border-radius:10px; padding:16px; margin-bottom:12px; }}
.finding-header {{ display:flex; align-items:center; gap:8px; margin-bottom:8px; flex-wrap:wrap; }}
.finding-num {{ color:#6b7280; font-size:12px; }}
.sev-badge {{ padding:2px 10px; border-radius:20px; font-size:11px; font-weight:700; color:#fff; }}
.finding-title {{ font-weight:600; color:#e2e8f0; flex:1; }}
.finding-desc {{ color:#9ca3af; font-size:13px; margin-bottom:8px; }}
.recommendation {{ background:#0c1222; padding:10px 14px; border-radius:8px; font-size:13px; color:#86efac; border-left:3px solid #16a34a; }}
.no-findings {{ text-align:center; padding:40px; color:#16a34a; font-size:16px; }}
table {{ width:100%; border-collapse:collapse; }}
th {{ text-align:left; padding:10px; color:#6b7280; font-size:11px; text-transform:uppercase; border-bottom:1px solid #1f2937; }}
td {{ padding:10px; border-bottom:1px solid #0a0a1a; font-size:13px; }}
.tech-tag {{ display:inline-block; background:#1e1b4b; color:#a5b4fc; padding:4px 12px; border-radius:20px; font-size:12px; margin:3px; }}
.footer {{ text-align:center; padding:20px; color:#4b5563; font-size:12px; border-top:1px solid #1f2937; margin-top:20px; }}
@media print {{ body {{ background:#fff; color:#000; }} .section {{ border:1px solid #ddd; page-break-inside:avoid; }} }}
</style>
</head>
<body>
<div class="container">
    <div class="header">
        <h1>🛡️ Cybersecurity Audit Report</h1>
        <div class="subtitle">Professional Vulnerability Assessment & Security Hardening Report</div>
        <div class="report-id">Report ID: {report_id} | Generated: {scan_time}</div>
    </div>

    <div class="score-card">
        <div class="score-circle">
            <div class="score-inner">
                <div class="score-num">{score}</div>
                <div class="score-label">/ 10</div>
            </div>
        </div>
        <div class="risk-level">Risk Level: {risk_level}</div>
    </div>

    <div class="section">
        <h2>📋 Scan Information</h2>
        <div class="info-grid">
            <div class="info-item"><label>Target</label><span>{target}</span></div>
            <div class="info-item"><label>Scan Date</label><span>{scan_time}</span></div>
            <div class="info-item"><label>Duration</label><span>{duration}</span></div>
            <div class="info-item"><label>Total Findings</label><span>{len(findings)}</span></div>
            <div class="info-item"><label>Open Ports</label><span>{len(ports)}</span></div>
            <div class="info-item"><label>Technologies Detected</label><span>{len(techs)}</span></div>
        </div>
    </div>

    <div class="section">
        <h2>📊 Severity Summary</h2>
        <div class="sev-summary">
            <div class="sev-box"><div class="count" style="color:#dc2626">{sev_counts.get('CRITICAL',0)}</div><div class="label">Critical</div></div>
            <div class="sev-box"><div class="count" style="color:#ea580c">{sev_counts.get('HIGH',0)}</div><div class="label">High</div></div>
            <div class="sev-box"><div class="count" style="color:#d97706">{sev_counts.get('MEDIUM',0)}</div><div class="label">Medium</div></div>
            <div class="sev-box"><div class="count" style="color:#65a30d">{sev_counts.get('LOW',0)}</div><div class="label">Low</div></div>
            <div class="sev-box"><div class="count" style="color:#2563eb">{sev_counts.get('INFO',0)}</div><div class="label">Info</div></div>
        </div>
    </div>

    <div class="section">
        <h2>🔍 Vulnerability Findings ({len(findings)})</h2>
        {findings_html}
    </div>

    <div class="section">
        <h2>🌐 Open Ports & Services ({len(ports)})</h2>
        <table>
            <tr><th>Port</th><th>State</th><th>Service</th><th>Version</th></tr>
            {ports_html if ports_html else '<tr><td colspan="4" style="text-align:center;color:#6b7280">No open ports detected</td></tr>'}
        </table>
    </div>

    <div class="section">
        <h2>⚙️ Detected Technologies</h2>
        <div>{techs_html if techs_html else '<span style="color:#6b7280">No technologies detected</span>'}</div>
    </div>

    <div class="section">
        <h2>🔒 Security Recommendations</h2>
        <div class="finding" style="border-left:4px solid #16a34a">
            <div class="recommendation" style="border-left-color:#16a34a">
                <strong>1. Patch Management:</strong> Keep all software, OS, and services updated with latest security patches.
            </div>
        </div>
        <div class="finding" style="border-left:4px solid #16a34a">
            <div class="recommendation" style="border-left-color:#16a34a">
                <strong>2. Firewall Configuration:</strong> Enable and properly configure firewall. Only allow necessary ports.
            </div>
        </div>
        <div class="finding" style="border-left:4px solid #16a34a">
            <div class="recommendation" style="border-left-color:#16a34a">
                <strong>3. SSL/TLS Hardening:</strong> Use TLS 1.2+ only. Disable weak ciphers. Use valid certificates.
            </div>
        </div>
        <div class="finding" style="border-left:4px solid #16a34a">
            <div class="recommendation" style="border-left-color:#16a34a">
                <strong>4. Access Control:</strong> Implement strong passwords, 2FA, and principle of least privilege.
            </div>
        </div>
        <div class="finding" style="border-left:4px solid #16a34a">
            <div class="recommendation" style="border-left-color:#16a34a">
                <strong>5. Regular Audits:</strong> Conduct security audits quarterly. Monitor logs for suspicious activity.
            </div>
        </div>
    </div>

    <div class="footer">
        <p>🛡️ Generated by <strong>Zave Digital</strong> — Cybersecurity Audit & Hardening Tool</p>
        <p>This report is confidential and intended for the target organization only.</p>
        <p>© 2026 Zave Digital | Malakwal, Punjab, Pakistan</p>
    </div>
</div>
</body>
</html>'''

    report_path = REPORTS_DIR / f"{report_id}.html"
    report_path.write_text(html, encoding='utf-8')
    return str(report_path)

def generate_pdf_report(html_path, report_id):
    """Generate PDF from HTML using WeasyPrint"""
    try:
        import weasyprint
        pdf_path = REPORTS_DIR / f"{report_id}.pdf"
        weasyprint.HTML(filename=html_path).write_pdf(str(pdf_path))
        return str(pdf_path)
    except Exception as e:
        print(f"[PDF ERROR] {e}")
        return None

# ─── Routes ─────────────────────────────────────────────────

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/scan', methods=['POST'])
def start_scan():
    target = request.form.get('target', '').strip()
    scan_type = request.form.get('scan_type', 'full')

    if not target:
        return jsonify({'error': 'Please enter a target IP, domain, or URL'}), 400

    valid_target = is_valid_target(target)
    if not valid_target:
        return jsonify({'error': 'Invalid target. Enter a valid IP, domain, or URL.'}), 400

    report_id = str(uuid.uuid4())[:8].upper()
    scan_start = datetime.datetime.now()

    # Run scans based on type
    all_findings = []
    all_ports = []
    all_techs = []
    scan_results = {}

    if scan_type == 'quick':
        # Quick scan: port scan + tech detect
        with ThreadPoolExecutor(max_workers=3) as ex:
            futures = {
                ex.submit(scan_port_scan, valid_target): 'port_scan',
                ex.submit(scan_tech_detect, valid_target): 'tech_detect',
                ex.submit(scan_firewall, valid_target): 'firewall',
            }
            for future in as_completed(futures):
                name = futures[future]
                try:
                    result = future.result()
                    scan_results[name] = result
                    if 'ports' in result:
                        all_ports.extend(result['ports'])
                    if 'findings' in result:
                        all_findings.extend(result['findings'])
                    if 'vulns' in result:
                        all_findings.extend(result['vulns'])
                    if 'technologies' in result:
                        all_techs.extend(result['technologies'])
                except Exception as e:
                    scan_results[name] = {'error': str(e)}

    elif scan_type == 'web':
        # Web-focused scan
        with ThreadPoolExecutor(max_workers=4) as ex:
            futures = {
                ex.submit(scan_port_scan, valid_target): 'port_scan',
                ex.submit(scan_nikto, valid_target): 'nikto',
                ex.submit(scan_tech_detect, valid_target): 'tech_detect',
                ex.submit(scan_ssl, valid_target): 'ssl',
            }
            for future in as_completed(futures):
                name = futures[future]
                try:
                    result = future.result()
                    scan_results[name] = result
                    if 'ports' in result:
                        all_ports.extend(result['ports'])
                    if 'findings' in result:
                        all_findings.extend(result['findings'])
                    if 'vulns' in result:
                        all_findings.extend(result['vulns'])
                    if 'technologies' in result:
                        all_techs.extend(result['technologies'])
                except Exception as e:
                    scan_results[name] = {'error': str(e)}

    else:  # full scan
        with ThreadPoolExecutor(max_workers=5) as ex:
            futures = {
                ex.submit(scan_port_scan, valid_target): 'port_scan',
                ex.submit(scan_vuln_nmap, valid_target): 'vuln_scan',
                ex.submit(scan_nikto, valid_target): 'nikto',
                ex.submit(scan_tech_detect, valid_target): 'tech_detect',
                ex.submit(scan_ssl, valid_target): 'ssl',
                ex.submit(scan_firewall, valid_target): 'firewall',
                ex.submit(scan_dns, valid_target): 'dns',
            }
            for future in as_completed(futures):
                name = futures[future]
                try:
                    result = future.result()
                    scan_results[name] = result
                    if 'ports' in result:
                        all_ports.extend(result['ports'])
                    if 'findings' in result:
                        all_findings.extend(result['findings'])
                    if 'vulns' in result:
                        all_findings.extend(result['vulns'])
                    if 'technologies' in result:
                        all_techs.extend(result['technologies'])
                except Exception as e:
                    scan_results[name] = {'error': str(e)}

    scan_end = datetime.datetime.now()
    duration = str(scan_end - scan_start).split('.')[0]

    # Deduplicate findings
    seen = set()
    unique_findings = []
    for f in all_findings:
        key = f.get('title', '')[:80]
        if key not in seen:
            seen.add(key)
            unique_findings.append(f)

    # Calculate risk
    risk_score = get_severity_score(unique_findings)
    risk_level = get_risk_level(risk_score)

    # Compile scan data
    scan_data = {
        'report_id': report_id,
        'target': valid_target,
        'scan_type': scan_type,
        'scan_time': scan_end.strftime('%Y-%m-%d %H:%M:%S'),
        'duration': duration,
        'all_findings': unique_findings,
        'ports': all_ports,
        'technologies': all_techs,
        'risk_score': risk_score,
        'risk_level': risk_level,
        'scan_results': scan_results,
    }

    # Save scan data
    scan_file = SCANS_DIR / f"{report_id}.json"
    # Convert to serializable
    serializable = {k: v for k, v in scan_data.items() if k != 'scan_results'}
    serializable['scan_results'] = {k: {'type': v.get('type',''), 'tool': v.get('tool','')} for k, v in scan_results.items()}
    scan_file.write_text(json.dumps(serializable, indent=2, default=str))

    # Generate HTML report
    html_path = generate_html_report(scan_data, report_id)

    # Generate PDF
    pdf_path = generate_pdf_report(html_path, report_id)

    return jsonify({
        'success': True,
        'report_id': report_id,
        'target': valid_target,
        'findings_count': len(unique_findings),
        'risk_score': risk_score,
        'risk_level': risk_level,
        'duration': duration,
        'html_url': f'/report/{report_id}',
        'pdf_url': f'/report/{report_id}/pdf' if pdf_path else None,
    })

@app.route('/report/<report_id>')
def view_report(report_id):
    html_path = REPORTS_DIR / f"{report_id}.html"
    if html_path.exists():
        return html_path.read_text(encoding='utf-8')
    return "Report not found", 404

@app.route('/report/<report_id>/pdf')
def download_pdf(report_id):
    pdf_path = REPORTS_DIR / f"{report_id}.pdf"
    if pdf_path.exists():
        return send_file(pdf_path, as_attachment=True, download_name=f"cyber-audit-{report_id}.pdf")
    # Generate on-the-fly
    html_path = REPORTS_DIR / f"{report_id}.html"
    if html_path.exists():
        pdf_path = generate_pdf_report(str(html_path), report_id)
        if pdf_path:
            return send_file(pdf_path, as_attachment=True, download_name=f"cyber-audit-{report_id}.pdf")
    return "PDF not available", 404

@app.route('/history')
def scan_history():
    scans = []
    for f in sorted(SCANS_DIR.glob('*.json'), reverse=True)[:20]:
        try:
            data = json.loads(f.read_text())
            scans.append({
                'report_id': data.get('report_id', ''),
                'target': data.get('target', ''),
                'scan_time': data.get('scan_time', ''),
                'risk_level': data.get('risk_level', ''),
                'risk_score': data.get('risk_score', 0),
                'findings_count': len(data.get('all_findings', [])),
            })
        except:
            pass
    return render_template('history.html', scans=scans)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=7777, debug=False)

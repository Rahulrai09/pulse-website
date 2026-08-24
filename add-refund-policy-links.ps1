# add-refund-policy-links.ps1
# Run from repo root: C:\Users\DELL\Desktop\pulse-website
# 1. Adds a <url> entry for refund-return-policy.html to sitemap.xml (right after privacy-policy.html)
# 2. Adds a footer link to refund-return-policy.html (right after Cookie Policy) in js/footer.js

$repoRoot = "C:\Users\DELL\Desktop\pulse-website"

# --- 1. sitemap.xml ---
$sitemapPath = Join-Path $repoRoot "sitemap.xml"
$sitemapText = [System.IO.File]::ReadAllText($sitemapPath)

$anchor = @"
  <url>
    <loc>https://www.pulseio.in/privacy-policy.html</loc>
    <lastmod>2026-06-22</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
"@

$newEntry = $anchor + "`r`n  <url>`r`n    <loc>https://www.pulseio.in/refund-return-policy.html</loc>`r`n    <lastmod>2026-08-20</lastmod>`r`n    <changefreq>monthly</changefreq>`r`n    <priority>0.8</priority>`r`n  </url>"

if ($sitemapText.Contains($anchor)) {
    $sitemapText = $sitemapText.Replace($anchor, $newEntry)
    [System.IO.File]::WriteAllText($sitemapPath, $sitemapText)
    Write-Host "sitemap.xml: added refund-return-policy.html entry"
} else {
    Write-Host "sitemap.xml: ANCHOR NOT FOUND, skipped" -ForegroundColor Yellow
}

# --- 2. js/footer.js ---
$footerPath = Join-Path $repoRoot "js\footer.js"
$footerText = [System.IO.File]::ReadAllText($footerPath)

$oldLine = '<a href="/privacy-policy.html#cookies">Cookie Policy</a>'
$newLine = '<a href="/privacy-policy.html#cookies">Cookie Policy</a>' + "`r`n            " + '<a href="/refund-return-policy.html">Refund & Return Policy</a>'

if ($footerText.Contains($oldLine)) {
    $footerText = $footerText.Replace($oldLine, $newLine)
    [System.IO.File]::WriteAllText($footerPath, $footerText)
    Write-Host "js/footer.js: added Refund & Return Policy link"
} else {
    Write-Host "js/footer.js: ANCHOR NOT FOUND, skipped" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Done. Review with: git diff sitemap.xml js/footer.js"

$repoRoot = "C:\Users\DELL\Desktop\pulse-website"
cd $repoRoot

$slugs = @(
    "motion-pro-1",
    "motion-pro-2",
    "aerodrive-1",
    "aerodrive-2",
    "joylite-1",
    "joylite-2",
    "smartride-1",
    "smartride-2",
    "cruza",
    "innovax",
    "xtrion"
)

$path = Join-Path $repoRoot "sitemap.xml"
$content = [System.IO.File]::ReadAllText($path)

$anchor = @"
    <loc>https://www.pulseio.in/rehabilitation.html</loc>
    <lastmod>2026-06-22</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
"@

$newEntries = ""
foreach ($slug in $slugs) {
    $newEntries += @"

  <url>
    <loc>https://www.pulseio.in/rehabilitation/$slug/</loc>
    <lastmod>2026-07-29</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
"@
}

if ($content -notmatch [regex]::Escape($anchor)) {
    Write-Host "ANCHOR NOT FOUND - stopping without changes" -ForegroundColor Red
} else {
    $content = $content.Replace($anchor, $anchor + $newEntries)
    [System.IO.File]::WriteAllText($path, $content)
    Write-Host "Added 11 Rehabilitation product entries to sitemap.xml" -ForegroundColor Green
}

Write-Host ""
Write-Host "=== Verification ==="
Select-String -Path $path -Pattern "rehabilitation"

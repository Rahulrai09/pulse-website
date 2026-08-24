# prep-deletion-news-ourpeople.ps1
# Run from repo root: C:\Users\DELL\Desktop\pulse-website
# Step 1 of 2: Adds 301 redirects to vercel.json, removes sitemap.xml entries.
# Does NOT delete news.html / our-people.html yet - that's a separate git rm step after you review this diff.

$repoRoot = "C:\Users\DELL\Desktop\pulse-website"

# --- 1. vercel.json: insert two redirects right after "redirects": [ ---
$vercelPath = Join-Path $repoRoot "vercel.json"
$vercelText = [System.IO.File]::ReadAllText($vercelPath)

$anchor = '"redirects": ['
$newRedirects = '"redirects": [
    {
      "source": "/news.html",
      "destination": "/articles-blogs.html",
      "permanent": true
    },
    {
      "source": "/our-people.html",
      "destination": "/life-at-pulse.html",
      "permanent": true
    },'

if ($vercelText.Contains($anchor)) {
    # Only replace the FIRST occurrence (the array opener)
    $idx = $vercelText.IndexOf($anchor)
    $vercelText = $vercelText.Substring(0, $idx) + $newRedirects + $vercelText.Substring($idx + $anchor.Length)
    [System.IO.File]::WriteAllText($vercelPath, $vercelText)
    Write-Host "vercel.json: added redirects for /news.html and /our-people.html"
} else {
    Write-Host "vercel.json: anchor not found, no changes made" -ForegroundColor Yellow
}

# --- 2. sitemap.xml: remove the two <url>...</url> blocks ---
$sitemapPath = Join-Path $repoRoot "sitemap.xml"
$sitemapText = [System.IO.File]::ReadAllText($sitemapPath)

$targets = @("news.html", "our-people.html")
foreach ($target in $targets) {
    $pattern = '(?s)\s*<url>\s*<loc>https://www\.pulseio\.in/' + [regex]::Escape($target) + '</loc>.*?</url>'
    $match = [regex]::Match($sitemapText, $pattern)
    if ($match.Success) {
        $sitemapText = $sitemapText.Remove($match.Index, $match.Length)
        Write-Host "sitemap.xml: removed entry for $target"
    } else {
        Write-Host "sitemap.xml: entry for $target not found (pattern mismatch)" -ForegroundColor Yellow
    }
}
[System.IO.File]::WriteAllText($sitemapPath, $sitemapText)

Write-Host ""
Write-Host "Done. Review with: git diff vercel.json sitemap.xml"
Write-Host "Once reviewed, delete the actual pages with:"
Write-Host '  git rm "news.html" "our-people.html"'

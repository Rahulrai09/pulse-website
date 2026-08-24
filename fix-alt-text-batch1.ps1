# fix-alt-text-batch1.ps1
# Run from repo root: C:\Users\DELL\Desktop\pulse-website
# Adds alt text to 10 confirmed images in index.html and news.html
# (Excludes the 2 decorative cf-reflection duplicates, which correctly use alt="")

$repoRoot = "C:\Users\DELL\Desktop\pulse-website"

# --- index.html ---
$indexPath = Join-Path $repoRoot "index.html"
$indexText = [System.IO.File]::ReadAllText($indexPath)

$indexReplacements = @(
    @{ Old = '<img src="image/Design%20to%20delivery/engineer.webp" alt="" loading="lazy" decoding="async" width="1376" height="768">'
       New = '<img src="image/Design%20to%20delivery/engineer.webp" alt="Pulse Medical engineering and prototyping stage" loading="lazy" decoding="async" width="1376" height="768">' },
    @{ Old = '<img src="image/Design%20to%20delivery/manufacturing.webp" alt="" loading="lazy" decoding="async" width="1376" height="768">'
       New = '<img src="image/Design%20to%20delivery/manufacturing.webp" alt="Pulse Medical manufacturing and production stage" loading="lazy" decoding="async" width="1376" height="768">' },
    @{ Old = '<img src="image/Design%20to%20delivery/delivery-&-installation-1.webp" alt="" loading="lazy" decoding="async" width="1376" height="768">'
       New = '<img src="image/Design%20to%20delivery/delivery-&-installation-1.webp" alt="Pulse Medical delivery and installation stage" loading="lazy" decoding="async" width="1376" height="768">' },
    @{ Old = '<img src="image/Design%20to%20delivery/after-sales-service.webp" alt="" loading="lazy" decoding="async" width="1376" height="768">'
       New = '<img src="image/Design%20to%20delivery/after-sales-service.webp" alt="Pulse Medical after-sales service and lifecycle support" loading="lazy" decoding="async" width="1376" height="768">' }
)

foreach ($r in $indexReplacements) {
    if ($indexText.Contains($r.Old)) {
        $indexText = $indexText.Replace($r.Old, $r.New)
        Write-Host "index.html: replaced -> $($r.New.Substring(0,60))..."
    } else {
        Write-Host "index.html: PATTERN NOT FOUND (skipped) -> $($r.Old.Substring(0,60))..." -ForegroundColor Yellow
    }
}
[System.IO.File]::WriteAllText($indexPath, $indexText)

# --- news.html ---
$newsPath = Join-Path $repoRoot "news.html"
$newsText = [System.IO.File]::ReadAllText($newsPath)

$newsReplacements = @(
    @{ Old = '<img src="image/feature-et-news.webp" alt="">'
       New = '<img src="image/feature-et-news.webp" alt="Pulse Medical $4M seed funding round news coverage">' },
    @{ Old = '<img src="image/feature-et-article.webp" alt="">'
       New = '<img src="image/feature-et-article.webp" alt="Pulse critical care manufacturing unit at AMTZ Visakhapatnam">' },
    @{ Old = '<img src="image/Portfolio/cardiac-care.webp" alt="">'
       New = '<img src="image/Portfolio/cardiac-care.webp" alt="Pulse Medical cardiac care partnership with Apollo Hospitals">' },
    @{ Old = '<img src="image/Design to delivery/manufacturing.webp" alt="">'
       New = '<img src="image/Design to delivery/manufacturing.webp" alt="AMTZ manufacturing production line expansion">' },
    @{ Old = '<img src="image/Portfolio/renal-care.webp" alt="">'
       New = '<img src="image/Portfolio/renal-care.webp" alt="Pulse Medical renal care haemodialysis system">' },
    @{ Old = '<img src="image/Design to delivery/delivery-installation.webp" alt="">'
       New = '<img src="image/Design to delivery/delivery-installation.webp" alt="Pulse Medical pan-India service and delivery network">' }
)

foreach ($r in $newsReplacements) {
    if ($newsText.Contains($r.Old)) {
        $newsText = $newsText.Replace($r.Old, $r.New)
        Write-Host "news.html: replaced -> $($r.New.Substring(0,60))..."
    } else {
        Write-Host "news.html: PATTERN NOT FOUND (skipped) -> $($r.Old.Substring(0,60))..." -ForegroundColor Yellow
    }
}
[System.IO.File]::WriteAllText($newsPath, $newsText)

Write-Host ""
Write-Host "Done. Review with: git diff index.html news.html"

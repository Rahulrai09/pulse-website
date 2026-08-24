# fix-alt-text-batch2-hero-banners.ps1
# Run from repo root: C:\Users\DELL\Desktop\pulse-website
# Adds alt text to the 5 homepage hero banner images.

$path = (Resolve-Path ".\index.html").Path
$content = [System.IO.File]::ReadAllText($path)

$replacements = @(
    @{ Old = '<img src="image/Banner/banner-1.webp" alt="" loading="eager">'
       New = '<img src="image/Banner/banner-1.webp" alt="Pulse Medical global distribution network connecting India to international markets" loading="eager">' },
    @{ Old = '<img src="image/Banner/banner-2.webp" alt="" loading="lazy" decoding="async">'
       New = '<img src="image/Banner/banner-2.webp" alt="Doctor and nurse attending ICU patient using Pulse ventilator" loading="lazy" decoding="async">' },
    @{ Old = '<img src="image/Banner/banner-3.webp" alt="" loading="lazy" decoding="async">'
       New = '<img src="image/Banner/banner-3.webp" alt="Pulse aesthetics equipment lineup of laser and skin treatment devices" loading="lazy" decoding="async">' },
    @{ Old = '<img src="image/Banner/banner-4.webp" alt="" loading="lazy" decoding="async">'
       New = '<img src="image/Banner/banner-4.webp" alt="Pulse rehabilitation wheelchair range" loading="lazy" decoding="async">' },
    @{ Old = '<img src="image/Banner/banner-5.webp" alt="" loading="lazy" decoding="async">'
       New = '<img src="image/Banner/banner-5.webp" alt="Pulse patient monitor displaying ECG, SpO2, and vital signs" loading="lazy" decoding="async">' }
)

foreach ($r in $replacements) {
    if ($content.Contains($r.Old)) {
        $content = $content.Replace($r.Old, $r.New)
        Write-Host "Replaced -> $($r.New.Substring(0,70))..."
    } else {
        Write-Host "PATTERN NOT FOUND (skipped) -> $($r.Old)" -ForegroundColor Yellow
    }
}

[System.IO.File]::WriteAllText($path, $content)

Write-Host ""
Write-Host "Done. Review with: git diff index.html"

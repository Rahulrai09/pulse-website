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
$lines = [System.IO.File]::ReadAllLines($path)

$targetIndex = -1
for ($i = 0; $i -lt $lines.Length; $i++) {
    if ($lines[$i].Trim() -eq "<loc>https://www.pulseio.in/rehabilitation.html</loc>") {
        $targetIndex = $i
        break
    }
}

if ($targetIndex -eq -1) {
    Write-Host "COULD NOT FIND rehabilitation.html loc line - stopping" -ForegroundColor Red
} else {
    # The </url> closing tag is 3 lines after the <loc> line (lastmod, changefreq, priority, then </url>)
    $insertAfter = $targetIndex + 4
    Write-Host "Found anchor at line $($targetIndex + 1), inserting after line $($insertAfter + 1): [$($lines[$insertAfter])]"

    $newBlock = @()
    foreach ($slug in $slugs) {
        $newBlock += ""
        $newBlock += "  <url>"
        $newBlock += "    <loc>https://www.pulseio.in/rehabilitation/$slug/</loc>"
        $newBlock += "    <lastmod>2026-07-29</lastmod>"
        $newBlock += "    <changefreq>monthly</changefreq>"
        $newBlock += "    <priority>0.8</priority>"
        $newBlock += "  </url>"
    }

    $before = $lines[0..$insertAfter]
    $after = $lines[($insertAfter + 1)..($lines.Length - 1)]
    $newLines = $before + $newBlock + $after

    [System.IO.File]::WriteAllLines($path, $newLines)
    Write-Host "Added 11 Rehabilitation product entries to sitemap.xml" -ForegroundColor Green
}

Write-Host ""
Write-Host "=== Verification ==="
Select-String -Path $path -Pattern "rehabilitation"

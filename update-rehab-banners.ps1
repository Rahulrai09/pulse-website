$repoRoot = "C:\Users\DELL\Desktop\pulse-website"
$downloadFolder = "$env:USERPROFILE\Downloads\Rehabilitation product banner ratio 4.3"
$imageFolder = Join-Path $repoRoot "image\Rehabiliation"

cd $repoRoot

$mapping = @(
    @{ Src = "Aerodrive 1  banner.png";   Dest = "banner-aerodrive-1.png";   OldExt = "banner-aerodrive-1.jpg" },
    @{ Src = "Aerodrive 2 banner.png";    Dest = "banner-aerodrive-2.png";   OldExt = $null },
    @{ Src = "Cruza banner.png";          Dest = "banner-cruza.png";         OldExt = "banner-cruza.jpg" },
    @{ Src = "Innovax  banner.png";       Dest = "banner-innovax.png";       OldExt = "banner-innovax.jpg" },
    @{ Src = "Joylite-1 banner.png";      Dest = "banner-joylite-1.png";     OldExt = $null },
    @{ Src = "Joylite-2  banner.png";     Dest = "banner-joylite-2.png";     OldExt = $null },
    @{ Src = "Motion pro 1  banner.png";  Dest = "banner-motion-pro-1.png";  OldExt = "banner-motion-pro-1.jpg" },
    @{ Src = "Motion pro 2  banner.png";  Dest = "banner-motion-pro-2.png";  OldExt = "banner-motion-pro-2.jpg" },
    @{ Src = "Smart ride-1 banner.png";   Dest = "banner-smartride-1.png";   OldExt = $null },
    @{ Src = "Smart ride-2 banner.png";   Dest = "banner-smartride-2.png";   OldExt = "banner-smartride-2.jpg" },
    @{ Src = "Xtrion banner.png";         Dest = "banner-xtrion.png";        OldExt = "banner-xtrion.jpg" }
)

Write-Host "--- Copying new banner images ---"
foreach ($m in $mapping) {
    $srcPath = Join-Path $downloadFolder $m.Src
    $destPath = Join-Path $imageFolder $m.Dest

    if (-not (Test-Path -LiteralPath $srcPath)) {
        Write-Host "MISSING SOURCE: $($m.Src)" -ForegroundColor Red
        continue
    }

    Copy-Item -LiteralPath $srcPath -Destination $destPath -Force
    Write-Host "Copied: $($m.Src) -> $($m.Dest)" -ForegroundColor Green
}

Write-Host ""
Write-Host "--- Removing superseded .jpg files ---"
foreach ($m in $mapping) {
    if ($m.OldExt) {
        $oldPath = Join-Path $imageFolder $m.OldExt
        if (Test-Path -LiteralPath $oldPath) {
            Remove-Item -LiteralPath $oldPath -Force
            Write-Host "Removed old file: $($m.OldExt)" -ForegroundColor Yellow
        }
    }
}

Write-Host ""
Write-Host "--- Updating rehabilitation.html references ---"
$htmlPath = Join-Path $repoRoot "rehabilitation.html"
$content = [System.IO.File]::ReadAllText($htmlPath)

foreach ($m in $mapping) {
    if ($m.OldExt) {
        $oldRef = "image/Rehabiliation/" + $m.OldExt
        $newRef = "image/Rehabiliation/" + $m.Dest
        if ($content.Contains($oldRef)) {
            $content = $content.Replace($oldRef, $newRef)
            Write-Host "Updated reference: $oldRef -> $newRef" -ForegroundColor Green
        } else {
            Write-Host "REFERENCE NOT FOUND: $oldRef" -ForegroundColor Red
        }
    }
}

[System.IO.File]::WriteAllText($htmlPath, $content)

Write-Host ""
Write-Host "=== DONE ==="

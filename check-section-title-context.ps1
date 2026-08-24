# check-section-title-context.ps1
# Run from repo root: C:\Users\DELL\Desktop\pulse-website

$path = ".\index.html"
$lines = [System.IO.File]::ReadAllLines((Resolve-Path $path).Path)

$targets = @(2644, 2864, 3146, 3282)

foreach ($lineNum in $targets) {
    Write-Host ""
    Write-Host "=== Context around line $lineNum ==="
    $start = [Math]::Max(0, $lineNum - 12)
    $end = [Math]::Min($lines.Count - 1, $lineNum + 6)
    for ($i = $start; $i -le $end; $i++) {
        Write-Host "$($i+1): $($lines[$i])"
    }
}

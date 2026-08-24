# check-h2-duplicate.ps1
# Run from repo root: C:\Users\DELL\Desktop\pulse-website

$repoRoot = "C:\Users\DELL\Desktop\pulse-website"
$pages = @(
    "cardiac-care.html",
    "aesthetics.html",
    "rehabilitation.html",
    "hospital-setup.html",
    "critical-care.html",
    "renal-care.html",
    "surgical.html"
)

foreach ($page in $pages) {
    $path = Join-Path $repoRoot $page
    if (Test-Path $path) {
        Write-Host ""
        Write-Host "--- $page ---"
        $lines = [System.IO.File]::ReadAllLines($path)
        for ($i = 0; $i -lt $lines.Count; $i++) {
            if ($lines[$i] -match '<h2[^>]*>.*Filter Products.*</h2>') {
                $start = [Math]::Max(0, $i - 2)
                $end = [Math]::Min($lines.Count - 1, $i + 2)
                for ($j = $start; $j -le $end; $j++) {
                    Write-Host "$($j+1): $($lines[$j])"
                }
            }
        }
    } else {
        Write-Host ""
        Write-Host "--- $page : FILE NOT FOUND ---"
    }
}

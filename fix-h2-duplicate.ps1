# fix-h2-duplicate.ps1
# Run from repo root: C:\Users\DELL\Desktop\pulse-website
# Replaces the generic "Filter Products" H2 with a category-specific one on each of the 7 category pages.

$repoRoot = "C:\Users\DELL\Desktop\pulse-website"

$pages = @{
    "cardiac-care.html"     = "Filter Cardiac Care Products"
    "aesthetics.html"       = "Filter Aesthetics Products"
    "rehabilitation.html"   = "Filter Rehabilitation Products"
    "hospital-setup.html"   = "Filter Hospital Setup Products"
    "critical-care.html"    = "Filter Critical Care Products"
    "renal-care.html"       = "Filter Renal Care Products"
    "surgical.html"         = "Filter Surgical Products"
}

$old = '<h2>Filter Products</h2>'

foreach ($page in $pages.Keys) {
    $path = Join-Path $repoRoot $page
    if (Test-Path $path) {
        $content = [System.IO.File]::ReadAllText($path)
        $new = "<h2>$($pages[$page])</h2>"
        if ($content.Contains($old)) {
            $content = $content.Replace($old, $new)
            [System.IO.File]::WriteAllText($path, $content)
            Write-Host "$page : replaced -> $new"
        } else {
            Write-Host "$page : PATTERN NOT FOUND (skipped)" -ForegroundColor Yellow
        }
    } else {
        Write-Host "$page : FILE NOT FOUND" -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "Done. Review with:"
Write-Host "  git diff cardiac-care.html aesthetics.html rehabilitation.html hospital-setup.html critical-care.html renal-care.html surgical.html"

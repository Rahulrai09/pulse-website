# check-before-deletion-and-metadesc.ps1
# Run from repo root: C:\Users\DELL\Desktop\pulse-website

$repoRoot = "C:\Users\DELL\Desktop\pulse-website"

Write-Host "=========================================="
Write-Host "PART 1: References to pages marked for deletion"
Write-Host "=========================================="

$targets = @("our-people.html", "news.html")
$searchFiles = Get-ChildItem -Path $repoRoot -Include *.html,*.js,*.xml,*.json -Recurse -File |
    Where-Object { $_.Name -ne "our-people.html" -and $_.Name -ne "news.html" }

foreach ($target in $targets) {
    Write-Host ""
    Write-Host "--- References to $target ---"
    foreach ($file in $searchFiles) {
        $matches = Select-String -Path $file.FullName -Pattern $target -SimpleMatch -ErrorAction SilentlyContinue
        foreach ($m in $matches) {
            $relPath = $file.FullName.Substring($repoRoot.Length + 1)
            Write-Host "$relPath : line $($m.LineNumber) : $($m.Line.Trim())"
        }
    }
}

Write-Host ""
Write-Host "=========================================="
Write-Host "PART 2: Title + H1 for the 8 pages needing meta description"
Write-Host "=========================================="

$keepPages = @(
    "articles-blogs.html",
    "blog-pulse-4million.html",
    "blog-zuvio-amtz.html",
    "innovation.html",
    "life-at-pulse.html",
    "quality.html",
    "service-support.html",
    "why-pulse.html"
)

foreach ($page in $keepPages) {
    $path = Join-Path $repoRoot $page
    if (Test-Path $path) {
        Write-Host ""
        Write-Host "--- $page ---"
        $content = [System.IO.File]::ReadAllText($path)

        $titleMatch = [regex]::Match($content, '<title>(.*?)</title>')
        if ($titleMatch.Success) { Write-Host "TITLE: $($titleMatch.Groups[1].Value)" }

        $metaMatch = [regex]::Match($content, '<meta\s+name="description"\s+content="(.*?)"')
        if ($metaMatch.Success) {
            Write-Host "EXISTING META: $($metaMatch.Groups[1].Value)"
        } else {
            Write-Host "EXISTING META: (none found)"
        }

        $h1Match = [regex]::Match($content, '<h1[^>]*>(.*?)</h1>', [System.Text.RegularExpressions.RegexOptions]::Singleline)
        if ($h1Match.Success) {
            $h1Clean = ($h1Match.Groups[1].Value -replace '<[^>]+>', ' ') -replace '\s+', ' '
            Write-Host "H1: $($h1Clean.Trim())"
        }
    } else {
        Write-Host ""
        Write-Host "--- $page : FILE NOT FOUND ---"
    }
}

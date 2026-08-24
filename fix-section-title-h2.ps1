# fix-section-title-h2.ps1
# Run from repo root: C:\Users\DELL\Desktop\pulse-website
# Converts 4 section-title-ayr <div> wrappers to <h2> so H1 -> H2 -> H3 hierarchy is sequential.
# Uses exact line-number targeting since two of the four opening tags are textually identical.

$path = (Resolve-Path ".\index.html").Path
$lines = [System.IO.File]::ReadAllLines($path)

# Each pair: (1-indexed open line, 1-indexed close line, human label for logging)
$pairs = @(
    @{ Open = 2644; Close = 2646; Label = "why-pulse (Why Pulse Performs)" },
    @{ Open = 2864; Close = 2866; Label = "portfolio (Better Care for Life)" },
    @{ Open = 3146; Close = 3149; Label = "trust (Built to the Highest Standards)" },
    @{ Open = 3282; Close = 3285; Label = "faq (Frequently Asked Questions)" }
)

foreach ($pair in $pairs) {
    $openIdx = $pair.Open - 1
    $closeIdx = $pair.Close - 1

    $openLine = $lines[$openIdx]
    $closeLine = $lines[$closeIdx]

    $openOk = $openLine -match '<div class="section-title-ayr'
    $closeOk = $closeLine.Trim() -eq '</div>'

    if ($openOk -and $closeOk) {
        $lines[$openIdx] = $openLine -replace '<div class="section-title-ayr', '<h2 class="section-title-ayr'
        $lines[$closeIdx] = $closeLine -replace '</div>', '</h2>'
        Write-Host "$($pair.Label): converted lines $($pair.Open) and $($pair.Close) -> h2"
    } else {
        Write-Host "$($pair.Label): MISMATCH at lines $($pair.Open)/$($pair.Close), skipped" -ForegroundColor Yellow
        Write-Host "  Open line was : $openLine"
        Write-Host "  Close line was: $closeLine"
    }
}

[System.IO.File]::WriteAllLines($path, $lines)

Write-Host ""
Write-Host "Done. Review with: git diff index.html"

# audit-images.ps1
# Run from repo root: C:\Users\DELL\Desktop\pulse-website
# Checks: (1) <img> tags missing alt text, (2) image files over 100KB

$repoRoot = "C:\Users\DELL\Desktop\pulse-website"
$reportPath = Join-Path $repoRoot "image-audit-report.txt"

$missingAlt = New-Object System.Collections.Generic.List[string]
$oversized  = New-Object System.Collections.Generic.List[string]

# --- 1. Scan all HTML files for <img> tags missing alt or with empty alt ---
$htmlFiles = Get-ChildItem -Path $repoRoot -Filter *.html -Recurse -File

foreach ($file in $htmlFiles) {
    $lines = [System.IO.File]::ReadAllLines($file.FullName)
    for ($i = 0; $i -lt $lines.Count; $i++) {
        $line = $lines[$i]
        # Find all <img ...> tags on this line
        $imgMatches = [regex]::Matches($line, '<img\b[^>]*>')
        foreach ($m in $imgMatches) {
            $tag = $m.Value
            if ($tag -notmatch 'alt\s*=\s*"[^"]+"' -and $tag -notmatch "alt\s*=\s*'[^']+'") {
                $relPath = $file.FullName.Substring($repoRoot.Length + 1)
                $missingAlt.Add("$relPath : line $($i+1) : $tag")
            }
        }
    }
}

# --- 2. Scan image folders for files over 100KB ---
$imageExtensions = @("*.png","*.jpg","*.jpeg","*.webp","*.gif","*.svg")
$imageFiles = Get-ChildItem -Path $repoRoot -Include $imageExtensions -Recurse -File

foreach ($img in $imageFiles) {
    $sizeKB = [math]::Round($img.Length / 1KB, 1)
    if ($sizeKB -gt 100) {
        $relPath = $img.FullName.Substring($repoRoot.Length + 1)
        $oversized.Add("$relPath : $sizeKB KB")
    }
}

# --- 3. Write report ---
$report = @()
$report += "=== IMAGES MISSING ALT TEXT ($($missingAlt.Count)) ==="
$report += $missingAlt
$report += ""
$report += "=== IMAGES OVER 100KB ($($oversized.Count)) ==="
$report += ($oversized | Sort-Object { [double]($_ -split ': ')[1].Replace(' KB','') } -Descending)

$report | Out-File -FilePath $reportPath -Encoding utf8

Write-Host "Done. Report saved to: $reportPath"
Write-Host ""
Write-Host "Missing alt text: $($missingAlt.Count) images"
Write-Host "Over 100KB: $($oversized.Count) images"

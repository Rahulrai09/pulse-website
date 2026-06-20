# Pulse Search Index Auto-Generator
# Run this after adding any new product page
# It ADDS new entries only - does not overwrite existing ones

cd "C:\Users\DELL\Desktop\pulse-website"

$excludePattern = "^(index|about|quality|why-pulse|how-it-works|service-support|categories|life-at-pulse|innovation|news|articles|blog|privacy|terms|rehabilitation|critical-care|renal-care|cardiac-care|aesthetics|hospital-setup|banner-animation|our-people|blog-placeholder|blog-post|blog-pulse-4million|blog-zuvio-amtz|furniture-admin-nursing|furniture-blood-donation|furniture-icu-beds|furniture-labour-delivery|furniture-ot-lights|furniture-ot-tables|furniture-patient-mobility|furniture-ss-trolleys)\.html$"

$productFiles = Get-ChildItem -Filter "*.html" -File | Where-Object { $_.Name -notmatch $excludePattern } | Sort-Object Name

# Read current header.js to find already-mapped URLs
$headerContent = Get-Content "js\header.js" -Raw
$alreadyMapped = [regex]::Matches($headerContent, "url: '([^']+)'") | ForEach-Object { $_.Groups[1].Value }

$newEntries = @()
foreach ($file in $productFiles) {
    if ($alreadyMapped -contains $file.Name) {
        continue  # Already in searchMap, skip
    }
    
    $content = Get-Content $file.FullName -Raw
    if ($content -match '<title>([^<|]+)') {
        $title = $matches[1].Trim().ToLower()
    } else {
        $title = $file.BaseName -replace '-', ' '
    }
    
    $fileWords = ($file.BaseName -replace '-', ' ').ToLower()
    $stopWords = @('the','a','an','and','or','for','of','in','on','at','to','with','by','from','pulse','system','systems','device','devices','kit','kits','unit','units','machine','pro','plus','lite','series')
    $titleWords = $title -split '\s+' | Where-Object { $_ -notin $stopWords -and $_.Length -gt 2 }
    
    $keywords = @($title, $fileWords) + $titleWords | Sort-Object -Unique | Where-Object { $_.Length -gt 1 }
    $keywordsStr = ($keywords | ForEach-Object { "'$_'" }) -join ','
    $newEntries += "  { keywords: [$keywordsStr], url: '$($file.Name)' },"
    Write-Host "NEW: $($file.Name)"
}

if ($newEntries.Count -eq 0) {
    Write-Host "No new products found — searchMap is up to date"
} else {
    # Insert new entries before the CRITICAL CARE comment
    $insertion = ($newEntries -join "`r`n") + "`r`n`r`n  // ── CRITICAL CARE"
    $newContent = $headerContent -replace '  // ── CRITICAL CARE', $insertion
    Set-Content "js\header.js" $newContent -NoNewline
    Write-Host "Added $($newEntries.Count) new entries to searchMap"
    Write-Host "Run: git add js\header.js && git commit -m 'Update search index' && git push"
}

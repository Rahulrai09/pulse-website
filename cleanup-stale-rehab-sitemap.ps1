$repoRoot = "C:\Users\DELL\Desktop\pulse-website"
cd $repoRoot

$staleFiles = @(
    "rehab-aerodrive1-wheelchair.html",
    "rehab-aerodrive-6019.html",
    "rehab-autofold-smartride.html",
    "rehab-autofold-smartride2-wheelchair.html",
    "rehab-innovax-6016a.html",
    "rehab-joylite1-wheelchair.html",
    "rehab-joylite-9005.html",
    "rehab-joylite-9006.html",
    "rehab-motionpro1-wheelchair.html",
    "rehab-motion-pro-6001.html",
    "rehab-xtrion-6013a.html"
)

$path = Join-Path $repoRoot "sitemap.xml"
$lines = [System.IO.File]::ReadAllLines($path)

$removedCount = 0
$newLines = New-Object System.Collections.Generic.List[string]
$i = 0
while ($i -lt $lines.Length) {
    $line = $lines[$i]
    $isStaleUrlOpen = $false

    if ($line.Trim() -eq "<url>") {
        # Peek ahead to see if the next non-blank line is a stale loc
        $j = $i + 1
        if ($j -lt $lines.Length) {
            $locLine = $lines[$j].Trim()
            foreach ($stale in $staleFiles) {
                if ($locLine -eq "<loc>https://www.pulseio.in/$stale</loc>") {
                    $isStaleUrlOpen = $true
                    break
                }
            }
        }
    }

    if ($isStaleUrlOpen) {
        # Skip this <url> block: <url>, loc, lastmod, changefreq, priority, </url> = 6 lines
        # Also skip one blank line before it if present
        if ($newLines.Count -gt 0 -and $newLines[$newLines.Count - 1].Trim() -eq "") {
            $newLines.RemoveAt($newLines.Count - 1)
        }
        $i += 6
        $removedCount++
    } else {
        $newLines.Add($line)
        $i++
    }
}

[System.IO.File]::WriteAllLines($path, $newLines)
Write-Host "Removed $removedCount stale <url> blocks" -ForegroundColor Green

Write-Host ""
Write-Host "=== Verification: any rehab- entries left? (should be empty) ==="
Select-String -Path $path -Pattern "rehab-"

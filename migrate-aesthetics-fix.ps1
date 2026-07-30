$repoRoot = "C:\Users\DELL\Desktop\pulse-website"
cd $repoRoot

$products = @(
    @{ Old = "aesthetics-nodd.html";             New = "nodd" },
    @{ Old = "aesthetics-em-ma.html";             New = "em-ma" },
    @{ Old = "aesthetics-visage.html";            New = "visage" },
    @{ Old = "aesthetics-pi-code.html";           New = "pi-code" },
    @{ Old = "aesthetics-hydrafrac.html";         New = "hydrafrac" },
    @{ Old = "aesthetics-cool-shape.html";        New = "cool-shape" },
    @{ Old = "aesthetics-code-factor.html";       New = "code-factor" },
    @{ Old = "aesthetics-excimer.html";           New = "excimer" },
    @{ Old = "aesthetics-wavelength-pro-x.html";  New = "wavelength-pro-x" },
    @{ Old = "aesthetics-skin-analyzer.html";     New = "skin-analyzer" },
    @{ Old = "aesthetics-bbl-super-ipl-dpl.html"; New = "bbl-super-ipl-dpl" },
    @{ Old = "aesthetics-em-code.html";           New = "em-code" }
)

foreach ($p in $products) {
    $path = Join-Path $repoRoot "aesthetics\$($p.New).html"

    if (-not (Test-Path $path)) {
        Write-Host "SKIPPING - not found: $path" -ForegroundColor Red
        continue
    }

    $content = [System.IO.File]::ReadAllText($path)

    $content = $content.Replace('href="css/', 'href="/css/')
    $content = $content.Replace('src="js/', 'src="/js/')
    $content = $content.Replace('src="image/', 'src="/image/')
    $content = $content.Replace('href="image/', 'href="/image/')

    $content = $content.Replace('href="index.html"', 'href="/index.html"')
    $content = $content.Replace('href="aesthetics.html"', 'href="/aesthetics.html"')

    foreach ($sibling in $products) {
        $oldRef = 'href="' + $sibling.Old + '"'
        $newRef = 'href="/aesthetics/' + $sibling.New + '/"'
        $content = $content.Replace($oldRef, $newRef)
    }

    $oldCanonical = 'https://www.pulseio.in/' + $p.Old
    $newCanonical = 'https://www.pulseio.in/aesthetics/' + $p.New + '/'
    $content = $content.Replace($oldCanonical, $newCanonical)

    [System.IO.File]::WriteAllText($path, $content)
    Write-Host "Fixed internal paths in aesthetics\$($p.New).html" -ForegroundColor Green
}

Write-Host ""
Write-Host "=== DONE ==="

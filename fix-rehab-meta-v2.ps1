$repoRoot = "C:\Users\DELL\Desktop\pulse-website"
cd $repoRoot

$products = @{
    "aerodrive-1.html"  = "Pulse Aerodrive 1 electric wheelchair with lightweight aluminium frame, dual motors and smart joystick for smooth indoor-outdoor mobility."
    "aerodrive-2.html"  = "Pulse Aerodrive 2 power-assist wheelchair, 36kg lightweight build, 24V 10Ah battery for 15-20km range per charge."
    "cruza.html"        = "Pulse Cruza reclining power wheelchair with electric recline up to 160 degrees, controlled via one-hand 360 degree joystick."
    "innovax.html"      = "Pulse Innovax power wheelchair with high-torque motors, anti-tip wheels and adjustable armrests for enhanced patient safety."
    "joylite-1.html"    = "Pulse Joylite 1 ultra-lightweight electric wheelchair with foldable frame and extended battery for daily mobility."
    "joylite-2.html"    = "Pulse Joylite 2 electric wheelchair with upgraded battery capacity, improved seat comfort and intuitive joystick control."
    "motion-pro-1.html" = "Pulse Motion Pro 1 heavy-duty foldable power wheelchair with long-range battery and all-terrain joystick control."
    "motion-pro-2.html" = "Pulse Motion Pro 2 power wheelchair, 24V 20Ah lithium-ion battery for 15-20km range, 24-inch aluminium alloy rear wheel."
    "smartride-1.html"  = "Pulse Smartride 1 compact autofold wheelchair, 26kg carbon fiber frame, 24V 10Ah battery for 15-20km range per charge."
    "smartride-2.html"  = "Pulse Smartride 2 auto-folding wheelchair with one-touch fold mechanism, travel-friendly compact design."
    "xtrion.html"       = "Pulse Xtrion compact electric wheelchair with mid-wheel drive, ergonomic seating and intelligent joystick controller."
}

foreach ($fileName in $products.Keys) {
    $path = Join-Path $repoRoot "rehabilitation\$fileName"
    $lines = [System.IO.File]::ReadAllLines($path)
    $newDesc = $products[$fileName]
    $found = $false

    for ($i = 0; $i -lt $lines.Length; $i++) {
        if ($lines[$i] -match '^(\s*)<meta name="description" content="') {
            $indent = $matches[1]
            $lines[$i] = $indent + '<meta name="description" content="' + $newDesc + '">'
            $found = $true
            break
        }
    }

    if ($found) {
        [System.IO.File]::WriteAllLines($path, $lines)
        Write-Host "$fileName : updated ($($newDesc.Length) chars)" -ForegroundColor Green
    } else {
        Write-Host "$fileName : META DESCRIPTION LINE NOT FOUND" -ForegroundColor Red
    }
}

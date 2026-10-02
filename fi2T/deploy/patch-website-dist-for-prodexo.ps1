# After npm run build, Prodexo nginx serves files at /fi2t/<filename>
# (not under /fi2t/assets/). Ensure JS/CSS live at dist root and index.html points there.
param(
  [string]$Dist = (Join-Path (Split-Path $PSScriptRoot -Parent) "website\dist")
)

$ErrorActionPreference = 'Stop'
$index = Join-Path $Dist 'index.html'
$assets = Join-Path $Dist 'assets'

if (-not (Test-Path $index)) {
  throw "Missing index.html in dist - run npm run build first."
}

$html = Get-Content $index -Raw -Encoding UTF8

$js = $null
$css = $null
if (Test-Path $assets) {
  $js = Get-ChildItem $assets -Filter 'index-*.js' -ErrorAction SilentlyContinue | Select-Object -First 1
  $css = Get-ChildItem $assets -Filter 'index-*.css' -ErrorAction SilentlyContinue | Select-Object -First 1
  if ($js) { Copy-Item $js.FullName (Join-Path $Dist $js.Name) -Force }
  if ($css) { Copy-Item $css.FullName (Join-Path $Dist $css.Name) -Force }
}
if (-not $js) {
  $js = Get-ChildItem $Dist -Filter 'index-*.js' -File -ErrorAction SilentlyContinue | Select-Object -First 1
}
if (-not $css) {
  $css = Get-ChildItem $Dist -Filter 'index-*.css' -File -ErrorAction SilentlyContinue | Select-Object -First 1
}
if (-not $js -or -not $css) {
  throw "Missing index-*.js/css in dist (or assets/)"
}

$base = '/fi2t/'
$jsHref = $base + $js.Name
$cssHref = $base + $css.Name

# Normalize any prior broken double-prefix or assets/ paths to a single /fi2t/<file>
$html = [regex]::Replace($html, '(?:/fi2t)+(?:/assets)?/index-[a-zA-Z0-9_-]+\.js', $jsHref)
$html = [regex]::Replace($html, '(?:/fi2t)+(?:/assets)?/index-[a-zA-Z0-9_-]+\.css', $cssHref)
$html = [regex]::Replace($html, '(?<![/\w])\.?/index-[a-zA-Z0-9_-]+\.js', $jsHref)
$html = [regex]::Replace($html, '(?<![/\w])\.?/index-[a-zA-Z0-9_-]+\.css', $cssHref)

[System.IO.File]::WriteAllText($index, $html)

Write-Host ("Patched index.html -> {0}, {1}" -f $js.Name, $css.Name) -ForegroundColor Green

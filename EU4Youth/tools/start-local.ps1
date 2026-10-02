# Start EU4Youth local stack: API 8040, public site 3030, admin CMS 3040.
$ErrorActionPreference = 'Stop'
$root = Split-Path $PSScriptRoot -Parent

function Start-NpmDev([string]$dir, [string]$title) {
  $full = Join-Path $root $dir
  if (-not (Test-Path (Join-Path $full 'node_modules'))) {
    Write-Host "npm install in $dir ..."
    Push-Location $full
    npm install
    Pop-Location
  }
  Start-Process powershell -ArgumentList @(
    '-NoExit',
    '-Command',
    "Set-Location '$full'; Write-Host '$title'; npm run dev"
  )
}

Write-Host "EU4Youth local CMS"
Write-Host "  API     http://localhost:8040"
Write-Host "  Public  http://localhost:3030"
Write-Host "  Admin   http://localhost:3040"
Write-Host "Login: use EU4Y_ADMIN_EMAIL / EU4Y_ADMIN_PASSWORD"

Start-NpmDev 'backend' 'EU4Youth API :8040'
Start-Sleep -Seconds 1
Start-NpmDev 'eu4youth-website' 'EU4Youth public :3030'
Start-Sleep -Seconds 1
Start-NpmDev 'frontend' 'EU4Youth admin :3040'

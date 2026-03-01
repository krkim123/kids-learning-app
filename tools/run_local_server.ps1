param(
  [int]$Port = 8765
)

$ErrorActionPreference = "Stop"

$projectRoot = Split-Path -Parent $PSScriptRoot
Set-Location -LiteralPath $projectRoot

$python = Get-Command python -ErrorAction SilentlyContinue
if (-not $python) {
  throw "Python not found. Install Python or run another local web server."
}

$url = "http://127.0.0.1:$Port/index.html"
Write-Host "Serving $projectRoot on $url"
Start-Process $url | Out-Null

python -m http.server $Port

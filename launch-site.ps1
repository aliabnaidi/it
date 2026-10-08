$ErrorActionPreference = 'Stop'
try {
  $taskRoot = $PSScriptRoot
  $taskNode = (Get-Command node.exe -ErrorAction SilentlyContinue).Source
  if (-not $taskNode) { $taskNode = Join-Path $env:USERPROFILE '.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' }
  if (-not (Test-Path -LiteralPath $taskNode)) { throw 'Node.js is required. Please install Node.js or upload the site to web hosting.' }
  $taskPort = $null
  foreach ($candidate in 8765..8785) {
    try {
      $health = Invoke-RestMethod -Uri "http://127.0.0.1:$candidate/api/health" -TimeoutSec 1
      if ($health.site -eq 'sanafer-it' -and $health.build -eq 'v30' -and $health.root -eq $taskRoot) { $taskPort = $candidate; break }
    } catch {}
    $probe = [System.Net.Sockets.TcpListener]::new([System.Net.IPAddress]::Loopback, $candidate)
    try { $probe.Start(); $probe.Stop(); $taskPort = $candidate; break } catch { $probe.Stop() }
  }
  if (-not $taskPort) { throw 'No available local port was found.' }
  $taskUrl = "http://127.0.0.1:$taskPort"
  $taskReady = $false
  try { $health = Invoke-RestMethod -Uri "$taskUrl/api/health" -TimeoutSec 1; $taskReady = $health.site -eq 'sanafer-it' -and $health.build -eq 'v30' -and $health.root -eq $taskRoot } catch {}
  if (-not $taskReady) {
    $savedTaskPort = $env:PORT
    try { $env:PORT = [string]$taskPort; $taskProcess = Start-Process -FilePath $taskNode -ArgumentList @('serve.cjs') -WorkingDirectory $taskRoot -WindowStyle Hidden -PassThru } finally { $env:PORT = $savedTaskPort }
    foreach ($attempt in 1..30) {
      Start-Sleep -Milliseconds 200
      try { $health = Invoke-RestMethod -Uri "$taskUrl/api/health" -TimeoutSec 1; if ($health.site -eq 'sanafer-it' -and $health.root -eq $taskRoot) { $taskReady = $true; break } } catch {}
      if ($taskProcess.HasExited) { break }
    }
  }
  if (-not $taskReady) { throw 'The local site could not start. Check local firewall permissions.' }
  Start-Process -FilePath $taskUrl
} catch { Write-Host $_.Exception.Message -ForegroundColor Red; exit 1 }



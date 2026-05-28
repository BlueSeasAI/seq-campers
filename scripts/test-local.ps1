<#
.SYNOPSIS
    Convenience wrapper: starts the Astro dev server and runs Phase 1 smoke tests against it.

.DESCRIPTION
    Use this to verify your changes locally before pushing. It will:
    1. Start `npm run dev` in the background
    2. Wait for the server to be reachable on port 4400
    3. Run test-phase1.ps1 against http://localhost:4400
    4. Stop the dev server when done
#>

[CmdletBinding()]
param()

$ErrorActionPreference = "Stop"
$repoRoot = Split-Path -Parent $PSScriptRoot
Set-Location $repoRoot

Write-Output "Starting Astro dev server in background..."
$serverJob = Start-Job -ScriptBlock {
    param($root)
    Set-Location $root
    npm run dev 2>&1
} -ArgumentList $repoRoot

# Wait up to 30s for the server to come up
$ready = $false
for ($i = 0; $i -lt 30; $i++) {
    try {
        $r = Invoke-WebRequest -Uri "http://localhost:4400/" -UseBasicParsing -TimeoutSec 2 -ErrorAction Stop
        if ($r.StatusCode -eq 200) {
            $ready = $true
            break
        }
    }
    catch {
        # Server not ready yet, wait
        Start-Sleep -Seconds 1
    }
}

if (-not $ready) {
    Write-Output "Dev server did not start within 30 seconds"
    Stop-Job $serverJob -ErrorAction SilentlyContinue
    Remove-Job $serverJob -ErrorAction SilentlyContinue
    exit 1
}

Write-Output "Dev server ready. Running smoke tests..."
Write-Output ""

try {
    & "$PSScriptRoot\test-phase1.ps1" -BaseUrl "http://localhost:4400"
    $exitCode = $LASTEXITCODE
}
finally {
    Write-Output ""
    Write-Output "Stopping dev server..."
    Stop-Job $serverJob -ErrorAction SilentlyContinue
    Remove-Job $serverJob -ErrorAction SilentlyContinue
}

exit $exitCode

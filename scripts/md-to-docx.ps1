<#
.SYNOPSIS
    Convert a Markdown file to a styled Word document (.docx).

.DESCRIPTION
    Uses PowerShell 7's ConvertFrom-Markdown to produce HTML, applies SEQ
    brand styling (sand/rust/ink palette), then drives Word COM to save
    the result as .docx.

    Requires:
    - PowerShell 7+
    - Microsoft Word installed (any version that exposes Word.Application
      COM, which is every desktop install)

.PARAMETER InputPath
    Absolute path to the source .md file.

.PARAMETER OutputPath
    Absolute path to the destination .docx file. Defaults to the same
    folder as the input with the .md extension swapped for .docx.

.EXAMPLE
    .\md-to-docx.ps1 -InputPath "C:\path\to\guide.md"
    Writes C:\path\to\guide.docx.

.EXAMPLE
    .\md-to-docx.ps1 -InputPath "guide.md" -OutputPath "Client Guide.docx"
#>

[CmdletBinding()]
param(
    [Parameter(Mandatory)]
    [string]$InputPath,

    [string]$OutputPath
)

if (-not (Test-Path $InputPath)) {
    Write-Error "Input file not found: $InputPath"
    exit 1
}

$InputPath = (Resolve-Path $InputPath).Path

if (-not $OutputPath) {
    $OutputPath = [System.IO.Path]::ChangeExtension($InputPath, ".docx")
}

# Resolve OutputPath to absolute path even if it doesn't exist yet
$OutputDir = Split-Path -Parent $OutputPath
if (-not $OutputDir) { $OutputDir = (Get-Location).Path }
$OutputDir = (Resolve-Path $OutputDir).Path
$OutputPath = Join-Path $OutputDir (Split-Path -Leaf $OutputPath)

$htmlBody = (ConvertFrom-Markdown -Path $InputPath).Html

$fullHtml = @"
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>$([System.IO.Path]::GetFileNameWithoutExtension($InputPath))</title>
<style>
  body { font-family: 'Calibri', sans-serif; font-size: 11pt; color: #2A1608; line-height: 1.5; max-width: 720px; margin: 24px; }
  h1 { font-family: 'Calibri', sans-serif; font-size: 22pt; color: #2A1608; border-bottom: 3px solid #C0341A; padding-bottom: 6px; margin-top: 24px; }
  h2 { font-family: 'Calibri', sans-serif; font-size: 16pt; color: #C0341A; margin-top: 22px; margin-bottom: 8px; }
  h3 { font-family: 'Calibri', sans-serif; font-size: 13pt; color: #2A1608; margin-top: 18px; margin-bottom: 6px; }
  p, li { color: #2A1608; line-height: 1.55; }
  strong { color: #2A1608; font-weight: 700; }
  code { background: #F4EDE0; color: #C0341A; padding: 1px 5px; border-radius: 3px; font-family: Consolas, monospace; font-size: 10pt; }
  pre { background: #F4EDE0; padding: 12px 14px; border-left: 3px solid #C0341A; font-family: Consolas, monospace; font-size: 10pt; overflow-x: auto; }
  pre code { background: transparent; color: #2A1608; padding: 0; }
  table { border-collapse: collapse; width: 100%; margin: 12px 0; }
  th { background: #2A1608; color: #F4EDE0; padding: 8px 12px; text-align: left; font-weight: 700; }
  td { border-bottom: 1px solid #DCCBA8; padding: 8px 12px; vertical-align: top; }
  ul, ol { margin: 8px 0 12px 0; padding-left: 24px; }
  li { margin-bottom: 6px; }
  a { color: #C0341A; text-decoration: underline; }
  blockquote { border-left: 4px solid #D4943A; background: #FFF7EC; padding: 10px 16px; margin: 12px 0; font-style: italic; color: #2A1608; }
</style>
</head>
<body>
$htmlBody
</body>
</html>
"@

$tmpHtml = Join-Path $env:TEMP ("md-to-docx-" + [guid]::NewGuid().ToString() + ".html")
Set-Content -Path $tmpHtml -Value $fullHtml -Encoding UTF8

$word = New-Object -ComObject Word.Application
$word.Visible = $false
try {
    $doc = $word.Documents.Open($tmpHtml, $false, $true)
    # wdFormatDocumentDefault = 16 (Office Open XML .docx)
    $doc.SaveAs([ref]$OutputPath, [ref]16)
    $doc.Close($false)
    Write-Output ("Saved: " + $OutputPath)
    $size = (Get-Item $OutputPath).Length
    Write-Output ("Size: " + [math]::Round($size/1KB, 1) + " KB")
} catch {
    Write-Error ("Word conversion failed: " + $_.Exception.Message)
    exit 1
} finally {
    $word.Quit()
    [System.Runtime.Interopservices.Marshal]::ReleaseComObject($word) | Out-Null
    Remove-Item $tmpHtml -ErrorAction SilentlyContinue
}

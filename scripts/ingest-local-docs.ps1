param(
  [string]$WorkspaceRoot = ""
)

$ErrorActionPreference = "Stop"

if (-not $WorkspaceRoot) {
  $WorkspaceRoot = Split-Path -Parent $PSScriptRoot
}

$docsRoot = Join-Path $WorkspaceRoot "local-docs"
$inbox = Join-Path $docsRoot "inbox"
$originals = Join-Path $docsRoot "originals"
$parsed = Join-Path $docsRoot "parsed"
$indexPath = Join-Path $docsRoot "index.json"

foreach ($dir in @($docsRoot, $inbox, $originals, $parsed)) {
  if (-not (Test-Path -LiteralPath $dir)) {
    New-Item -ItemType Directory -Path $dir | Out-Null
  }
}

function Convert-ToPlainText {
  param([string]$Text)

  $clean = $Text -replace "<[^>]+>", " "
  $clean = $clean -replace "&lt;", "<" -replace "&gt;", ">" -replace "&amp;", "&" -replace "&quot;", '"' -replace "&#39;", "'"
  $clean = $clean -replace "\s+", " "
  return $clean.Trim()
}

function Read-ZippedXmlText {
  param(
    [string]$FilePath,
    [string[]]$Patterns
  )

  $tempRoot = Join-Path ([System.IO.Path]::GetTempPath()) ("rnd-radar-" + [System.Guid]::NewGuid().ToString("N"))
  New-Item -ItemType Directory -Path $tempRoot | Out-Null

  try {
    Expand-Archive -LiteralPath $FilePath -DestinationPath $tempRoot -Force
    $chunks = New-Object System.Collections.Generic.List[string]
    foreach ($pattern in $Patterns) {
      Get-ChildItem -LiteralPath $tempRoot -Recurse -File -Include $pattern | ForEach-Object {
        $raw = Get-Content -LiteralPath $_.FullName -Raw -Encoding UTF8
        $chunks.Add((Convert-ToPlainText -Text $raw))
      }
    }
    return (($chunks | Where-Object { $_ }) -join "`r`n`r`n")
  }
  finally {
    if (Test-Path -LiteralPath $tempRoot) {
      Remove-Item -LiteralPath $tempRoot -Recurse -Force
    }
  }
}

function Get-FileHashShort {
  param([string]$FilePath)
  return (Get-FileHash -LiteralPath $FilePath -Algorithm SHA256).Hash.Substring(0, 16).ToLowerInvariant()
}

if (Test-Path -LiteralPath $indexPath) {
  $index = Get-Content -LiteralPath $indexPath -Raw -Encoding UTF8 | ConvertFrom-Json
  $records = @($index.records)
} else {
  $records = @()
}

$files = Get-ChildItem -LiteralPath $inbox -File | Where-Object { $_.Name -ne ".gitkeep" }
$processed = 0

foreach ($file in $files) {
  $hash = Get-FileHashShort -FilePath $file.FullName
  $safeBase = ($file.BaseName -replace '[^\p{L}\p{Nd}\-_]+', '-').Trim('-')
  if (-not $safeBase) { $safeBase = "document" }

  $storedName = "$safeBase-$hash$($file.Extension.ToLowerInvariant())"
  $originalPath = Join-Path $originals $storedName
  Copy-Item -LiteralPath $file.FullName -Destination $originalPath -Force

  $parsedName = "$safeBase-$hash.txt"
  $parsedPath = Join-Path $parsed $parsedName
  $ext = $file.Extension.ToLowerInvariant()
  $status = "parsed"
  $text = ""

  if ($ext -in @(".txt", ".md", ".csv", ".json", ".xml", ".html", ".htm")) {
    $text = Get-Content -LiteralPath $file.FullName -Raw -Encoding UTF8
    if ($ext -in @(".xml", ".html", ".htm")) { $text = Convert-ToPlainText -Text $text }
  } elseif ($ext -eq ".docx") {
    $text = Read-ZippedXmlText -FilePath $file.FullName -Patterns @("document.xml")
  } elseif ($ext -eq ".hwpx") {
    $text = Read-ZippedXmlText -FilePath $file.FullName -Patterns @("*.xml")
  } else {
    $status = "stored_only"
    $text = "이 파일 형식($ext)은 현재 원본 보관 및 목록화까지만 지원합니다. OCR/PDF 파싱은 다음 단계에서 추가합니다."
  }

  Set-Content -LiteralPath $parsedPath -Value $text -Encoding UTF8

  $record = [ordered]@{
    id = $hash
    title = $file.BaseName
    originalFile = "local-docs/originals/$storedName"
    parsedText = "local-docs/parsed/$parsedName"
    extension = $ext
    bytes = $file.Length
    status = $status
    processedAt = (Get-Date).ToString("yyyy-MM-ddTHH:mm:ssK")
    publicSummaryReady = $false
    field = ""
    keywords = @()
    memo = ""
  }

  $records = @($records | Where-Object { $_.id -ne $hash }) + @($record)
  Move-Item -LiteralPath $file.FullName -Destination (Join-Path $originals $storedName) -Force
  $processed++
}

$result = [ordered]@{
  schemaVersion = "local-docs.v1"
  storageRoot = $docsRoot
  updatedAt = (Get-Date).ToString("yyyy-MM-ddTHH:mm:ssK")
  records = $records
}

$result | ConvertTo-Json -Depth 8 | Set-Content -LiteralPath $indexPath -Encoding UTF8
Write-Host "Processed $processed file(s)."
Write-Host "Local document index: $indexPath"

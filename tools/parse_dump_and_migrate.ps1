param(
  [string]$DumpRoot = "C:\Users\zagan\Desktop\도경이 어플",
  [string]$ProjectRoot = "C:\Users\zagan\Desktop\kids-learning-app",
  [ValidateSet("all_parseable", "math_only", "all_raw")]
  [string]$MigrateMode = "all_parseable"
)

$ErrorActionPreference = "Stop"

function Get-RelativePathCompat {
  param(
    [string]$BasePath,
    [string]$FullPath
  )

  $baseResolved = (Resolve-Path -LiteralPath $BasePath).Path
  $fullResolved = (Resolve-Path -LiteralPath $FullPath).Path

  if (-not $baseResolved.EndsWith("\")) {
    $baseResolved += "\"
  }

  $baseUri = New-Object System.Uri($baseResolved)
  $fullUri = New-Object System.Uri($fullResolved)
  $relativeUri = $baseUri.MakeRelativeUri($fullUri)
  return [System.Uri]::UnescapeDataString($relativeUri.ToString()).Replace("/", "\")
}

function To-WebPath {
  param(
    [string]$BasePath,
    [string]$FullPath
  )

  $rel = Get-RelativePathCompat -BasePath $BasePath -FullPath $FullPath
  return ($rel -replace "\\", "/")
}

function Is-ParseableExtension {
  param([string]$Extension)

  if ([string]::IsNullOrWhiteSpace($Extension)) {
    return $false
  }

  $ext = $Extension.ToLowerInvariant()
  $parseable = @(
    ".html", ".htm", ".css", ".js", ".json", ".xml", ".txt", ".md", ".csv", ".tsv",
    ".png", ".jpg", ".jpeg", ".gif", ".svg", ".webp", ".bmp", ".ico",
    ".mp3", ".wav", ".ogg", ".m4a",
    ".woff", ".woff2", ".ttf", ".otf",
    ".swf"
  )

  return $parseable -contains $ext
}

function Classify-File {
  param(
    [string]$RelativePath,
    [string]$Extension
  )

  if ([string]::IsNullOrWhiteSpace($Extension)) {
    $ext = ""
  }
  else {
    $ext = $Extension.ToLowerInvariant()
  }

  $rp = $RelativePath.Replace('\\', '/')

  if ($rp -like "Android/*") {
    return "android_app_data"
  }

  if ($rp -like ".littlehome-learn/*") {
    if ($rp -like ".littlehome-learn/SubPage/MATH/*") {
      switch ($ext) {
        ".html" { return "math_web_html" }
        ".css" { return "math_web_css" }
        ".js" { return "math_web_js" }
        ".png" { return "math_image" }
        ".jpg" { return "math_image" }
        ".gif" { return "math_image" }
        ".mp3" { return "math_audio" }
        ".wav" { return "math_audio" }
        default { return "math_other" }
      }
    }

    switch ($ext) {
      ".html" { return "littlehome_web_html" }
      ".css" { return "littlehome_web_css" }
      ".js" { return "littlehome_web_js" }
      ".json" { return "littlehome_data_json" }
      ".png" { return "littlehome_image" }
      ".jpg" { return "littlehome_image" }
      ".gif" { return "littlehome_image" }
      ".mp3" { return "littlehome_audio" }
      ".wav" { return "littlehome_audio" }
      ".swf" { return "littlehome_swf" }
      default { return "littlehome_other" }
    }
  }

  switch ($ext) {
    ".html" { return "web_html" }
    ".css" { return "web_css" }
    ".js" { return "web_js" }
    ".json" { return "data_json" }
    ".xml" { return "data_xml" }
    ".txt" { return "data_text" }
    ".png" { return "image" }
    ".jpg" { return "image" }
    ".jpeg" { return "image" }
    ".gif" { return "image" }
    ".svg" { return "image" }
    ".mp3" { return "audio" }
    ".wav" { return "audio" }
    ".ogg" { return "audio" }
    ".woff" { return "font" }
    ".woff2" { return "font" }
    ".ttf" { return "font" }
    ".otf" { return "font" }
    ".zip" { return "archive_zip" }
    ".apk" { return "android_apk" }
    ".db" { return "database" }
    ".dat" { return "binary_dat" }
    ".swf" { return "flash_swf" }
    default {
      if ([string]::IsNullOrWhiteSpace($ext)) {
        return "no_extension_binary_or_cache"
      }
      return "other"
    }
  }
}

if (-not (Test-Path -LiteralPath $DumpRoot)) {
  throw "Dump root not found: $DumpRoot"
}

if (-not (Test-Path -LiteralPath $ProjectRoot)) {
  throw "Project root not found: $ProjectRoot"
}

$analysisRoot = Join-Path $ProjectRoot "dump_analysis"
$importRoot = Join-Path $ProjectRoot "reference_import"
$mathSrc = Join-Path $DumpRoot ".littlehome-learn\SubPage\MATH"
$mathDst = Join-Path $importRoot "littlehome_math"
$parseDst = Join-Path $importRoot "parsed_dump"
$rawDst = Join-Path $importRoot "raw_dump"

New-Item -ItemType Directory -Force -Path $analysisRoot | Out-Null
New-Item -ItemType Directory -Force -Path $importRoot | Out-Null

$files = Get-ChildItem -LiteralPath $DumpRoot -Recurse -File -Force -ErrorAction SilentlyContinue

$records = foreach ($f in $files) {
  $rel = Get-RelativePathCompat -BasePath $DumpRoot -FullPath $f.FullName
  $ext = $f.Extension
  $class = Classify-File -RelativePath $rel -Extension $ext

  [pscustomobject]@{
    relative_path = $rel
    extension = $ext
    size_bytes = [int64]$f.Length
    class = $class
    parseable = Is-ParseableExtension -Extension $ext
  }
}

$summaryByClass = $records |
  Group-Object class |
  Sort-Object Count -Descending |
  ForEach-Object {
    [pscustomobject]@{
      class = $_.Name
      count = $_.Count
      size_mb = [math]::Round((($_.Group | Measure-Object size_bytes -Sum).Sum / 1MB), 2)
    }
  }

$summaryByExt = $records |
  Group-Object extension |
  Sort-Object Count -Descending |
  ForEach-Object {
    [pscustomobject]@{
      extension = if ([string]::IsNullOrEmpty($_.Name)) { "(none)" } else { $_.Name }
      count = $_.Count
      size_mb = [math]::Round((($_.Group | Measure-Object size_bytes -Sum).Sum / 1MB), 2)
    }
  }

$topBig = $records |
  Sort-Object size_bytes -Descending |
  Select-Object -First 30

$parseableRecords = $records | Where-Object { $_.parseable -eq $true }

$summary = [pscustomobject]@{
  generated_at = (Get-Date).ToString("yyyy-MM-dd HH:mm:ss")
  dump_root = $DumpRoot
  migrate_mode = $MigrateMode
  total_files = $records.Count
  total_size_mb = [math]::Round((($records | Measure-Object size_bytes -Sum).Sum / 1MB), 2)
  parseable_files = $parseableRecords.Count
  parseable_size_mb = [math]::Round((($parseableRecords | Measure-Object size_bytes -Sum).Sum / 1MB), 2)
  by_class = $summaryByClass
  by_extension = $summaryByExt
  top_big_files = $topBig
}

$summaryJson = $summary | ConvertTo-Json -Depth 7
Set-Content -LiteralPath (Join-Path $analysisRoot "summary.json") -Value $summaryJson -Encoding UTF8

$records |
  Export-Csv -LiteralPath (Join-Path $analysisRoot "all_files.csv") -NoTypeInformation -Encoding UTF8

$copiedCount = 0
$copiedSizeMb = 0.0

if ($MigrateMode -eq "math_only") {
  if (Test-Path -LiteralPath $mathSrc) {
    if (Test-Path -LiteralPath $mathDst) {
      Remove-Item -LiteralPath $mathDst -Recurse -Force
    }

    New-Item -ItemType Directory -Force -Path $mathDst | Out-Null
    Copy-Item -Path (Join-Path $mathSrc "*") -Destination $mathDst -Recurse -Force

    $copied = Get-ChildItem -LiteralPath $mathDst -Recurse -File -Force -ErrorAction SilentlyContinue
    $copiedCount = $copied.Count
    $copiedSizeMb = [math]::Round((($copied | Measure-Object Length -Sum).Sum / 1MB), 2)
  }
}
elseif ($MigrateMode -eq "all_parseable") {
  if (Test-Path -LiteralPath $parseDst) {
    Remove-Item -LiteralPath $parseDst -Recurse -Force
  }

  New-Item -ItemType Directory -Force -Path $parseDst | Out-Null

  foreach ($r in $parseableRecords) {
    $src = Join-Path $DumpRoot $r.relative_path
    $dst = Join-Path $parseDst $r.relative_path
    $dstDir = Split-Path -Parent $dst

    if (-not (Test-Path -LiteralPath $dstDir)) {
      New-Item -ItemType Directory -Force -Path $dstDir | Out-Null
    }

    Copy-Item -LiteralPath $src -Destination $dst -Force
  }

  # Alias hidden folder to non-hidden path for web servers that block dot directories.
  $dotRoot = Join-Path $parseDst ".littlehome-learn"
  $aliasRoot = Join-Path $parseDst "littlehome-learn"
  if (Test-Path -LiteralPath $dotRoot) {
    if (Test-Path -LiteralPath $aliasRoot) {
      Remove-Item -LiteralPath $aliasRoot -Recurse -Force
    }
    Copy-Item -Path $dotRoot -Destination $aliasRoot -Recurse -Force
  }

  $copied = Get-ChildItem -LiteralPath $parseDst -Recurse -File -Force -ErrorAction SilentlyContinue
  $copiedCount = $copied.Count
  $copiedSizeMb = [math]::Round((($copied | Measure-Object Length -Sum).Sum / 1MB), 2)
}
elseif ($MigrateMode -eq "all_raw") {
  if (Test-Path -LiteralPath $rawDst) {
    Remove-Item -LiteralPath $rawDst -Recurse -Force
  }

  New-Item -ItemType Directory -Force -Path $rawDst | Out-Null
  Copy-Item -Path (Join-Path $DumpRoot "*") -Destination $rawDst -Recurse -Force

  $copied = Get-ChildItem -LiteralPath $rawDst -Recurse -File -Force -ErrorAction SilentlyContinue
  $copiedCount = $copied.Count
  $copiedSizeMb = [math]::Round((($copied | Measure-Object Length -Sum).Sum / 1MB), 2)
}

$classTable = ($summaryByClass | ForEach-Object {
  "| $($_.class) | $($_.count) | $($_.size_mb) |"
}) -join "`n"

$extTable = ($summaryByExt | Select-Object -First 15 | ForEach-Object {
  "| $($_.extension) | $($_.count) | $($_.size_mb) |"
}) -join "`n"

$bigLines = ($topBig | Select-Object -First 10 | ForEach-Object {
  "- $($_.relative_path) ($([math]::Round($_.size_bytes / 1MB, 2)) MB)"
}) -join "`n"

$md = @"
# Dump Analysis Report

- Generated: $($summary.generated_at)
- Dump root: $($summary.dump_root)
- Migration mode: $($summary.migrate_mode)
- Total files: $($summary.total_files)
- Total size: $($summary.total_size_mb) MB
- Parseable files: $($summary.parseable_files)
- Parseable size: $($summary.parseable_size_mb) MB
- Copied files: $copiedCount
- Copied size: $copiedSizeMb MB

## By Class
| Class | Count | Size(MB) |
|---|---:|---:|
$classTable

## Top Extensions (15)
| Extension | Count | Size(MB) |
|---|---:|---:|
$extTable

## Largest Files (Top 10)
$bigLines

## Migration Policy
- Full dump is analyzed into CSV/JSON.
- all_parseable: copy parseable assets (html/css/js/json/xml/txt/images/audio/fonts/swf) preserving relative paths.
- all_parseable additionally creates `parsed_dump/littlehome-learn` alias from `.littlehome-learn`.
- math_only: copy only .littlehome-learn/SubPage/MATH.
- all_raw: copy entire dump as-is.
"@

Set-Content -LiteralPath (Join-Path $analysisRoot "report.md") -Value $md -Encoding UTF8

# Build dump manifest from migrated content (prefer non-hidden alias path).
$manifestRootCandidates = @(
  (Join-Path $parseDst "littlehome-learn\SubPage"),
  (Join-Path $parseDst ".littlehome-learn\SubPage"),
  (Join-Path $rawDst "littlehome-learn\SubPage"),
  (Join-Path $rawDst ".littlehome-learn\SubPage")
)
$manifestSubRoot = $manifestRootCandidates | Where-Object { Test-Path -LiteralPath $_ } | Select-Object -First 1

if ($manifestSubRoot) {
  function FirstWebPath([array]$items) {
    if ($items -and $items.Count -gt 0) {
      return To-WebPath -BasePath $ProjectRoot -FullPath $items[0].FullName
    }
    return $null
  }

  $mathEntryCandidates = @(
    (Join-Path $manifestSubRoot "MATH\ps_suh\ps_c_think\ps_c_think_01\main.html"),
    (Join-Path $manifestSubRoot "MATH\main.html"),
    (Join-Path $manifestSubRoot "MATH\index.html")
  )
  $mathEntry = $mathEntryCandidates | Where-Object { Test-Path -LiteralPath $_ } | Select-Object -First 1
  $mathFallback = @(
    (Join-Path $manifestSubRoot "MATH\main.html"),
    (Join-Path $manifestSubRoot "MATH\index.html")
  ) | Where-Object { Test-Path -LiteralPath $_ } | Select-Object -First 1

  $lib = @()
  $libRoot = Join-Path $manifestSubRoot "LIB"
  if (Test-Path -LiteralPath $libRoot) {
    Get-ChildItem -LiteralPath $libRoot -Directory | Sort-Object Name | ForEach-Object {
      $packDir = $_.FullName
      $images = @(Get-ChildItem -LiteralPath (Join-Path $packDir "image") -File -ErrorAction SilentlyContinue | Sort-Object Name)
      $audios = @(Get-ChildItem -LiteralPath (Join-Path $packDir "audio") -File -ErrorAction SilentlyContinue | Sort-Object Name)
      $swf = @(Get-ChildItem -LiteralPath $packDir -Recurse -File -Filter *.swf -ErrorAction SilentlyContinue | Sort-Object FullName)

      $lib += [pscustomobject]@{
        id = $_.Name
        title = "LIB $($_.Name)"
        image_count = $images.Count
        audio_count = $audios.Count
        swf_count = $swf.Count
        first_image = FirstWebPath $images
        first_audio = FirstWebPath $audios
        first_swf = FirstWebPath $swf
        images = @($images | ForEach-Object { To-WebPath -BasePath $ProjectRoot -FullPath $_.FullName })
        audios = @($audios | ForEach-Object { To-WebPath -BasePath $ProjectRoot -FullPath $_.FullName })
        swf = @($swf | ForEach-Object { To-WebPath -BasePath $ProjectRoot -FullPath $_.FullName })
      }
    }
  }

  $sci = @()
  $sciRoot = Join-Path $manifestSubRoot "SCI"
  if (Test-Path -LiteralPath $sciRoot) {
    Get-ChildItem -LiteralPath $sciRoot -Directory | Sort-Object Name | ForEach-Object {
      $packDir = $_.FullName
      $contents = @(Get-ChildItem -LiteralPath (Join-Path $packDir "contents") -File -ErrorAction SilentlyContinue | Sort-Object Name)
      $xml = @(Get-ChildItem -LiteralPath (Join-Path $packDir "xml") -File -ErrorAction SilentlyContinue | Sort-Object Name)
      $swf = @(Get-ChildItem -LiteralPath $packDir -Recurse -File -Filter *.swf -ErrorAction SilentlyContinue | Sort-Object FullName)
      $images = @($contents | Where-Object { $_.Extension -match '^(?i)\.(png|jpg|jpeg|gif|webp|bmp)$' })
      $audios = @($contents | Where-Object { $_.Extension -match '^(?i)\.(mp3|wav|ogg|m4a)$' })

      $sci += [pscustomobject]@{
        id = $_.Name
        title = "SCI $($_.Name)"
        content_count = $contents.Count
        xml_count = $xml.Count
        swf_count = $swf.Count
        first_image = FirstWebPath $images
        first_audio = FirstWebPath $audios
        first_xml = FirstWebPath $xml
        first_swf = FirstWebPath $swf
        contents = @($contents | ForEach-Object { To-WebPath -BasePath $ProjectRoot -FullPath $_.FullName })
        xml = @($xml | ForEach-Object { To-WebPath -BasePath $ProjectRoot -FullPath $_.FullName })
        swf = @($swf | ForEach-Object { To-WebPath -BasePath $ProjectRoot -FullPath $_.FullName })
      }
    }
  }

  $manifest = [pscustomobject]@{
    generated_at = (Get-Date).ToString("yyyy-MM-dd HH:mm:ss")
    source = "도경이 어플 dump"
    subpage_root = To-WebPath -BasePath $ProjectRoot -FullPath $manifestSubRoot
    math = [pscustomobject]@{
      title = "MATH 생각수학"
      entry = if ($mathEntry) { To-WebPath -BasePath $ProjectRoot -FullPath $mathEntry } else { $null }
      fallback = if ($mathFallback) { To-WebPath -BasePath $ProjectRoot -FullPath $mathFallback } else { $null }
    }
    lib = $lib
    sci = $sci
  }

  $dumpManifestJsonPath = Join-Path $importRoot "dump_manifest.json"
  $dumpManifestJsPath = Join-Path $importRoot "dump_manifest.js"

  $manifestJsonRaw = $manifest | ConvertTo-Json -Depth 9
  Set-Content -LiteralPath $dumpManifestJsonPath -Value $manifestJsonRaw -Encoding UTF8
  Set-Content -LiteralPath $dumpManifestJsPath -Value ("window.__DUMP_MANIFEST__ = " + $manifestJsonRaw + ";") -Encoding UTF8
}

Write-Output "analysis=$analysisRoot"
Write-Output "migrate_mode=$MigrateMode"
if ($MigrateMode -eq "math_only") {
  Write-Output "migrated_path=$mathDst"
}
elseif ($MigrateMode -eq "all_parseable") {
  Write-Output "migrated_path=$parseDst"
}
else {
  Write-Output "migrated_path=$rawDst"
}
Write-Output "copied_files=$copiedCount"
Write-Output "copied_size_mb=$copiedSizeMb"
if ($manifestSubRoot) {
  Write-Output "manifest_sub_root=$manifestSubRoot"
}

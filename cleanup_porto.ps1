$files = Get-ChildItem -Recurse -Include "*.ts","*.tsx","*.json","*.md","*.yml" | Where-Object { $_.FullName -notmatch "node_modules" }

$replacements = @{
  "Passport BSides Porto" = "Passport BSides"
  "BSides Porto 2026" = "BSides"
  "BSides Porto" = "BSides"
  "organização do BSides Porto" = "organization"
  "staff@bsidesporto.pt" = "staff@yourevent.example.com"
  "PORTO" = "Your City"
  "ISEP, Porto" = "Your Venue"
  "https://bsidesporto.pt" = "https://yourevent.example.com"
  "passport-bsides-porto-production.up.railway.app" = "your-app.up.railway.app"
}

foreach ($file in $files) {
  $content = Get-Content $file.FullName -Raw -ErrorAction SilentlyContinue
  if (-not $content) { continue }
  $changed = $false
  foreach ($key in $replacements.Keys) {
    if ($content -match [regex]::Escape($key)) {
      $content = $content -replace [regex]::Escape($key), $replacements[$key]
      $changed = $true
    }
  }
  if ($changed) {
    Set-Content $file.FullName $content -NoNewline
    Write-Host "OK: $($file.Name)"
  }
}

Write-Host "Done."
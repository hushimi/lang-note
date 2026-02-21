# PowerShell script to delete merged branches
# This script deletes all merged branches except main, master, and develop

$protectedBranches = @('main', 'master', 'develop')
$currentBranch = git rev-parse --abbrev-ref HEAD

Write-Host "Checking for merged branches to delete..." -ForegroundColor Cyan

# Get all merged branches
$mergedBranches = git branch --merged | ForEach-Object { $_.Trim() -replace '^\* ', '' } | Where-Object {
    $branch = $_.Trim()
    $branch -ne $currentBranch -and
    $protectedBranches -notcontains $branch -and
    $branch -ne ''
}

if ($mergedBranches.Count -eq 0) {
    Write-Host "No merged branches to delete." -ForegroundColor Yellow
    exit 0
}

Write-Host "`nFound merged branches:" -ForegroundColor Green
$mergedBranches | ForEach-Object { Write-Host "  - $_" -ForegroundColor Gray }

$confirm = Read-Host "`nDelete these branches? (y/N)"
if ($confirm -ne 'y' -and $confirm -ne 'Y') {
    Write-Host "Cancelled." -ForegroundColor Yellow
    exit 0
}

$deleted = 0
$failed = 0

foreach ($branch in $mergedBranches) {
    Write-Host "Deleting branch: $branch" -ForegroundColor Cyan
    $result = git branch -d $branch 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "  ✓ Deleted: $branch" -ForegroundColor Green
        $deleted++
    } else {
        Write-Host "  ✗ Failed to delete: $branch" -ForegroundColor Red
        Write-Host "    $result" -ForegroundColor Red
        $failed++
    }
}

Write-Host "`nSummary:" -ForegroundColor Cyan
Write-Host "  Deleted: $deleted" -ForegroundColor Green
if ($failed -gt 0) {
    Write-Host "  Failed: $failed" -ForegroundColor Red
}

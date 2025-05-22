param (
    [Parameter(Mandatory = $true)]
    [string]$tag
)

$repo = "stego416/ambys"

# Push the images
Write-Host "Pushing Docker images..."
docker push "${repo}:$tag"
docker push "${repo}:latest"
if ($LASTEXITCODE -ne 0) {
    Write-Host "Failed to push Docker image" -ForegroundColor Red
    exit $LASTEXITCODE
}

Write-Host "All Docker images built successfully!" -ForegroundColor Green
param (
    [Parameter(Mandatory = $true)]
    [string]$tag
)

$repo = "stego416/ambys"

# Get the directory of the current script
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
# Set working dir to script location.
Set-Location -Path $scriptDir

# Define the paths to the Dockerfiles relative to the script directory
$dockerContext = "../"

# Build the images
Write-Host "Building Docker images..."
docker build -t "${repo}:$tag" -f "./Dockerfile" $dockerContext
docker build -t "${repo}:latest" -f "./Dockerfile" $dockerContext 
if ($LASTEXITCODE -ne 0) {
    Write-Host "Failed to build Docker image" -ForegroundColor Red
    exit $LASTEXITCODE
}

Write-Host "All Docker images built successfully!" -ForegroundColor Green
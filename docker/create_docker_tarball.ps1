param (
    [Parameter(Mandatory = $true)]
    [string]$tag,

    [Parameter(Mandatory = $true)]
    [string]$tarballPath
)

if ($tarballPath.EndsWith(".tar")) {
    Write-Host "Do not provide a file name, just the containing directory." -ForegroundColor Red
    exit
}

if ($tarballPath.EndsWith("\")) {
    Write-Host "No ending slash." -ForegroundColor Red
    exit
}

if ($tarballPath.EndsWith("/")) {
    Write-Host "No ending slash." -ForegroundColor Red
    exit
}

$tarballFilePath = $tarballPath + "/ambys_images.tar"

$repo = "stego416/ambys"

docker save -o $tarballFilePath postgres:17-alpine3.20 ${repo}:$tag ${repo}:latest

Write-Output "Docker images have been saved to $tarballPath"
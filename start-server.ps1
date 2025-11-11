param(
    [int]$Port = 8000,
    [string]$Host = 'localhost',
    [string]$Root = $PSScriptRoot
)

$listener = New-Object System.Net.HttpListener
$started = $false
$attempts = 20

for ($i = 0; $i -lt $attempts; $i++) {
    $url = "http://$Host:$Port/"
    $listener.Prefixes.Clear()
    $listener.Prefixes.Add($url)
    try {
        $listener.Start()
        $started = $true
        break
    } catch [System.Net.HttpListenerException] {
        Write-Host "Port $Port unavailable (in use or URL ACL conflict). Trying next..." -ForegroundColor Yellow
        $Port++
    }
}

if (-not $started) {
    Write-Error "Could not start server. Try running as admin or use a different port."
    exit 1
}

Write-Host "Starting server at $url" -ForegroundColor Green
Write-Host "Press Ctrl+C to stop" -ForegroundColor Yellow

Start-Process $url

try {
    while ($listener.IsListening) {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response
        
        $path = if ($request.Url.LocalPath -eq '/') { 
            'index.html' 
        } else { 
            $request.Url.LocalPath.TrimStart('/') 
        }
        
        $fullPath = Join-Path $Root $path
        
        Write-Host "$($request.HttpMethod) $($request.Url.LocalPath)" -ForegroundColor Cyan
        
        if (Test-Path $fullPath -PathType Leaf) {
            $content = [System.IO.File]::ReadAllBytes($fullPath)
            $ext = [System.IO.Path]::GetExtension($fullPath)
            
            $contentType = switch ($ext) {
                '.html' { 'text/html' }
                '.css'  { 'text/css' }
                '.js'   { 'application/javascript' }
                '.jpg'  { 'image/jpeg' }
                '.jpeg' { 'image/jpeg' }
                '.png'  { 'image/png' }
                '.gif'  { 'image/gif' }
                '.svg'  { 'image/svg+xml' }
                '.json' { 'application/json' }
                default { 'application/octet-stream' }
            }
            
            $response.ContentType = $contentType
            $response.ContentLength64 = $content.Length
            $response.StatusCode = 200
            $response.OutputStream.Write($content, 0, $content.Length)
        } else {
            $response.StatusCode = 404
            $errorMsg = [System.Text.Encoding]::UTF8.GetBytes("404 - File Not Found")
            $response.OutputStream.Write($errorMsg, 0, $errorMsg.Length)
        }
        
        $response.Close()
    }
}
finally {
    try { if ($listener.IsListening) { $listener.Stop() } } catch {}
}

param(
    [int]$Port = 8000
)

$Root = $PSScriptRoot

Write-Host "Starting server on http://localhost:$Port" -ForegroundColor Green
Write-Host "Press Ctrl+C to stop" -ForegroundColor Yellow
Write-Host ""

$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$Port/")

try {
    $listener.Start()
    Write-Host "Server started successfully!" -ForegroundColor Green
    Start-Process "http://localhost:$Port"
    
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
                '.xml'  { 'application/xml' }
                '.woff' { 'font/woff' }
                '.woff2' { 'font/woff2' }
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
catch {
    Write-Host "Error: $_" -ForegroundColor Red
    Write-Host "Make sure you're running as Administrator or try a different port." -ForegroundColor Yellow
}
finally {
    if ($listener) {
        $listener.Stop()
        $listener.Dispose()
    }
}

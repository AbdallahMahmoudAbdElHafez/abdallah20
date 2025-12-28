$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$BaseDir = Split-Path -Parent $ScriptDir
$Logo = Join-Path $BaseDir "server\src\assets\images\2c2a2437-62b6-4446-8701-4269d9bef3d9.png"
$VbsPath = Join-Path $ScriptDir "run_hidden.vbs"

$WshShell = New-Object -ComObject WScript.Shell
$DesktopPath = [System.IO.Path]::Combine($env:USERPROFILE, "Desktop")
$StartupPath = [System.IO.Path]::Combine($env:APPDATA, "Microsoft\Windows\Start Menu\Programs\Startup")

Write-Host "Creating shortcuts for path: $BaseDir"

# Desktop Shortcut
$Shortcut = $WshShell.CreateShortcut("$DesktopPath\Nurivina ERP.lnk")
$Shortcut.TargetPath = "wscript.exe"
$Shortcut.Arguments = """$VbsPath"""
$Shortcut.IconLocation = $Logo
$Shortcut.Save()

# Startup Shortcut
$StartupShortcut = $WshShell.CreateShortcut("$StartupPath\Nurivina ERP.lnk")
$StartupShortcut.TargetPath = "wscript.exe"
$StartupShortcut.Arguments = """$VbsPath"""
$StartupShortcut.IconLocation = $Logo
$StartupShortcut.Save()

Write-Host "Successfully created shortcuts with custom icon!"

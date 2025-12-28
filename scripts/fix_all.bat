@echo off
set "SCRIPT_DIR=g:\عبدالله\nurivina\abdallah20\scripts"
set "LOGO=g:\عبدالله\nurivina\abdallah20\server\src\assets\images\2c2a2437-62b6-4446-8701-4269d9bef3d9.png"

echo Creating Desktop Shortcut...
powershell -Command "$s=(New-Object -Com WScript.Shell).CreateShortcut('%USERPROFILE%\Desktop\Nurivina ERP.lnk');$s.TargetPath='wscript.exe';$s.Arguments='\"%SCRIPT_DIR%\run_hidden.vbs\"';$s.IconLocation='%LOGO%';$s.Save()"

echo Creating Startup Shortcut...
powershell -Command "$s=(New-Object -Com WScript.Shell).CreateShortcut('%APPDATA%\Microsoft\Windows\Start Menu\Programs\Startup\Nurivina ERP.lnk');$s.TargetPath='wscript.exe';$s.Arguments='\"%SCRIPT_DIR%\run_hidden.vbs\"';$s.IconLocation='%LOGO%';$s.Save()"

echo Done!

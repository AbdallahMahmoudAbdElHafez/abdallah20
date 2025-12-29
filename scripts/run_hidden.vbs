Set WshShell = CreateObject("WScript.Shell")
strPath = WScript.ScriptFullName
Set objFSO = CreateObject("Scripting.FileSystemObject")
strFolder = objFSO.GetParentFolderName(strPath)
WshShell.Run """" & strFolder & "\start_app.bat""", 0, False

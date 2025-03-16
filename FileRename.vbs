 Option Explicit
 On Error Resume Next

 Dim fso

 Set fso = CreateObject("Scripting.FileSystemObject")  
 
 ' Remark:
 ' Sub routine to rename a file
 ' TODO: Handle failure in case
 '   => File is already open
 Sub RenFile(theFolder, theFileName, NewName)

  Dim tmp

  ' Remark:
  ' Windows limitation where file name are not case sensitive
  ' Renaming a file with a lower/upper case of the same name results in error
  '
  If StrComp(theFileName, NewName, vbTextCompare) = 0 Then
  
  	tmp = "~" & fso.GetFile(theFolder & "\\" & theFileName).Name

	fso.GetFile(theFolder & "\\" & theFileName).Name = tmp
	fso.GetFile(theFolder & "\\" & tmp).Name = NewName
  Else
	fso.GetFile(theFolder & "\\" & theFileName).Name = NewName
  End If
    
 End Sub
 

 '
 ' Main Program
 '
 Dim folder, folderName, file

 folderName = InputBox( "Provide Path to the folder to bulk rename files.", "Rename Files in Folder", "C:\\Users\\") 
 Set folder = fso.GetFolder(folderName)  

 count = 0
 For Each file In folder.Files  
   RenFile folderName, file.Name, LCase(file.Name)
 Next

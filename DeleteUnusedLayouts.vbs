'
' /** Use this script with care **/
'
' Context: A large powerpoint file size could be due to the many unused slide layouts.
'          Powerpoint does not provide a quick way to delete them. Manually deleting them
'          can be quite a cumbersome activity.
'
'          Here is a VBA (Visual Basic for Apps) script that automates the task of removing 
'          unused layouts from a ppt file.
'
' HowTo:   Goto Menu: Tools -> Macro -> Visual Basic Editor     
'
'          In case there is no default module Goto Menu: Insert -> Module
'
'          Select inserted module in the VBA Project tree on left hand side
'
'          On the right hand pane - Paste the below VBA macro code.
'
'          Close the VBA editor screen
'
'          Goto Powerpoint Menu: Tools -> Macro -> Macros
'
'          Select macro by name =>> DeleteUnusedLayouts
'
'          On the Macros dialog, Select the macro and press the "Run" button
'
'          After a while... you will notice all unused layouts removed
'
'          Go back to the Menu: Tools -> Macro -> Visual Basic Editor
'
'          Delete entire macro code 
'
'          Save the file 

Sub DeleteUnusedLayouts()

  Dim pptApp As Object
  Dim pres As Presentation
  Dim dsign As design
  Dim layout As CustomLayout

  ' Create PowerPoint object and open presentation
  Set pptApp = CreateObject("Powerpoint.Application")
  Set pres = pptApp.ActivePresentation

  ' Loop through each Design theme
  For Each dsign In pres.Designs

    ' Loop through layouts in reverse order (safe deletion)
    For i = dsign.SlideMaster.CustomLayouts.Count To 1 Step -1
      Set layout = dsign.SlideMaster.CustomLayouts(i)

      ' Check if layout is used in any slide
      Dim isUsed As Boolean
      isUsed = False
      For Each Slide In pres.Slides
        If Slide.CustomLayout Is layout Then
          isUsed = True
          Exit For ' Exit loop if used
        End If
      Next Slide

      ' Delete unused layout
      If Not isUsed Then
        layout.Delete
      End If
    Next i
  Next dsign

  ' Clean up
  Set layout = Nothing
  Set dsign = Nothing
  Set pres = Nothing
  Set pptApp = Nothing

End Sub

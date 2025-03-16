'
' Date: 16-Mar-2025
' IncomeTax.vbs - Generic function to compute income tax based on tax slabs for a Financial Year
' 
Public Function IncomeTax(Year As String, Regime As String, value As Double) As Double
  
    Dim taxSlabs As Variant
    Dim Tax, Factor, Income As Double
    
    Tax = 0#
    Factor = 100000
    Income = value / Factor             ' Reduce value by 100,000 factor for simple scale

    ' Tax slabs are designed as a multi dimensional array with highest tab slab at first
    ' Ex: 20, 24, 0.25; => lower-bound, upper-bound, tax-rate%

    Select Case UCase(Trim(Year)) & UCase(Trim(Regime))
    Case "FY202425NEW"
        taxSlabs = [{ 15,-1,0.3; 12,15,0.2; 10,12,0.15; 7,10,0.1; 3,7,0.05 }]
           
    Case "FY202425OLD"
        taxSlabs = [{ 10,-1,0.3; 5,10,0.2; 2.5,5,0.05 }]

    Case "FY202526NEW"
        taxSlabs = [{ 24,-1,0.3; 20,24,0.25; 16,20,0.2; 12,16,0.15; 8,12,0.1; 4,8,0.05 }]
    
    Case "FY202526OLD"
        taxSlabs = [{ 10,-1,0.3; 5,10,0.2; 2.5,5,0.05 }]
    
    Case Else
        ' Zero Slab
        taxSlabs = [{ 0,0,0; 0,0,0}]
    
    End Select

    Tax = Factor * ComputeTax(taxSlabs, Income)
    IncomeTax = Tax

End Function

Private Function ComputeTax(taxSlabs As Variant, value As Double) As Double
   
    Dim Tax, Income As Double
    
    Tax = 0#
    Income = value
    
    For ptr = LBound(taxSlabs, 1) To UBound(taxSlabs, 1)
        
        '  taxSlab(ptr,1),  taxSlab(ptr,2),  taxSlab(ptr,3)
        '  pattern:   20, 24, 0.25; => lower-bound, upper-bound, tax-rate%
        
        If Income > taxSlabs(ptr, 1) Then
                Tax = Tax + (Income - taxSlabs(ptr, 1)) * taxSlabs(ptr, 3)
                Income = taxSlabs(ptr, 1)
        End If
    Next
    
    ' Levy Surcharge above 1Cr or above 50 Lkh
    If value > 100 Then
        Tax = Tax + Tax * 0.2
    ElseIf value > 50 Then
        Tax = Tax + Tax * 0.1
    End If

    ' Levy cess
    Tax = Tax + Tax * 0.04
    ComputeTax = Tax
    
End Function

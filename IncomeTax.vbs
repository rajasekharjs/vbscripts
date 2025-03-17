'
' Date: 16-Mar-2025
' IncomeTax.vbs - Generic function to compute income tax based on tax slabs for a Financial Year
' 
Public Function IncomeTax(Year As String, Regime As String, value As Double) As Double
  
    ' Design Tax slabs as a multi dimensional array
    ' Tax slab pattern:   24, 0.3; => lower bound, tax rate%
    
    Dim taxSlabs As Variant
    Dim Tax, Factor, Income As Double
    
    Tax = 0#
    Factor = 100000
    Income = value / Factor
    
    Select Case UCase(Trim(Year)) & UCase(Trim(Regime))
    Case "FY202425NEW"
        taxSlabs = [{ 15,0.3; 12,0.2; 10,0.15; 7,0.1; 3,0.05 }]
            
    Case "FY202425OLD"
        taxSlabs = [{ 10,0.3; 5,0.2; 2.5,0.05 }]

    Case "FY202526NEW"
        taxSlabs = [{ 24,0.3; 20,0.25; 16,0.2; 12,0.15; 8,0.1; 4,0.05 }]
    
    Case "FY202526OLD"
        taxSlabs = [{ 10,0.3; 5,0.2; 2.5,0.05 }]
    
    Case Else
        ' Zero Slab
        taxSlabs = [{ 0,0; 0,0}]
    
    End Select

    Tax = Factor * ComputeTax(taxSlabs, Income)
    IncomeTax = Tax

End Function

Private Function ComputeTax(taxSlabs As Variant, value As Double) As Double
   
    Dim Tax, Income As Double
    
    Tax = 0#
    Income = value
    
    For ptr = LBound(taxSlabs, 1) To UBound(taxSlabs, 1)
        
        '  taxSlab(ptr,1),  taxSlab(ptr,2)
        '  pattern:   24, 0.3; => lower bound, tax rate%
        
        If Income > taxSlabs(ptr, 1) Then
                Tax = Tax + (Income - taxSlabs(ptr, 1)) * taxSlabs(ptr, 2)
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

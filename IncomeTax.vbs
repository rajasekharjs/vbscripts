
Public Function IncomeTax(value As Double, Optional Year As String = "", Optional Regime As String = "NEW") As Double

    ' Design Tax slabs as a multi dimensional array
    ' Tax slab pattern:   24, 0.3; => lower bound, tax rate%
    
    Dim taxSlabs As Variant
    Dim Tax, Factor, Income As Double
    
    Tax = 0#
    Factor = 100000
    Income = value / Factor
    
    If Year = "" Then Year = "FY202526"
    
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
        taxSlabs = Application.Evaluate("{ 0,0; 0,0}")
    
    End Select

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

    ' Levy 4% cess
    Tax = Factor * (Tax + Tax * 0.04)
    
    IncomeTax = Tax

End Function

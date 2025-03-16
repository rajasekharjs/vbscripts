// 
// Process electricity billing data based on the tariff published by electricity distribution company TSSPDCL
// Applicable Tariffs are encoded in functions Tariff_* 
//

// =======================================# Test Data

const $case_110662173 = 'TSSPDCL,LT,DOM,0,110662173~03-Jun-20, 9447,  9886,  439, -1150~07-May-20, 9447,  9447,  242, 1319~08-Apr-20, 9447,  9447,  264, 1537~03-Mar-20, 9368,  9447,  79 , 185';
const $case_109485222 = 'TSSPDCL,LT,DOM,0,109485222~08-Jun-20, 27977, 30364, 2387, 14766~07-May-20, 27977, 27977, 358 , 2314~08-Apr-20, 27977, 27977, 298 , 1799~10-Mar-20, 27670, 27977, 307 , 1842';
const $case_109485223 = 'TSSPDCL,LT,DOM,0,109485223~08-Jun-20, 27142, 28258, 1116, -8602~07-May-20, 27142, 27142, 1512, 13130~08-Apr-20, 27142, 27142, 420 , 2893~10-Mar-20, 26668, 27142, 474 , 3297';
const $case_100417771 = 'TSSPDCL,LT,COM,40,100417771~06-Jun-20, 149933,  150967,  1061 , 12923~09-May-20, 139668,  149933,  0396, 100079~08-Apr-20, 139668,  139668,  4842 , 50606~07-Mar-20, 131096,  139668,  8572 , 88110';
const $case_110229856 = 'TSSPDCL,LT,COM,30,110229856~07-Jun-20, 2686,  2751,  174, -11982~11-May-20, 2638,  2686,  76 , -15284~08-Apr-20, 2638,  2638,  36 , -11214~06-Mar-20, 2603,  2638,  47 , -11147';
const $case_108111058 = 'TSSPDCL,LT,DOM,0,108111058~06-Jun-2020,18207,18284,-530,-1235.00~07-May-2020,18207,18207,316,1954.86~08-Apr-2020,18207,18207,291,1762.00~06-Mar-2020,18019,18207,188,766.00'

const g_Case = []

g_Case.push($case_110662173)
g_Case.push($case_109485222)
g_Case.push($case_109485223)
g_Case.push($case_100417771)
g_Case.push($case_110229856)

// =======================================# Test Data Injection

const LoadData = function($string: string, linesep: string = '~', sep: string = ','): any {

    const $Object = {
        config:  {
            usc: '',
            discom: '',
            category_type: '',
            category_code: '',
            cmd_kw: 0
        },
        bill_info: {

        }
    }

    var $test_case = {}
    $test_case = Object.assign($test_case, $Object)
    
    var s;
    var lines = $string.split(linesep)

    for(var i = 0; i < lines.length; i++) {
    
        var tokens = lines[i].split(sep)

        if(i == 0) {
            if (tokens.length == 5) {
                s = tokens[0]; $test_case.config.discom = s.trim();
                s = tokens[1]; $test_case.config.category_type = s.trim();
                s = tokens[2]; $test_case.config.category_code = s.trim();
                s = tokens[3]; $test_case.config.cmd_kw = s.trim();
                s = tokens[4]; $test_case.config.usc = s.trim();
            }
        }
        else {
            if (tokens.length == 5) {
                
                s = tokens[0]; s =  s.trim();
                $test_case.bill_info[ GetKey(s) ] = {};

                var obj = $test_case.bill_info[ GetKey(s) ]
                            
                s = tokens[0]; obj.bill_date =  s.trim();
                s = tokens[1]; obj.open_reading =  parseInt(s.trim(),10);
                s = tokens[2]; obj.close_reading =  parseInt(s.trim(),10);

                obj.actual = {}
                s = tokens[3]; obj.actual.billed_units = parseInt(s.trim(),10);
                s = tokens[4]; obj.actual.billed_amount = parseFloat(s.trim());
            }
        }            
    }

    return $test_case
}

// =======================================# Helpers

const log = function(s: any) {
    console.log(s)
}

const Round = function(num: number): number {
    return Math.round((num + Number.EPSILON) * 100) / 100
}

const GetKey = function(d: any): string {
    var dt = new Date(d)
    return ('' + dt.getFullYear() + (dt.getMonth()+1+'').padStart(2,'0')) 
} 

const GetMonthShortName = function(key: string): string {
    
    const monthNames = [ "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ]
    return monthNames[(parseInt(key.slice(4, 6), 10) - 1) % 12] + "-" + key.slice(0, 4)
}

const GetMonthLongName = function(key: string): string {
    
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
    return monthNames[(parseInt(key.slice(4, 6), 10) - 1) % 12] + "-" + key.slice(0, 4)
}

const NextMonth = function(key: string): string {

    // Case: NextMonth(202001) = 202002
    // Case: NextMonth(202012) = 202101

    var d1 = new Date(parseInt(key.slice(0,4),10), parseInt(key.slice(4,6),10))
    return d1.getFullYear() + ('' + (1+d1.getMonth())).padStart(2,'0')
}

const PrevMonth = function(key: string): string {

    // Case: PrevMonth(202001) = 201912
    // Case: PrevMonth(202012) = 202011

    var d1 = new Date(parseInt(key.slice(0,4),10), parseInt(key.slice(4,6),10) - 2)
    return d1.getFullYear() + ('' + (1+d1.getMonth())).padStart(2,'0')
}

const DaysInMonth = function(key: string): number {

    // DaysInMonth(202001) = 31
    // DaysInMonth(202002) = 29

    return (new Date(parseInt(key.slice(0,4),10), parseInt(key.slice(4,6),10), 0)).getDate()
}

const DaysBetween = function(d1: any, d2: any): number {

    // DaysBetween(new Date('2020-12-31'), new Date('2020-01-01')) == 365

    return  Math.round(Math.abs((d1 - d2) / (1000 * 60 * 60 * 24)))
}

// =======================================# Tariff

const Tariff_Slabs = function(config: any, units: number, factor: number = 1, step: number = 3) {

    const lt_dom_slab: any[][]  =    
        [
            [0, 100, [0, 50, 1.45, 50, 100, 2.6, 100, 0, 2.6]],
            [100, 200, [0, 100, 3.3, 100, 200, 4.3, 200, 0, 4.3]],
            [200, Number.MAX_SAFE_INTEGER, [0, 200, 5, 200, 300, 7.2, 300, 400, 8.5, 400, 800, 9, 800, 0, 9.5]]
        ]

    const lt_com_slab: any[][] = 
        [        
            [0, 50, [0, 50, 6, 50, 0, 6]],
            [50, Number.MAX_SAFE_INTEGER,[0, 100, 7.5, 100, 300, 8.9, 300, 500, 9.4, 500, 0, 10]]
        ]        

    var nuSlab: number[]
    var tariff_ptr: any [][]

    switch(config.category_type + config.category_code) {
    case 'LTDOM':
        tariff_ptr = lt_dom_slab
        break
    case'LTCOM':
        tariff_ptr = lt_com_slab
        break
    default: 
        tariff_ptr = lt_dom_slab
    }        
   
    var i = 0
    nuSlab = []

    for( var i = 0; i < tariff_ptr.length; i++ ) {

        var lb, ub

        lb = Math.round(tariff_ptr[i][0] * factor)
        ub = Math.round(tariff_ptr[i][1] * factor)

        if( units > lb && units <= ub ) {
            nuSlab = CaliberateSlabRange(tariff_ptr[i][2], factor, step)
            break
        }
    }
    return nuSlab
}

const Tariff_CustomerCharges = function(config: any): number[] {

    var cc : number[]

    switch(config.category_type + config.category_code) {
    case 'LTDOM':
        cc = [0,50,25,50,100,30,100,200,50,200,300,60,300,400,80,400,800,80,800,0,80]
        break
    case'LTCOM':
        cc = [0,50,45,50,100,55,100,300,65,300,500,65,500,0,65]
        break
    default: 
        cc = []
    }  

    return cc;
}

const Tariff_FCCharges = function(config: any): number[] {

    var cc : number[]

    switch(config.category_type + config.category_code) {
    case'LTCOM':
        cc = [0, 50, 50, 50, 0, 60]
        break
    default: 
        cc = []
    }  

    return cc;
}

const Tariff_ElectricityDuty = function(config: any) {

    switch (config.category_type + config.category_code) {
    case 'LTDOM':
        return 0.06
    case 'LTCOM':
        return 0.06
    default:
        break
    }              
    return 0.06
}

// =======================================# Calculations

const CaliberateSlabRange = function(range: readonly number[], factor: number = 1, step = 3): number[] {

    var slabs = range.slice()
    
    if( (range.length < step || range.length % step != 0) || factor == 1) {
        return slabs
    }

    var i = 0
    do {
        slabs[i]   = Math.round(slabs[i]   * factor)
        slabs[i+1] = Math.round(slabs[i+1] * factor)
        i += step
    } while( i < slabs.length )

    return slabs
}

const CalcElectricityDuty = function(units: number, ed: number): number {
    return units * ed
}

const CalcCustomerCharge = function(units: number, range: any, step: number = 3): number {

    var charge: number = 0
    var i = range.length

    if( range.length >= step && (range.length % step == 0) ) {
        do {
            i -= step
            if( (units > range[i] && units <= range[i+1]) || (units > range[i] && range[i+1] == 0)  ) {
                    charge = range[i+2]
                    break;
            }                    
        } while( i >= 0 )
    }

    return charge
}

const CalcFCCharge = function(units: number, range: readonly number[], factor: number = 1, step: number = 3): number {

    var slots: number[] = CaliberateSlabRange(range, factor, step)

    var charge: number = 0
    var i = range.length

    if( slots.length >= step && (slots.length % step == 0) ) {
        do {
            i -= step
            if( (units > range[i] && units <= range[i+1]) || (units > range[i] && range[i+1] == 0)  ) {
                    charge = range[i+2]
                    break;
            }                    
        } while( i >= 0 )
    }

    return (charge *= units)
}

const CalcEnergyCharge = function(units: number, range: readonly number[],  step = 3): number  {

    var lb, ub, diff, price, kwh = units, i = 0, charge = 0

    /* 
     * Test Case: 
     * const trate = [0,200,5.0,200,300,7.2,300,400,8.5,400,800,9.0,800,0,9.5]
     * const tunits = 2415
     * console.log((21512.50 == CalcEnergyCharge(trate, tunits)) ? 'ok' : 'nok')
     */

    do {

        lb = range[i]  
        ub = range[i+1] 
        price = range[i+2] 
        
        diff = ub - lb

        if( diff < 0 || kwh <= diff ) {
             diff = kwh
        }             
        
        kwh -= diff
        charge += (diff * price)

        // log(diff + ' UNITS @PRICE: ' + price + ' = ' + charge + ' BALANCE UNITS: ' + kwh)
        i += step

    } while(kwh > 0 && i <= range.length - step)

    charge += (kwh * price)        // compute any balance units at the highest price

    return charge 
}

// =======================================# Processing

const ProcessBillRow = function(config: any, obj: any, factor: number = 1 ) {

    const units = obj.usage_units

    var calc_electricity_duty = CalcElectricityDuty(units, Tariff_ElectricityDuty(config))
    var calc_customer_charge  = CalcCustomerCharge(units, Tariff_CustomerCharges(config))
    var calc_fc_charge        = (config.category_code == 'COM') ? CalcFCCharge(units, Tariff_FCCharges(config)) : 0
    var calc_energy_charge    = CalcEnergyCharge(units, Tariff_Slabs(config, units, factor))

    obj.usage_amount          = Round( calc_energy_charge 
                                        + calc_electricity_duty 
                                        + calc_customer_charge 
                                        + calc_fc_charge 
                                        )

    obj.bill_diff             = Round(obj.billed_amount - obj.usage_amount)
    obj.units_diff            = Round(obj.billed_units - units)

    return
}

const ProcessBillData = function($data: any) {

    var anomaly_months: any = []

    /*
     * Step 1: 
     *  convert all dates to Date type
     *  find anomaly months by checking their Open and Close reading
     *  Assumption => anomaly months will be consecutive months 
     */

    for(const month in $data.bill_info) {

        var obj = $data.bill_info[month]
        obj.bill_date = new Date(obj.bill_date)

        if (obj.open_reading == obj.close_reading) {
            anomaly_months.push(month)
        }
    }

    /*
     * Step 2: Add a key for Settlement Month
     * Assumption: Bills are settled fully in the subsequent month 
     */

    anomaly_months.sort()
    const key = NextMonth(anomaly_months[anomaly_months.length-1])      
    anomaly_months.push(key)

    const $config = $data.config
    const $billData = $data.bill_info

    /*
     * Step 3: Process bills for Actual and Anomaly
     *    EMU(equated monthly units) = Settlement month's Reading / Count of Months
     *    EMU must always be an Integer
     */

    var net_days, billed_days, factor
    const EMU = Round( $billData[key].actual.billed_units / anomaly_months.length )

    for(const month of anomaly_months) {

        var obj = $billData[month]

        //?? case: when billdate is last date of the month
        net_days = DaysInMonth(PrevMonth(month))   
        billed_days = (($billData[PrevMonth(month)] === undefined) 
                                    ? net_days
                                    : DaysBetween(obj.bill_date, $billData[PrevMonth(month)].bill_date))
        
        factor = billed_days / net_days

        obj.actual.usage_units = EMU
        ProcessBillRow($config, obj.actual,factor)
    }

    /*
     * Step 4: Delete keys in $data.bill_info if they are not anomaly_months
     */

    for(const month in $data.bill_info) {
        if(!anomaly_months.includes(month)) 
            delete $data.bill_info[month]
    }

    return $data
}

const GetAnomaly = function($data: any) {

    var obj: any = {}
    var months: string [] = []

    months =  Object.keys( $data.bill_info )
    months.sort()

    if(months.length >= 2) {
        
        obj.typecode = $data.config.category_type + $data.config.category_code
        obj.usc  = $data.config.usc

        obj.from = GetMonthShortName(months[0])
        obj.to   = GetMonthShortName(months[months.length-1])
        obj.status = ''
        
        obj.net_diff_inr = 0
        obj.net_diff_inr_percentage = 0
        
        obj.net_diff_units = 0
        obj.net_diff_units_percentage = 0

        obj.data = []

        for(const month in $data.bill_info) {
            
            var ctr: any = {}
            ctr.month = GetMonthShortName(month)

            ctr.info = {}
            ctr.info = Object.assign(ctr.info, $data.bill_info[month].actual)
            obj.data.push( ctr )
        }

        /*
         * Amount Net Calculation:
         *  net_diff_inr = June Billed amount  - B:(June Usage Amount - May Bill diff - Apr Bill diff)
         * 
         * Units Net Calculation:
         *  net_diff_units = A: (June Billed units - May Billed Units - Apr Billed units) - C:(June Usage units - May usage dff - Apr usage diff)
         */

        var i = 0
        i = months.length -1
        
        var A =  $data.bill_info[months[i]].actual.billed_units
        var C =  $data.bill_info[months[i]].actual.usage_units
        
        var B =  $data.bill_info[months[i]].actual.usage_amount
        var D =  $data.bill_info[months[i]].actual.usage_amount

        while ( --i >= 0  )  {
            A -= $data.bill_info[months[i]].actual.billed_units 
            C -= $data.bill_info[months[i]].actual.units_diff

            B -= $data.bill_info[months[i]].actual.bill_diff            
            D += $data.bill_info[months[i]].actual.usage_amount 
        }

        obj.net_diff_inr = Round( $data.bill_info[months[months.length-1]].actual.billed_amount - B )
        obj.net_diff_inr_percentage = Round ((obj.net_diff_inr * 100)/ D)

        obj.net_diff_units =  Round(A - C)
        obj.net_diff_units_percentage = Round( (obj.net_diff_units * 100) / A  )

        if(obj.net_diff_inr < 0) {
            obj.status = 'U'
        }
        else if(obj.net_diff_inr > 0 ) {
            obj.status = 'O'
        }
        else {
            obj.status = 'N'
        }
    }
    return obj
}

// =======================================# Main

//for(const kase of g_Case) {
    log('======================<<<<< ')
    log(GetAnomaly(ProcessBillData(LoadData($case_108111058))))
//}
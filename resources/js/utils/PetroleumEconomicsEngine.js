/**
 * PetroleumEconomicsEngine.js
 * 
 * Engine Keekonomian Perminyakan (Petroleum Economics Engine) komprehensif untuk frontend.
 * Dibuat berdasarkan spesifikasi rumus di rumus.md dengan tambahan metrik finansial
 * tingkat lanjut seperti NPV, IRR, Payback Period, dan Profitability Index.
 * 
 * @module PetroleumEconomicsEngine
 * @author Antigravity pair programming with User
 */

// Konstanta Metode Depresiasi
export const DEPRECIATION_METHODS = {
    STRAIGHT_LINE: 'straight_line',
    DECLINING_BALANCE: 'declining_balance',
    UNIT_OF_PRODUCTION: 'unit_of_production',
    SUM_OF_THE_YEAR_DIGITS: 'sum_of_the_year_digits'
};

/**
 * 1. Produksi dengan Decline Rate (Eksponensial Dasar)
 * Rumus: Pt = Pt-1 * (1 - D)
 * 
 * @param {number} prevProduction Produksi tahun sebelumnya (bbl atau Mbbl)
 * @param {number} declineRate Laju penurunan produksi dalam desimal (misal 0.08 untuk 8%)
 * @returns {number} Laju produksi tahun berjalan
 */
export function calculateDeclineRate(prevProduction, declineRate) {
    return prevProduction * (1 - declineRate);
}

/**
 * 2. OPEX Growth Rate (Eskalasi Biaya Operasi)
 * Rumus: OPEX_t = OPEX_t-1 * (1 + i)
 * 
 * @param {number} prevOpex Biaya operasi tahun sebelumnya
 * @param {number} growthRate Inflasi atau laju pertumbuhan biaya dalam desimal (misal 0.05 untuk 5%)
 * @returns {number} Biaya operasi tahun berjalan
 */
export function calculateOpexGrowth(prevOpex, growthRate) {
    return prevOpex * (1 + growthRate);
}

/**
 * 3. Gross Income (Pendapatan Kotor)
 * Rumus: Rt = (Pt * 1000) * Price  (Jika unit produksi adalah Mbbl)
 *        Rt = Pt * Price          (Jika unit produksi adalah bbl)
 * 
 * @param {number} production Laju produksi tahun berjalan
 * @param {number} oilPrice Harga minyak per barel (USD/bbl atau IDR/bbl)
 * @param {boolean} [isProductionInMbbl=true] Apakah input produksi dalam satuan Ribu Barel (Mbbl)
 * @returns {number} Pendapatan kotor tahun berjalan
 */
export function calculateGrossIncome(production, oilPrice, isProductionInMbbl = true) {
    const multiplier = isProductionInMbbl ? 1 : 1;
    return (production * multiplier) * oilPrice;
}

/**
 * 4. Taxable Income (Pendapatan Kena Pajak)
 * Rumus: TI = Income - OPEX - Depresiasi
 * 
 * @param {number} income Pendapatan kotor tahun berjalan
 * @param {number} opex Biaya operasi tahun berjalan
 * @param {number} depreciation Beban penyusutan (depresiasi) tahun berjalan
 * @returns {number} Pendapatan kena pajak tahun berjalan
 */
export function calculateTaxableIncome(income, opex, depreciation) {
    return income - opex - depreciation;
}

/**
 * 5. Tax (Pajak Pendapatan / PPh)
 * Rumus: Jika TI > 0, maka Tax = TI * TaxRate
 *        Jika TI <= 0, maka Tax = 0
 * 
 * @param {number} taxableIncome Pendapatan kena pajak tahun berjalan
 * @param {number} taxRate Tarif pajak dalam desimal (misal 0.51 untuk 51%)
 * @returns {number} Beban pajak tahun berjalan
 */
export function calculateTax(taxableIncome, taxRate) {
    return taxableIncome > 0 ? taxableIncome * taxRate : 0.0;
}

/**
 * 6. Net Cash Flow (NCF)
 * Rumus: Tahun 1: NCF = Income - OPEX - Tax - CapitalCost - NonCapitalCost
 *        Tahun > 1: NCF = Income - OPEX - Tax
 * 
 * @param {number} income Pendapatan kotor tahun berjalan
 * @param {number} opex Biaya operasi tahun berjalan
 * @param {number} tax Beban pajak tahun berjalan
 * @param {number} [capital=0.0] Pengeluaran modal (Capital Investment)
 * @param {number} [nonCapital=0.0] Pengeluaran non-modal (Non Capital Investment)
 * @param {number} [year=1] Tahun proyek (1, 2, dst.)
 * @param {boolean} [deductInvestmentInYear1=true] Apakah investasi dikurangkan rill di tahun ke-1
 * @returns {number} Arus kas bersih tahun berjalan
 */
export function calculateNetCashFlow(
    income,
    opex,
    tax,
    capital = 0.0,
    nonCapital = 0.0,
    year = 1,
    deductInvestmentInYear1 = true
) {
    let ncf = income - opex - tax;

    if (deductInvestmentInYear1 && year === 1) {
        ncf -= (capital + nonCapital);
    }

    return ncf;
}

/**
 * A. Straight Line Depreciation (Metode Garis Lurus)
 * @param {number} capitalCost Nilai investasi kapital awal (K)
 * @param {number} duration Jangka waktu proyek / umur manfaat (N)
 * @returns {number} Nilai depresiasi per tahun
 */
export function calculateStraightLineDepreciation(capitalCost, duration) {
    if (duration <= 0) return 0.0;
    return capitalCost / duration;
}

/**
 * B. Declining Balance Depreciation (Metode Saldo Menurun)
 * @param {number} capitalCost Nilai investasi kapital awal (K)
 * @param {number} duration Jangka waktu proyek / umur manfaat (N)
 * @param {number} year Tahun ke-i (1, 2, dst.)
 * @returns {number} Nilai depresiasi untuk tahun ke-i
 */
export function calculateDecliningBalanceDepreciation(capitalCost, duration, year) {
    if (duration <= 0 || year <= 0) return 0.0;
    const rate = 1.0 / duration;
    return capitalCost * rate * Math.pow(1.0 - rate, year - 1);
}

/**
 * C. Unit of Production Depreciation (Metode Satuan Produksi)
 * @param {number} production Produksi tahun berjalan (Pt)
 * @param {number} totalReserve Total cadangan awal minyak/gas
 * @param {number} capitalCost Nilai investasi kapital awal (K)
 * @returns {number} Nilai depresiasi tahun berjalan
 */
export function calculateUnitOfProductionDepreciation(production, totalReserve, capitalCost) {
    if (totalReserve <= 0) return 0.0;
    return (production / totalReserve) * capitalCost;
}

/**
 * D. Sum of the Year Digits Depreciation (Metode Jumlah Angka Tahun)
 * @param {number} capitalCost Nilai investasi kapital awal (K)
 * @param {number} duration Jangka waktu proyek / umur manfaat (N)
 * @param {number} year Tahun ke-i (1, 2, dst.)
 * @returns {number} Nilai depresiasi untuk tahun ke-i
 */
export function calculateSumOfTheYearDigitsDepreciation(capitalCost, duration, year) {
    if (duration <= 0 || year <= 0 || year > duration) return 0.0;
    const syd = (duration * (duration + 1)) / 2;
    const sisaTahun = duration - year + 1;
    return (sisaTahun / syd) * capitalCost;
}

/**
 * Fungsi Helper Pencabangan Depresiasi Dinamis
 */
export function calculateDepreciation(method, capitalCost, duration, year, additionalParams = {}) {
    switch (method) {
        case DEPRECIATION_METHODS.STRAIGHT_LINE:
            return calculateStraightLineDepreciation(capitalCost, duration);

        case DEPRECIATION_METHODS.DECLINING_BALANCE:
            return calculateDecliningBalanceDepreciation(capitalCost, duration, year);

        case DEPRECIATION_METHODS.UNIT_OF_PRODUCTION:
            const production = additionalParams.production ?? 0.0;
            const totalReserve = additionalParams.total_reserve ?? 0.0;
            return calculateUnitOfProductionDepreciation(production, totalReserve, capitalCost);

        case DEPRECIATION_METHODS.SUM_OF_THE_YEAR_DIGITS:
            return calculateSumOfTheYearDigitsDepreciation(capitalCost, duration, year);

        default:
            return 0.0;
    }
}

/**
 * Menghitung Net Present Value (NPV)
 * @param {number[]} ncfArray Array Net Cash Flow pertahun (misal index 0 untuk Th 0, dst)
 * @param {number} discountRate Tingkat diskonto desimal (misal 0.10 untuk 10%)
 * @returns {number} Nilai NPV
 */
export function calculateNpv(ncfArray, discountRate) {
    let npv = 0.0;
    ncfArray.forEach((ncf, year) => {
        npv += ncf / Math.pow(1.0 + discountRate, year);
    });
    return npv;
}

/**
 * Menghitung Internal Rate of Return (IRR) menggunakan metode Bisection.
 * @param {number[]} ncfArray Array Net Cash Flow pertahun.
 * @param {number} [lowRate=-0.99] Batas bawah
 * @param {number} [highRate=3.0] Batas atas
 * @param {number} [precision=0.00001] Presisi desimal
 * @param {number} [maxIterations=1000] Maksimum iterasi
 * @returns {number|null} Nilai IRR (dalam desimal), atau null jika tidak dapat diselesaikan
 */
export function calculateIrr(
    ncfArray,
    lowRate = -0.99,
    highRate = 3.0,
    precision = 0.00001,
    maxIterations = 1000
) {
    let npvLow = calculateNpv(ncfArray, lowRate);
    let npvHigh = calculateNpv(ncfArray, highRate);

    if (npvLow * npvHigh > 0) {
        return null; // Tanda NPV sama, tidak ada root di antara lowRate & highRate
    }

    for (let i = 0; i < maxIterations; i++) {
        const midRate = (lowRate + highRate) / 2.0;
        const npvMid = calculateNpv(ncfArray, midRate);

        if (Math.abs(npvMid) < precision) {
            return midRate;
        }

        if (npvLow * npvMid < 0) {
            highRate = midRate;
            npvHigh = npvMid;
        } else {
            lowRate = midRate;
            npvLow = npvMid;
        }
    }

    return (lowRate + highRate) / 2.0;
}

/**
 * Menghitung Payback Period (fractional years)
 * @param {number[]} ncfArray Array Net Cash Flow pertahun.
 * @returns {number|null} Jumlah tahun untuk mencapai balik modal, atau null
 */
export function calculatePaybackPeriod(ncfArray) {
    let cumulativeCashFlow = 0.0;
    let prevCumulative = 0.0;
    let hasInvestment = false;

    for (let i = 0; i < ncfArray.length; i++) {
        if (ncfArray[i] < 0) {
            hasInvestment = true;
            break;
        }
    }

    if (!hasInvestment) return 0.0;

    for (let year = 0; year < ncfArray.length; year++) {
        const ncf = ncfArray[year];
        prevCumulative = cumulativeCashFlow;
        cumulativeCashFlow += ncf;

        if (prevCumulative < 0 && cumulativeCashFlow >= 0) {
            if (ncf === 0) return year;
            const fraction = Math.abs(prevCumulative) / ncf;
            return year - 1 + fraction;
        }
    }

    return null;
}

/**
 * Menghitung Profitability Index (PI)
 * @param {number[]} ncfArray Array Net Cash Flow pertahun.
 * @param {number} discountRate Tingkat diskonto
 * @returns {number|null} Nilai Profitability Index
 */
export function calculateProfitabilityIndex(ncfArray, discountRate) {
    let initialOutlay = 0.0;
    let presentValueOfInflows = 0.0;

    ncfArray.forEach((ncf, year) => {
        if (year === 0 || (year === 1 && ncf < 0 && ncfArray.length <= 2)) {
            if (ncf < 0) {
                initialOutlay += Math.abs(ncf);
            }
        } else {
            if (ncf > 0) {
                presentValueOfInflows += ncf / Math.pow(1.0 + discountRate, year);
            } else {
                initialOutlay += Math.abs(ncf) / Math.pow(1.0 + discountRate, year);
            }
        }
    });

    if (initialOutlay <= 0) return null;
    return presentValueOfInflows / initialOutlay;
}

/**
 * Simulasi Keekonomian Proyek Menyeluruh (Simulate Project Economics)
 * 
 * Melakukan komputasi penuh dari parameter awal proyek ke dalam spreadsheet tahunan.
 * 
 * @param {Object} params Parameter masukan proyek:
 * @param {number} params.duration Durasi proyek (tahun)
 * @param {number} params.capital Capital Investment
 * @param {number} params.non_capital Non Capital Investment
 * @param {number} params.production_y1 Produksi tahun ke-1 (Mbbl)
 * @param {number} params.decline_rate Decline rate (desimal, e.g. 0.08 untuk 8%)
 * @param {number} params.oil_price Harga minyak (USD/bbl)
 * @param {number} params.opex_y1 OPEX tahun ke-1
 * @param {number} params.opex_growth Eskalasi OPEX (desimal, e.g. 0.05 untuk 5%)
 * @param {number} params.tax_rate Pajak (desimal, e.g. 0.51 untuk 51%)
 * @param {string} params.depreciation_method Metode depresiasi ('straight_line', 'declining_balance', dll)
 * @param {number} [params.total_reserve] Cadangan awal (untuk Unit of Production)
 * @param {number} [params.discount_rate=0.10] Tingkat diskonto desimal
 * @param {boolean} [params.deduct_investment_in_year_1=true] Jika true investasi di tahun 1, jika false di tahun 0
 * 
 * @returns {Object} { rows, totals, indicators }
 */
export function simulateProjectEconomics(params) {
    const duration = parseInt(params.duration ?? 10);
    const capital = parseFloat(params.capital ?? 0.0);
    const non_capital = parseFloat(params.non_capital ?? 0.0);
    const productionY1 = parseFloat(params.production_y1 ?? 0.0);
    const declineRate = parseFloat(params.decline_rate ?? 0.0);
    const oilPrice = parseFloat(params.oil_price ?? 0.0);
    const opexY1 = parseFloat(params.opex_y1 ?? 0.0);
    const opexGrowth = parseFloat(params.opex_growth ?? 0.0);
    const taxRate = parseFloat(params.tax_rate ?? 0.0);
    const depMethod = params.depreciation_method ?? DEPRECIATION_METHODS.STRAIGHT_LINE;
    const totalReserve = parseFloat(params.total_reserve ?? (productionY1 * duration));
    const discountRate = parseFloat(params.discount_rate ?? 0.10);
    const deductInYear1 = params.deduct_investment_in_year_1 ?? true;

    const initialProductionYears = parseInt(params.initial_production_years ?? 0);
    const productionData = Array.isArray(params.production_data) ? params.production_data : [];

    const rows = [];
    const ncfArray = [];
    const totalInvestment = capital + non_capital;

    let cumulativeNcf = 0.0;

    // Tahun Ke-0 (jika investasi rill di tahun ke-0)
    if (!deductInYear1) {
        rows.push({
            year: 0,
            production: 0.0,
            income: 0.0,
            capital: capital,
            non_capital: non_capital,
            opex: 0.0,
            depreciation: 0.0,
            taxable_income: 0.0,
            tax: 0.0,
            ncf: -totalInvestment,
            cumulative_ncf: -totalInvestment
        });
        ncfArray.push(-totalInvestment);
        cumulativeNcf = -totalInvestment;
    } else {
        // Buat index 0 bernilai 0 jika investasi di tahun 1, agar indexing tahun sesuai
        rows.push({
            year: 0,
            production: 0.0,
            income: 0.0,
            capital: 0.0,
            non_capital: 0.0,
            opex: 0.0,
            depreciation: 0.0,
            taxable_income: 0.0,
            tax: 0.0,
            ncf: 0.0,
            cumulative_ncf: 0.0
        });
        ncfArray.push(0.0);
    }

    let currentProd = 0;
    let lastProduction = 0;
    let cumulativeProduction = 0;
    let currentOpex = opexY1;

    for (let year = 1; year <= duration; year++) {
        // 1. Produksi dengan decline / manual
        if (year <= initialProductionYears) {
            currentProd = parseFloat(productionData[year - 1] ?? 0.0);
        } else {
            if (year === 1) {
                currentProd = productionY1;
            } else {
                currentProd = calculateDeclineRate(lastProduction, declineRate);
            }
        }

        const remainingReserve = Math.max(totalReserve - cumulativeProduction, 0);
        currentProd = Math.min(currentProd, remainingReserve);
        cumulativeProduction += currentProd;

        // 2. OPEX dengan eskalasi (Mulai dari tahun ke-2)
        if (year > 1) {
            currentOpex = calculateOpexGrowth(currentOpex, opexGrowth);
        }

        // 3. Gross Income
        const income = calculateGrossIncome(currentProd, oilPrice, true);

        // 4. Depresiasi
        const depreciation = calculateDepreciation(depMethod, capital, duration, year, {
            production: currentProd,
            total_reserve: totalReserve
        });

        // 5. Taxable Income
        const taxableIncome = calculateTaxableIncome(income, currentOpex, depreciation);

        // 6. Tax
        const tax = calculateTax(taxableIncome, taxRate);

        // 7. Net Cash Flow
        const capDeduct = deductInYear1 ? capital : 0.0;
        const nonCapDeduct = deductInYear1 ? non_capital : 0.0;
        const ncf = calculateNetCashFlow(income, currentOpex, tax, capDeduct, nonCapDeduct, year, deductInYear1);

        cumulativeNcf += ncf;
        ncfArray.push(ncf);

        rows.push({
            year,
            production: currentProd,
            income,
            capital: (year === 1 && deductInYear1) ? capital : 0.0,
            non_capital: (year === 1 && deductInYear1) ? non_capital : 0.0,
            opex: currentOpex,
            depreciation,
            taxable_income: taxableIncome,
            tax,
            ncf,
            cumulative_ncf: cumulativeNcf
        });

        lastProduction = currentProd;
    }

    // Hitung Total Akumulasi
    const totals = {
        production: 0.0,
        income: 0.0,
        capital,
        non_capital,
        opex: 0.0,
        depreciation: 0.0,
        taxable_income: 0.0,
        tax: 0.0,
        ncf: 0.0
    };

    rows.forEach(row => {
        if (row.year > 0) {
            totals.production += row.production;
            totals.income += row.income;
            totals.opex += row.opex;
            totals.depreciation += row.depreciation;
            totals.taxable_income += row.taxable_income;
            totals.tax += row.tax;
        }
        totals.ncf += row.ncf;
    });

    // Hitung Indikator Keekonomian Finansial
    const npv = calculateNpv(ncfArray, discountRate);
    const irr = calculateIrr(ncfArray);
    const payback = calculatePaybackPeriod(ncfArray);
    const profitabilityIndex = calculateProfitabilityIndex(ncfArray, discountRate);

    return {
        rows,
        totals,
        indicators: {
            discount_rate: discountRate,
            npv,
            irr,
            payback_period: payback,
            profitability_index: profitabilityIndex
        }
    };
}

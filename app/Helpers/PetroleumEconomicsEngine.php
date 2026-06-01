<?php

namespace App\Helpers;

/**
 * PetroleumEconomicsEngine
 * 
 * Engine Keekonomian Perminyakan (Petroleum Economics Engine) yang komprehensif.
 * Dibuat berdasarkan spesifikasi rumus di rumus.md dengan tambahan metrik finansial
 * tingkat lanjut seperti NPV, IRR, Payback Period, dan Profitability Index.
 * 
 * @package App\Helpers
 * @author Antigravity pair programming with User
 */
class PetroleumEconomicsEngine
{
    // Konstanta Metode Depresiasi
    const DEPRECIATION_STRAIGHT_LINE = 'straight_line';
    const DEPRECIATION_DECLINING_BALANCE = 'declining_balance';
    const DEPRECIATION_UNIT_OF_PRODUCTION = 'unit_of_production';
    const DEPRECIATION_SUM_OF_THE_YEAR_DIGITS = 'sum_of_the_year_digits';

    /**
     * 1. Produksi dengan Decline Rate (Eksponensial Dasar)
     * Rumus: Pt = Pt-1 * (1 - D)
     * 
     * @param float $prevProduction Produksi tahun sebelumnya (bbl atau Mbbl)
     * @param float $declineRate Laju penurunan produksi dalam desimal (misal 0.08 untuk 8%)
     * @return float Laju produksi tahun berjalan
     */
    public static function calculateDeclineRate(float $prevProduction, float $declineRate): float
    {
        return $prevProduction * (1 - $declineRate);
    }

    /**
     * 2. OPEX Growth Rate (Eskalasi Biaya Operasi)
     * Rumus: OPEX_t = OPEX_t-1 * (1 + i)
     * 
     * @param float $prevOpex Biaya operasi tahun sebelumnya
     * @param float $growthRate Inflasi atau laju pertumbuhan biaya dalam desimal (misal 0.05 untuk 5%)
     * @return float Biaya operasi tahun berjalan
     */
    public static function calculateOpexGrowth(float $prevOpex, float $growthRate): float
    {
        return $prevOpex * (1 + $growthRate);
    }

    /**
     * 3. Gross Income (Pendapatan Kotor)
     * Rumus: Rt = (Pt * 1000) * Price  (Jika unit produksi adalah Mbbl)
     *        Rt = Pt * Price          (Jika unit produksi adalah bbl)
     * 
     * @param float $production Laju produksi tahun berjalan
     * @param float $oilPrice Harga minyak per barel (USD/bbl atau IDR/bbl)
     * @param bool $isProductionInMbbl Apakah input produksi dalam satuan Ribu Barel (Mbbl)
     * @return float Pendapatan kotor tahun berjalan
     */
    public static function calculateGrossIncome(float $production, float $oilPrice, bool $isProductionInMbbl = true): float
    {
        $multiplier = $isProductionInMbbl ? 1000 : 1;
        return ($production * $multiplier) * $oilPrice;
    }

    /**
     * 4. Taxable Income (Pendapatan Kena Pajak)
     * Rumus: TI = Income - OPEX - Depresiasi
     * 
     * @param float $income Pendapatan kotor tahun berjalan
     * @param float $opex Biaya operasi tahun berjalan
     * @param float $depreciation Beban penyusutan (depresiasi) tahun berjalan
     * @return float Pendapatan kena pajak tahun berjalan
     */
    public static function calculateTaxableIncome(float $income, float $opex, float $depreciation): float
    {
        return $income - $opex - $depreciation;
    }

    /**
     * 5. Tax (Pajak Pendapatan / PPh)
     * Rumus: Jika TI > 0, maka Tax = TI * TaxRate
     *        Jika TI <= 0, maka Tax = 0
     * 
     * @param float $taxableIncome Pendapatan kena pajak tahun berjalan
     * @param float $taxRate Tarif pajak dalam desimal (misal 0.51 untuk 51%)
     * @return float Beban pajak tahun berjalan
     */
    public static function calculateTax(float $taxableIncome, float $taxRate): float
    {
        return $taxableIncome > 0 ? $taxableIncome * $taxRate : 0.0;
    }

    /**
     * 6. Net Cash Flow (NCF)
     * Rumus: Tahun 1: NCF = Income - OPEX - Tax - CapitalCost - NonCapitalCost
     *        Tahun > 1: NCF = Income - OPEX - Tax
     * 
     * Catatan: Depresiasi tidak mengurangi NCF karena merupakan pengeluaran non-cash.
     * 
     * @param float $income Pendapatan kotor tahun berjalan
     * @param float $opex Biaya operasi tahun berjalan
     * @param float $tax Beban pajak tahun berjalan
     * @param float $capital Pengeluaran modal (Capital Investment) - biasanya dikurangkan di tahun investasi berjalan
     * @param float $nonCapital Pengeluaran non-modal (Non Capital Investment)
     * @param int $year Tahun proyek (1, 2, dst.)
     * @param bool $deductInvestmentInYear1 Apakah investasi dikurangkan rill di tahun ke-1
     * @return float Arus kas bersih tahun berjalan
     */
    public static function calculateNetCashFlow(
        float $income,
        float $opex,
        float $tax,
        float $capital = 0.0,
        float $nonCapital = 0.0,
        int $year = 1,
        bool $deductInvestmentInYear1 = true
    ): float {
        $ncf = $income - $opex - $tax;

        if ($deductInvestmentInYear1 && $year === 1) {
            $ncf -= ($capital + $nonCapital);
        }

        return $ncf;
    }

    /**
     * A. Straight Line Depreciation (Metode Garis Lurus)
     * Rumus: Depresiasi = K / N
     * 
     * @param float $capitalCost Nilai investasi kapital awal (K)
     * @param int $duration Jangka waktu proyek / umur manfaat (N)
     * @return float Nilai depresiasi per tahun
     */
    public static function calculateStraightLineDepreciation(float $capitalCost, int $duration): float
    {
        if ($duration <= 0) return 0.0;
        return $capitalCost / $duration;
    }

    /**
     * B. Declining Balance Depreciation (Metode Saldo Menurun)
     * Rumus: Rate (R) = 1 / N
     *        Depresiasi_i = K * R * (1 - R)^(i - 1)
     * 
     * @param float $capitalCost Nilai investasi kapital awal (K)
     * @param int $duration Jangka waktu proyek / umur manfaat (N)
     * @param int $year Tahun ke-i (1, 2, dst.)
     * @return float Nilai depresiasi untuk tahun ke-i
     */
    public static function calculateDecliningBalanceDepreciation(float $capitalCost, int $duration, int $year): float
    {
        if ($duration <= 0 || $year <= 0) return 0.0;
        $rate = 1.0 / $duration;
        return $capitalCost * $rate * pow(1.0 - $rate, $year - 1);
    }

    /**
     * C. Unit of Production Depreciation (Metode Satuan Produksi)
     * Rumus: Depresiasi = (Pt / Total Reserve) * K
     * 
     * @param float $production Produksi tahun berjalan (Pt)
     * @param float $totalReserve Total cadangan awal minyak/gas (Total Reserve)
     * @param float $capitalCost Nilai investasi kapital awal (K)
     * @return float Nilai depresiasi tahun berjalan
     */
    public static function calculateUnitOfProductionDepreciation(float $production, float $totalReserve, float $capitalCost): float
    {
        if ($totalReserve <= 0) return 0.0;
        return ($production / $totalReserve) * $capitalCost;
    }

    /**
     * D. Sum of the Year Digits Depreciation (Metode Jumlah Angka Tahun)
     * Rumus: SYD = N * (N + 1) / 2
     *        Sisa Umur = N - i + 1
     *        Depresiasi_i = (Sisa Umur / SYD) * K
     * 
     * @param float $capitalCost Nilai investasi kapital awal (K)
     * @param int $duration Jangka waktu proyek / umur manfaat (N)
     * @param int $year Tahun ke-i (1, 2, dst.)
     * @return float Nilai depresiasi untuk tahun ke-i
     */
    public static function calculateSumOfTheYearDigitsDepreciation(float $capitalCost, int $duration, int $year): float
    {
        if ($duration <= 0 || $year <= 0 || $year > $duration) return 0.0;
        $syd = ($duration * ($duration + 1)) / 2;
        $sisaTahun = $duration - $year + 1;
        return ($sisaTahun / $syd) * $capitalCost;
    }

    /**
     * Fungsi Helper Pencabangan Depresiasi Dinamis
     */
    public static function calculateDepreciation(
        string $method,
        float $capitalCost,
        int $duration,
        int $year,
        array $additionalParams = []
    ): float {
        switch ($method) {
            case self::DEPRECIATION_STRAIGHT_LINE:
                return self::calculateStraightLineDepreciation($capitalCost, $duration);
                
            case self::DEPRECIATION_DECLINING_BALANCE:
                return self::calculateDecliningBalanceDepreciation($capitalCost, $duration, $year);
                
            case self::DEPRECIATION_UNIT_OF_PRODUCTION:
                $production = $additionalParams['production'] ?? 0.0;
                $totalReserve = $additionalParams['total_reserve'] ?? 0.0;
                return self::calculateUnitOfProductionDepreciation($production, $totalReserve, $capitalCost);
                
            case self::DEPRECIATION_SUM_OF_THE_YEAR_DIGITS:
                return self::calculateSumOfTheYearDigitsDepreciation($capitalCost, $duration, $year);
                
            default:
                return 0.0;
        }
    }

    /**
     * Menghitung Net Present Value (NPV)
     * Rumus: NPV = Sum ( NCF_t / (1 + r)^t )
     * 
     * @param array $ncfArray Array berisi Net Cash Flow pertahun. Kunci array dapat dimulai dari tahun 0 atau tahun 1.
     * @param float $discountRate Tingkat diskonto dalam desimal (misal 0.10 untuk 10%)
     * @return float Nilai NPV
     */
    public static function calculateNpv(array $ncfArray, float $discountRate): float
    {
        $npv = 0.0;
        foreach ($ncfArray as $year => $ncf) {
            $npv += $ncf / pow(1.0 + $discountRate, $year);
        }
        return $npv;
    }

    /**
     * Menghitung Internal Rate of Return (IRR) menggunakan metode Bisection.
     * IRR adalah discount rate 'r' di mana NPV = 0.
     * 
     * @param array $ncfArray Array berisi Net Cash Flow pertahun.
     * @param float $lowRate Tebakan batas bawah (default: -0.99)
     * @param float $highRate Tebakan batas atas (default: 3.0)
     * @param float $precision Akurasi target perhitungan (default: 0.00001)
     * @param int $maxIterations Batas maksimal perulangan (default: 1000)
     * @return float|null Nilai IRR (dalam desimal), atau null jika tidak dapat diselesaikan / tidak ditemukan
     */
    public static function calculateIrr(
        array $ncfArray,
        float $lowRate = -0.99,
        float $highRate = 3.0,
        float $precision = 0.00001,
        int $maxIterations = 1000
    ): ?float {
        $npvLow = self::calculateNpv($ncfArray, $lowRate);
        $npvHigh = self::calculateNpv($ncfArray, $highRate);

        // Jika tidak ada perubahan tanda NPV, kemungkinan IRR di luar jangkauan
        if ($npvLow * $npvHigh > 0) {
            return null;
        }

        $irr = 0.0;
        for ($i = 0; $i < $maxIterations; $i++) {
            $midRate = ($lowRate + $highRate) / 2.0;
            $npvMid = self::calculateNpv($ncfArray, $midRate);

            if (abs($npvMid) < $precision) {
                return $midRate;
            }

            if ($npvLow * $npvMid < 0) {
                $highRate = $midRate;
                $npvHigh = $npvMid;
            } else {
                $lowRate = $midRate;
                $npvLow = $npvMid;
            }
        }

        return ($lowRate + $highRate) / 2.0;
    }

    /**
     * Menghitung Payback Period (dalam fractional years)
     * 
     * @param array $ncfArray Array berisi Net Cash Flow pertahun.
     * @return float|null Jumlah tahun untuk mencapai balik modal, atau null jika tidak pernah balik modal.
     */
    public static function calculatePaybackPeriod(array $ncfArray): ?float
    {
        $cumulativeCashFlow = 0.0;
        $prevCumulative = 0.0;
        $hasInvestment = false;
        
        // Cek apakah ada investasi negatif di awal
        foreach ($ncfArray as $year => $ncf) {
            if ($ncf < 0) {
                $hasInvestment = true;
                break;
            }
        }
        
        if (!$hasInvestment) {
            return 0.0; // Tidak ada cashflow negatif, payback instan
        }

        $years = array_keys($ncfArray);
        sort($years);

        for ($i = 0; $i < count($years); $i++) {
            $year = $years[$i];
            $ncf = $ncfArray[$year];
            $prevCumulative = $cumulativeCashFlow;
            $cumulativeCashFlow += $ncf;

            // Jika kumulatif berbalik menjadi positif dari negatif
            if ($prevCumulative < 0 && $cumulativeCashFlow >= 0) {
                if ($ncf == 0) return (float) $year;
                // Interpolasi linear fractional year:
                // Sisa yang dibutuhkan / Aliran kas tahun berjalan
                $fraction = abs($prevCumulative) / $ncf;
                return $year - 1 + $fraction;
            }
        }

        return null; // Tidak pernah balik modal dalam durasi proyek
    }

    /**
     * Menghitung Profitability Index (PI)
     * Rumus: PI = PV Cash Flows / Initial Outlay
     * 
     * @param array $ncfArray Array berisi Net Cash Flow pertahun.
     * @param float $discountRate Tingkat diskonto
     * @return float|null Nilai Profitability Index, atau null jika tidak ada investasi negatif
     */
    public static function calculateProfitabilityIndex(array $ncfArray, float $discountRate): ?float
    {
        $initialOutlay = 0.0;
        $presentValueOfInflows = 0.0;

        foreach ($ncfArray as $year => $ncf) {
            if ($year === 0 || ($year === 1 && $ncf < 0 && count($ncfArray) <= 2)) {
                // Dianggap investasi awal jika NCF negatif di tahun 0/1
                if ($ncf < 0) {
                    $initialOutlay += abs($ncf);
                }
            } else {
                if ($ncf > 0) {
                    $presentValueOfInflows += $ncf / pow(1.0 + $discountRate, $year);
                } else {
                    $initialOutlay += abs($ncf) / pow(1.0 + $discountRate, $year);
                }
            }
        }

        if ($initialOutlay <= 0) return null;
        return $presentValueOfInflows / $initialOutlay;
    }

    /**
     * Simulasi Keekonomian Proyek Menyeluruh
     * 
     * Melakukan komputasi penuh dari parameter awal proyek ke dalam spreadsheet tahunan.
     * Mendukung multi-metode depresiasi, eskalasi OPEX, produksi decline, NPV, IRR, dan Payback.
     * 
     * @param array $params Parameter masukan proyek:
     *                      - duration: int (tahun)
     *                      - capital: float (capital cost)
     *                      - non_capital: float (non capital cost)
     *                      - production_y1: float (produksi tahun ke-1)
     *                      - decline_rate: float (desimal, misal 0.08 untuk 8%)
     *                      - oil_price: float (harga minyak per bbl)
     *                      - opex_y1: float (biaya opex tahun ke-1)
     *                      - opex_growth: float (eskalasi opex, misal 0.0 untuk 0% atau 0.05 untuk 5%)
     *                      - tax_rate: float (desimal, misal 0.51 untuk 51%)
     *                      - depreciation_method: string (straight_line, declining_balance, syd, unit_of_production)
     *                      - total_reserve: float (opsional untuk unit_of_production)
     *                      - discount_rate: float (desimal, misal 0.10 untuk 10%)
     *                      - deduct_investment_in_year_1: bool (default true, jika true investasi di tahun 1, jika false investasi di tahun 0)
     * 
     * @return array Array berisi detail tahunan ('rows'), total akumulatif ('totals'), dan indikator keekonomian ('indicators')
     */
    public static function simulateProjectEconomics(array $params): array
    {
        $duration = (int) ($params['duration'] ?? 10);
        $capital = (float) ($params['capital'] ?? 0.0);
        $nonCapital = (float) ($params['non_capital'] ?? 0.0);
        $productionY1 = (float) ($params['production_y1'] ?? 0.0);
        $declineRate = (float) ($params['decline_rate'] ?? 0.0);
        $oilPrice = (float) ($params['oil_price'] ?? 0.0);
        $opexY1 = (float) ($params['opex_y1'] ?? 0.0);
        $opexGrowth = (float) ($params['opex_growth'] ?? 0.0);
        $taxRate = (float) ($params['tax_rate'] ?? 0.0);
        $depMethod = $params['depreciation_method'] ?? self::DEPRECIATION_STRAIGHT_LINE;
        $totalReserve = (float) ($params['total_reserve'] ?? ($productionY1 * $duration)); // fallback ke total linear jika kosong
        $discountRate = (float) ($params['discount_rate'] ?? 0.10);
        $deductInYear1 = (bool) ($params['deduct_investment_in_year_1'] ?? true);

        $rows = [];
        $ncfArray = [];
        
        $totalInvestment = $capital + $nonCapital;

        // Tahun Ke-0 (Hanya jika investasi rill di tahun ke-0)
        if (!$deductInYear1) {
            $rows[0] = [
                'year' => 0,
                'production' => 0.0,
                'income' => 0.0,
                'capital' => $capital,
                'non_capital' => $nonCapital,
                'opex' => 0.0,
                'depreciation' => 0.0,
                'taxable_income' => 0.0,
                'tax' => 0.0,
                'ncf' => -$totalInvestment,
                'cumulative_ncf' => -$totalInvestment
            ];
            $ncfArray[0] = -$totalInvestment;
        }

        $currentProd = $productionY1;
        $currentOpex = $opexY1;
        $cumulativeNcf = !$deductInYear1 ? -$totalInvestment : 0.0;

        for ($year = 1; $year <= $duration; $year++) {
            // 1. Produksi dengan Decline Rate (Mulai dari tahun ke-2)
            if ($year > 1) {
                $currentProd = self::calculateDeclineRate($currentProd, $declineRate);
            }

            // 2. OPEX Growth Rate (Mulai dari tahun ke-2)
            if ($year > 1) {
                $currentOpex = self::calculateOpexGrowth($currentOpex, $opexGrowth);
            }

            // 3. Gross Income
            $income = self::calculateGrossIncome($currentProd, $oilPrice, true);

            // 4. Depresiasi dinamis berdasarkan metode
            $depreciation = self::calculateDepreciation($depMethod, $capital, $duration, $year, [
                'production' => $currentProd,
                'total_reserve' => $totalReserve
            ]);

            // 5. Taxable Income
            $taxableIncome = self::calculateTaxableIncome($income, $currentOpex, $depreciation);

            // 6. Tax
            $tax = self::calculateTax($taxableIncome, $taxRate);

            // 7. Net Cash Flow (NCF)
            $capDeduct = $deductInYear1 ? $capital : 0.0;
            $nonCapDeduct = $deductInYear1 ? $nonCapital : 0.0;
            $ncf = self::calculateNetCashFlow($income, $currentOpex, $tax, $capDeduct, $nonCapDeduct, $year, $deductInYear1);

            $cumulativeNcf += $ncf;
            $ncfArray[$year] = $ncf;

            $rows[$year] = [
                'year' => $year,
                'production' => $currentProd,
                'income' => $income,
                'capital' => ($year === 1 && $deductInYear1) ? $capital : 0.0,
                'non_capital' => ($year === 1 && $deductInYear1) ? $nonCapital : 0.0,
                'opex' => $currentOpex,
                'depreciation' => $depreciation,
                'taxable_income' => $taxableIncome,
                'tax' => $tax,
                'ncf' => $ncf,
                'cumulative_ncf' => $cumulativeNcf
            ];
        }

        // Hitung Total Akumulasi
        $totals = [
            'production' => 0.0,
            'income' => 0.0,
            'capital' => $capital,
            'non_capital' => $nonCapital,
            'opex' => 0.0,
            'depreciation' => 0.0,
            'taxable_income' => 0.0,
            'tax' => 0.0,
            'ncf' => 0.0
        ];

        foreach ($rows as $row) {
            $totals['production'] += $row['production'];
            $totals['income'] += $row['income'];
            $totals['opex'] += $row['opex'];
            $totals['depreciation'] += $row['depreciation'];
            $totals['taxable_income'] += $row['taxable_income'];
            $totals['tax'] += $row['tax'];
            $totals['ncf'] += $row['ncf'];
        }

        // Hitung Indikator Keekonomian Finansial
        $npv = self::calculateNpv($ncfArray, $discountRate);
        $irr = self::calculateIrr($ncfArray);
        $payback = self::calculatePaybackPeriod($ncfArray);
        $profitabilityIndex = self::calculateProfitabilityIndex($ncfArray, $discountRate);

        return [
            'rows' => $rows,
            'totals' => $totals,
            'indicators' => [
                'discount_rate' => $discountRate,
                'npv' => $npv,
                'irr' => $irr, // null jika tidak ditemukan
                'payback_period' => $payback, // null jika tidak pernah payback
                'profitability_index' => $profitabilityIndex
            ]
        ];
    }
}

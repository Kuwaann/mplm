<?php

namespace Tests\Unit;

use PHPUnit\Framework\TestCase;
use App\Helpers\PetroleumEconomicsEngine;

class PetroleumEconomicsEngineTest extends TestCase
{
    /**
     * Test Produksi dengan Decline Rate
     */
    public function test_production_decline_rate(): void
    {
        $prevProd = 100.0;
        $declineRate = 0.10; // 10%
        
        $expected = 90.0;
        $actual = PetroleumEconomicsEngine::calculateDeclineRate($prevProd, $declineRate);
        
        $this->assertEquals($expected, $actual);
    }

    /**
     * Test OPEX Growth Rate (Eskalasi Biaya)
     */
    public function test_opex_growth_rate(): void
    {
        $prevOpex = 200.0;
        $growthRate = 0.05; // 5%
        
        $expected = 210.0;
        $actual = PetroleumEconomicsEngine::calculateOpexGrowth($prevOpex, $growthRate);
        
        $this->assertEquals($expected, $actual);
    }

    /**
     * Test Gross Income (Pendapatan Kotor)
     */
    public function test_gross_income(): void
    {
        $production = 50.0; // dalam Mbbl
        $price = 60.0;      // USD/bbl
        
        // Produksi Mbbl dikali 1000 agar menjadi bbl, lalu dikali harga
        $expected = 50.0 * 1000 * 60.0; // 3.000.000
        $actual = PetroleumEconomicsEngine::calculateGrossIncome($production, $price, true);
        
        $this->assertEquals($expected, $actual);
    }

    /**
     * Test Taxable Income (Pendapatan Kena Pajak)
     */
    public function test_taxable_income(): void
    {
        $income = 500000.0;
        $opex = 150000.0;
        $depreciation = 50000.0;
        
        $expected = 300000.0;
        $actual = PetroleumEconomicsEngine::calculateTaxableIncome($income, $opex, $depreciation);
        
        $this->assertEquals($expected, $actual);
    }

    /**
     * Test Tax (Pajak PPh)
     */
    public function test_tax(): void
    {
        $taxableIncomePos = 200000.0;
        $taxRate = 0.51; // 51%
        
        $expectedPos = 102000.0;
        $actualPos = PetroleumEconomicsEngine::calculateTax($taxableIncomePos, $taxRate);
        
        $this->assertEquals($expectedPos, $actualPos);

        $taxableIncomeNeg = -50000.0;
        $expectedNeg = 0.0;
        $actualNeg = PetroleumEconomicsEngine::calculateTax($taxableIncomeNeg, $taxRate);

        $this->assertEquals($expectedNeg, $actualNeg);
    }

    /**
     * Test Net Cash Flow (NCF)
     */
    public function test_net_cash_flow(): void
    {
        $income = 400000.0;
        $opex = 100000.0;
        $tax = 153000.0;
        $capital = 80000.0;
        $nonCapital = 20000.0;

        // Tahun 1 dengan pengurangan investasi
        $expectedY1 = $income - $opex - $tax - ($capital + $nonCapital); // 127000
        $actualY1 = PetroleumEconomicsEngine::calculateNetCashFlow($income, $opex, $tax, $capital, $nonCapital, 1, true);
        
        $this->assertEquals($expectedY1, $actualY1);

        // Tahun > 1 tanpa pengurangan investasi
        $expectedY2 = $income - $opex - $tax; // 227000
        $actualY2 = PetroleumEconomicsEngine::calculateNetCashFlow($income, $opex, $tax, $capital, $nonCapital, 2, true);
        
        $this->assertEquals($expectedY2, $actualY2);
    }

    /**
     * Test Metode Depresiasi Garis Lurus (Straight Line)
     */
    public function test_straight_line_depreciation(): void
    {
        $capital = 100000.0;
        $duration = 10;
        
        $expected = 10000.0;
        $actual = PetroleumEconomicsEngine::calculateStraightLineDepreciation($capital, $duration);
        
        $this->assertEquals($expected, $actual);
    }

    /**
     * Test Metode Depresiasi Saldo Menurun (Declining Balance)
     */
    public function test_declining_balance_depreciation(): void
    {
        $capital = 100000.0;
        $duration = 10;
        $rate = 0.10; // 1/10
        
        // Tahun 1: 100000 * 0.10 * (1 - 0.10)^0 = 10000
        $actualY1 = PetroleumEconomicsEngine::calculateDecliningBalanceDepreciation($capital, $duration, 1);
        $this->assertEquals(10000.0, $actualY1);

        // Tahun 2: 100000 * 0.10 * (1 - 0.10)^1 = 9000
        $actualY2 = PetroleumEconomicsEngine::calculateDecliningBalanceDepreciation($capital, $duration, 2);
        $this->assertEquals(9000.0, $actualY2);
    }

    /**
     * Test Metode Depresiasi Satuan Produksi (Unit of Production)
     */
    public function test_unit_of_production_depreciation(): void
    {
        $production = 20.0;
        $reserve = 200.0;
        $capital = 100000.0;
        
        $expected = (20.0 / 200.0) * 100000.0; // 10000
        $actual = PetroleumEconomicsEngine::calculateUnitOfProductionDepreciation($production, $reserve, $capital);
        
        $this->assertEquals($expected, $actual);
    }

    /**
     * Test Metode Depresiasi Jumlah Angka Tahun (Sum of the Year Digits)
     */
    public function test_sum_of_the_year_digits_depreciation(): void
    {
        $capital = 150000.0;
        $duration = 5;
        // SYD = 5 * 6 / 2 = 15
        
        // Tahun 1 sisa umur = 5. Dep = (5/15) * 150000 = 50000
        $actualY1 = PetroleumEconomicsEngine::calculateSumOfTheYearDigitsDepreciation($capital, $duration, 1);
        $this->assertEquals(50000.0, $actualY1);

        // Tahun 5 sisa umur = 1. Dep = (1/15) * 150000 = 10000
        $actualY5 = PetroleumEconomicsEngine::calculateSumOfTheYearDigitsDepreciation($capital, $duration, 5);
        $this->assertEquals(10000.0, $actualY5);
    }

    /**
     * Test Metrik NPV, IRR, dan Payback Period
     */
    public function test_financial_indicators(): void
    {
        // Simulasi investasi awal (tahun 0) dan aliran kas masuk (tahun 1-3)
        $ncfArray = [
            0 => -100.0,
            1 => 40.0,
            2 => 50.0,
            3 => 60.0
        ];
        
        // 1. NPV pada discount rate 10%
        // -100 + 40/1.1 + 50/1.21 + 60/1.331
        $expectedNpv = -100.0 + (40.0 / 1.1) + (50.0 / 1.21) + (60.0 / 1.331);
        $actualNpv = PetroleumEconomicsEngine::calculateNpv($ncfArray, 0.10);
        $this->assertEqualsWithDelta($expectedNpv, $actualNpv, 0.0001);

        // 2. IRR
        // NPV pada IRR harus bernilai sangat mendekati 0
        $actualIrr = PetroleumEconomicsEngine::calculateIrr($ncfArray);
        $this->assertNotNull($actualIrr);
        $npvAtIrr = PetroleumEconomicsEngine::calculateNpv($ncfArray, $actualIrr);
        $this->assertEqualsWithDelta(0.0, $npvAtIrr, 0.0001);
        
        // 3. Payback Period
        // Th 0: -100
        // Th 1: -60 kumulatif
        // Th 2: -10 kumulatif
        // Th 3: +50 kumulatif
        // Payback pada tahun ke 2 + 10/60 = 2.1667 tahun
        $expectedPayback = 2.0 + (10.0 / 60.0);
        $actualPayback = PetroleumEconomicsEngine::calculatePaybackPeriod($ncfArray);
        $this->assertEqualsWithDelta($expectedPayback, $actualPayback, 0.0001);
    }
}

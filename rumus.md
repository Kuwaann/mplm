# Catatan Rumus Keekonomian Migas

Dokumen ini berisi daftar rumus perhitungan ekonomi perminyakan (*Petroleum Economics*) yang digunakan pada kalkulator aplikasi ini. Semua logika perhitungan utama (*calculation engine*) terdapat di dalam file `functions/economics.php`.

---

## 1. Produksi dengan Decline Rate
Metode perhitungan laju penurunan produksi (berdasarkan eksponensial dasar).

- **Lokasi File:** `functions/economics.php`
- **Baris:** `169`
- **Rumus Code:** 
  ```php
  $produksis[] = $prevProduksi * (1 - $declineRate);
  ```
- **Rumus Matematis:**
  `Pt = Pt-1 × (1 - D)`
  *(dimana `Pt` adalah produksi tahun ini, `Pt-1` produksi tahun lalu, dan `D` adalah decline rate)*
- **Keterangan:** Menghitung produksi di tahun berjalan dengan cara mengurangi persentase dari jumlah produksi tahun sebelumnya.

## 2. OPEX Growth Rate (Eskalasi Biaya Operasi)
Perhitungan inflasi atau eskalasi pertumbuhan biaya operasional (OPEX).

- **Lokasi File:** `functions/economics.php`
- **Baris:** `192`
- **Rumus Code:** 
  ```php
  $opexValues[] = $prevOpex * (1 + $growthRate);
  ```
- **Rumus Matematis:**
  `OPEX_t = OPEX_{t-1} × (1 + i)`
  *(dimana `OPEX_t` adalah biaya operasi tahun ini, `OPEX_{t-1}` biaya operasi tahun lalu, dan `i` adalah inflasi / growth rate)*
- **Keterangan:** Ini adalah metode bunga majemuk (*compound*) di mana kenaikan tahunan dihitung berdasarkan basis harga dari tahun persis sebelumnya.

## 3. Gross Income (Pendapatan Kotor)
Perhitungan hasil penjualan dari produksi minyak kotor.

- **Lokasi File:** `functions/economics.php`
- **Baris:** `77`
- **Rumus Code:** 
  ```php
  $income = ($produksi * 1000) * $oilPrice;
  ```
- **Rumus Matematis:**
  `Rt = (Pt × 1000) × Price`
  *(dimana `Rt` adalah Income, `Pt` adalah Produksi dalam Ribu Barel/Mbbl, dan `Price` adalah Harga Minyak)*
- **Keterangan:** Karena input `$produksi` disesuaikan dalam bentuk **Mbbl** (Ribu Barel), dikalikan dengan 1000 agar menjadi *bbl* (barel), kemudian dikali dengan harga minyak.

## 4. Taxable Income (Pendapatan Kena Pajak)
Nilai pendapatan setelah dikurangi kewajiban pemotongan pajak dasar sebelum kena pinalti pajak.

- **Lokasi File:** `functions/economics.php`
- **Baris:** `86`
- **Rumus Code:** 
  ```php
  $taxableIncome = $income - $opex - $depresiasi;
  ```
- **Rumus Matematis:**
  `TI = Income - OPEX - Depresiasi`
  *(dimana `TI` adalah Taxable Income)*
- **Keterangan:** Capital cost tidak dipotong di sini. Beban Depresiasi bertindak sebagai pengurang pajak (*tax shield*).

## 5. Tax (Pajak Pendapatan / PPh)
Perhitungan nilai kewajiban pajak perusahaan.

- **Lokasi File:** `functions/economics.php`
- **Baris:** `89`
- **Rumus Code:** 
  ```php
  $tax = ($taxableIncome > 0) ? $taxableIncome * $taxRate : 0;
  ```
- **Rumus Matematis:**
  Jika TI > 0, maka `Tax = TI × TaxRate`
  Jika TI ≤ 0, maka `Tax = 0`
- **Keterangan:** Pajak hanya berlaku jika `Taxable Income` positif (untung). Jika rugi, maka tidak ada beban pajak (Rp 0 / $0).

## 6. Net Cash Flow (NCF)
Arus Kas Bersih tahunan proyek.

- **Lokasi File:** `functions/economics.php`
- **Baris:** `92` (Rumus NCF utama) dan `95-97` (Pengurangan modal khusus Tahun ke-1)
- **Rumus Code:** 
  ```php
  // Cash flow tahun berjalan
  $ncf = $income - $opex - $tax;
  
  // Khusus untuk Tahun 1 (Year = 1) dikurangi investasi awal (Capital)
  if ($tahun === 1) {
      $ncf -= ($capital + $nonCapital);
  }
  ```
- **Rumus Matematis:**
  Tahun 1: `NCF = Income - OPEX - Tax - CapitalCost - NonCapitalCost`
  Tahun > 1: `NCF = Income - OPEX - Tax`
- **Keterangan:** Depresiasi bukan pengeluaran cash (*non-cash*), sehingga tidak mengurangi NCF. Pengeluaran rill adalah pajak dan pengeluaran modal (Capital / Investasi) yang ditagihkan di tahun pertama proyek berjalan.

---

## METODE DEPRESIASI (PENYUSUTAN)

Terdapat 4 jenis metode penyusutan (depresiasi) untuk aset kapital di dalam aplikasi ini.

### A. Straight Line (Garis Lurus)
Penyusutan dibagi rata sepanjang usia pakai proyek.
- **Lokasi File:** `functions/economics.php` (Baris `228`)
- **Rumus Code:** 
  ```php
  $depresiasi = $capitalCost / $tahun_proyek;
  ```
- **Rumus Matematis:**
  `Depresiasi = K / N`
  *(dimana `K` adalah Capital Cost / Nilai Investasi, dan `N` adalah Umur Proyek)*

### B. Declining Balance (Saldo Menurun)
Penyusutan lebih besar di tahun-tahun awal dan mengecil secara eksponensial di tahun akhir.
- **Lokasi File:** `functions/economics.php` (Baris `238`, `241`)
- **Rumus Code:** 
  ```php
  $rate = 1 / $tahun_proyek;
  $dep = $capitalCost * $rate * pow(1 - $rate, $i - 1); // $i adalah tahun ke-
  ```
- **Rumus Matematis:**
  `Rate (R) = 1 / N`
  `Depresiasi_i = K × R × (1 - R)^(i - 1)`
  *(dimana `i` adalah tahun ke-i)*

### C. Unit of Production (Satuan Produksi)
Penyusutan yang didasarkan langsung pada seberapa banyak cadangan (*reserves*) yang dikuras dalam tahun tersebut.
- **Lokasi File:** `functions/economics.php` (Baris `257`)
- **Rumus Code:** 
  ```php
  $dep = ($produksi / $reserve) * $capitalCost;
  ```
- **Rumus Matematis:**
  `Depresiasi = (Pt / Total Reserve) × K`

### D. Sum of the Year Digits (Jumlah Angka Tahun)
Metode depresiasi dipercepat (*accelerated depreciation*) berdasarkan jumlah deret tahun proyek.
- **Lokasi File:** `functions/economics.php` (Baris `274`, `278`)
- **Rumus Code:** 
  ```php
  $syd = ($tahun_proyek * ($tahun_proyek + 1)) / 2; // Mencari Penyebut
  $dep = ($sisaTahun / $syd) * $capitalCost; // Mengalikan sisa usia dgn Capital
  ```
- **Rumus Matematis:**
  `SYD = N × (N + 1) / 2`
  `Depresiasi_i = (Sisa Umur Tahun ke-i / SYD) × K`

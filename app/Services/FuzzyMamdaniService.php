<?php

namespace App\Services;

class FuzzyMamdaniService
{
    // Fungsi utama perhitungan Fuzzy Mamdani
    public function calculateFuzzyMamdani($inputVariabel)
    {
        // 1. Fuzzifikasi
        $fuzzifikasi = $this->fuzzifikasi($inputVariabel);

        // 2. Inferensi (Rule Evaluation)
        $hasilInferensi = $this->inferensi($fuzzifikasi);

        // 3. Defuzzifikasi menggunakan Center of Gravity
        $hasilAkhir = $this->defuzzifikasiCOG($hasilInferensi);

        return $hasilAkhir;
    }

    // Proses Fuzzifikasi
    private function fuzzifikasi($inputVariabel)
    {
        $fuzzyResult = [];

        // Contoh fungsi keanggotaan segitiga
        foreach ($inputVariabel as $variabel => $nilai) {
            $fuzzyResult[$variabel] = [
                'rendah' => $this->trimf($nilai, [0, 0, 50]),
                'sedang' => $this->trimf($nilai, [0, 50, 100]),
                'tinggi' => $this->trimf($nilai, [50, 100, 100])
            ];
        }

        return $fuzzyResult;
    }

    // Fungsi keanggotaan segitiga (Triangular Membership Function)
    private function trimf($x, $params)
    {
        list($a, $b, $c) = $params;

        if ($x <= $a || $x >= $c) return 0;

        if ($a < $x && $x <= $b) {
            return ($x - $a) / ($b - $a);
        }

        if ($b < $x && $x < $c) {
            return ($c - $x) / ($c - $b);
        }

        return 0;
    }

    // Proses Inferensi (Rule Evaluation)
    private function inferensi($fuzzifikasi)
    {
        $rules = [
            // Contoh aturan fuzzy
            [
                'input' => ['rendah', 'rendah'],
                'output' => 'rendah'
            ],
            [
                'input' => ['sedang', 'sedang'],
                'output' => 'sedang'
            ],
            [
                'input' => ['tinggi', 'tinggi'],
                'output' => 'tinggi'
            ]
        ];

        $hasilInferensi = [];

        foreach ($rules as $rule) {
            // Hitung derajat keanggotaan minimal
            $alphaPredikat = min(
                $fuzzifikasi['variabel1'][$rule['input'][0]],
                $fuzzifikasi['variabel2'][$rule['input'][1]]
            );

            $hasilInferensi[] = [
                'output' => $rule['output'],
                'alphaPredikat' => $alphaPredikat
            ];
        }

        return $hasilInferensi;
    }

    // Defuzzifikasi dengan metode Center of Gravity (COG)
    private function defuzzifikasiCOG($hasilInferensi)
    {
        $zTotal = 0;
        $membershipTotal = 0;

        // Definisikan rentang dan interval
        $ranges = [
            'rendah' => [0, 50],
            'sedang' => [25, 75],
            'tinggi' => [50, 100]
        ];

        foreach ($hasilInferensi as $inferensi) {
            $output = $inferensi['output'];
            $alphaPredikat = $inferensi['alphaPredikat'];

            // Hitung titik tengah
            $range = $ranges[$output];
            $z = ($range[0] + $range[1]) / 2;

            $zTotal += $z * $alphaPredikat;
            $membershipTotal += $alphaPredikat;
        }

        // Cegah pembagian dengan nol
        return $membershipTotal > 0
            ? $zTotal / $membershipTotal
            : 0;
    }
}

// Contoh penggunaan
//     public function calculateExample()
//     {
//     $fuzzyService = new FuzzyMamdaniService();

//     $inputVariabel = [
//         'variabel1' => 40,
//         'variabel2' => 60
//     ];

//     $result = $fuzzyService->calculateFuzzyMamdani($inputVariabel);

//     return $result;
// }

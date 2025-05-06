<?php

namespace App\Services;

use Illuminate\Support\Facades\Log;

class FuzzyWaterQualityService
{
    // Membership Functions for Input Variables

    // pH Membership Functions
    public function muBasa($x)
    {
        if ($x <= 7)
            return 0;
        if ($x > 14)
            return 1;
        if ($x > 7 && $x <= 14)
            return ($x - 7) / (14 - 7);
        return 0;
    }

    public function muNetral($x)
    {
        if ($x <= 6 || $x >= 8)
            return 0;
        if ($x > 6 && $x <= 7)
            return ($x - 6) / (7 - 6);
        if ($x > 7 && $x <= 8)
            return (8 - $x) / (8 - 7);
        return 0;
    }

    public function muAsam($x)
    {
        if ($x <= 0)
            return 1;
        if ($x > 7)
            return 0;
        if ($x > 0 && $x <= 7)
            return (7 - $x) / 7;
        return 0;
    }

    // TDS Membership Functions
    public function muTinggi($x)
    {
        if ($x <= 800)
            return 0;
        if ($x > 1000)
            return 1;
        if ($x > 800 && $x <= 1000)
            return ($x - 800) / (1000 - 800);
        return 0;
    }

    public function muSedang($x)
    {
        if ($x <= 300 || $x >= 1000)
            return 0;
        if ($x > 300 && $x <= 650)
            return ($x - 300) / (650 - 300);
        if ($x > 650 && $x <= 1000)
            return (1000 - $x) / (1000 - 650);
        return 0;
    }

    public function muRendah($x)
    {
        if ($x <= 0)
            return 1;
        if ($x > 500)
            return 0;
        if ($x > 0 && $x <= 500)
            return (500 - $x) / 500;
        return 0;
    }

    // Turbidity Membership Functions
    public function muKeruh($x)
    {
        if ($x <= 25)
            return 0;
        if ($x > 50)
            return 1;
        if ($x > 25 && $x <= 50)
            return ($x - 25) / (50 - 25);
        return 0;
    }

    public function muSedangTurbidity($x)
    {
        if ($x <= 20 || $x >= 30)
            return 0;
        if ($x > 20 && $x <= 25)
            return ($x - 20) / (25 - 20);
        if ($x > 25 && $x <= 30)
            return (30 - $x) / (30 - 25);
        return 0;
    }

    public function muJernih($x)
    {
        if ($x <= 0)
            return 1;
        if ($x > 25)
            return 0;
        if ($x > 0 && $x <= 25)
            return (25 - $x) / 25;
        return 0;
    }

    // Water Quality Output Membership Functions
    public function muBahaya($x)
    {
        if ($x <= 1)
            return 1;
        if ($x > 40)
            return 0;
        if ($x > 1 && $x <= 40)
            return (40 - $x) / (40 - 1);
        return 0;
    }

    public function muWaspada($x)
    {
        if ($x <= 30 || $x >= 70)
            return 0;
        if ($x > 30 && $x <= 50)
            return ($x - 30) / (50 - 30);
        if ($x > 50 && $x <= 70)
            return (70 - $x) / (70 - 50);
        return 0;
    }

    public function muAman($x)
    {
        if ($x <= 60)
            return 0;
        if ($x > 100)
            return 1;
        if ($x > 60 && $x <= 100)
            return ($x - 60) / (100 - 60);
        return 0;
    }

    // Fungsi Himpunan Baru
    public function HimpunanBahayaBaru($x, $y)
    {
        if ($x > $y)
            return (40 - ($x * (40 - 1)));
        if ($x === 0) {
            return 0;
        } else {
            return (($x * 20) + 30);
        }
        ;
    }
    // x = T29, y = T30
    public function HimpunanWaspadaLinearNaikBaru($x, $y)
    {
        if ($x > $y)
            return (40 - ($y * (40 - 1)));
        if ($y === 0) {
            return 0;
        } else {
            return (($y * 20) + 30);
        }
        ;
    }
    // x = T31, y = T30
    public function HimpunanWaspadaLinearTurunBaru($x, $y)
    {
        if ($x > $y)
            return (($y * 40) + 60);
        if ($y === 0) {
            return 0;
        } else {
            return (70 - ($y * 20));
        }
        ;
    }
    // x = T30, y = T31
    public function HimpunanAmanBaru($x, $y)
    {
        if ($x < $y)
            return (($y * 40) + 60);
        if ($y === 0) {
            return 0;
        } else {
            return (70 - ($y * 20));
        }
        ;
    }

    // Fuzzy Inference Process
    public function calculateWaterQuality($ph, $tds, $turbidity)
    {
        // Fuzzification
        $phBasa = $this->muBasa($ph);
        $phNetral = $this->muNetral($ph);
        $phAsam = $this->muAsam($ph);

        $tdsTinggi = $this->muTinggi($tds);
        $tdsSedang = $this->muSedang($tds);
        $tdsRendah = $this->muRendah($tds);

        $turbidityKeruh = $this->muKeruh($turbidity);
        $turbiditySedang = $this->muSedangTurbidity($turbidity);
        $turbidityJernih = $this->muJernih($turbidity);


        // Fuzzy Rule Base with all 27 rules
        $rules = [
            // Asam rules
            min($phAsam, $tdsRendah, $turbidityJernih),   // Rule 1
            min($phAsam, $tdsRendah, $turbiditySedang),   // Rule 2
            min($phAsam, $tdsRendah, $turbidityKeruh),     // Rule 3
            min($phAsam, $tdsSedang, $turbidityJernih),   // Rule 4
            min($phAsam, $tdsSedang, $turbiditySedang),   // Rule 5
            min($phAsam, $tdsSedang, $turbidityKeruh),     // Rule 6
            min($phAsam, $tdsTinggi, $turbidityJernih),    // Rule 7
            min($phAsam, $tdsTinggi, $turbiditySedang),    // Rule 8
            min($phAsam, $tdsTinggi, $turbidityKeruh),     // Rule 9

            // Netral rules
            min($phNetral, $tdsRendah, $turbidityJernih),    // Rule 10
            min($phNetral, $tdsRendah, $turbiditySedang),    // Rule 11
            min($phNetral, $tdsRendah, $turbidityKeruh),  // Rule 12
            min($phNetral, $tdsSedang, $turbidityJernih),    // Rule 13
            min($phNetral, $tdsSedang, $turbiditySedang), // Rule 14
            min($phNetral, $tdsSedang, $turbidityKeruh),  // Rule 15
            min($phNetral, $tdsTinggi, $turbidityJernih), // Rule 16
            min($phNetral, $tdsTinggi, $turbiditySedang), // Rule 17
            min($phNetral, $tdsTinggi, $turbidityKeruh),   // Rule 18

            // Basa rules
            min($phBasa, $tdsRendah, $turbidityJernih),   // Rule 19
            min($phBasa, $tdsRendah, $turbiditySedang),   // Rule 20
            min($phBasa, $tdsRendah, $turbidityKeruh),     // Rule 21
            min($phBasa, $tdsSedang, $turbidityJernih),   // Rule 22
            min($phBasa, $tdsSedang, $turbiditySedang),   // Rule 23
            min($phBasa, $tdsSedang, $turbidityKeruh),     // Rule 24
            min($phBasa, $tdsTinggi, $turbidityJernih),    // Rule 25
            min($phBasa, $tdsTinggi, $turbiditySedang),    // Rule 26
            min($phBasa, $tdsTinggi, $turbidityKeruh)      // Rule 27
        ];

        // Defuzzification using Center of Gravity (CoG)
        // echo "Hasil MIN dari rules nomer 10 : " . $rules[18];
        // $totalArea = 0;
        // $weightedArea = 0;

        // Agregasi Output/Komposisi Aturan
        $membershipBahaya = max(
            $rules[2], // Rule 3
            $rules[5], // Rule 6
            $rules[6], // Rule 7
            $rules[7], // Rule 8
            $rules[8], // Rule 9
            $rules[17], // Rule 18
            $rules[20], // Rule 21
            $rules[23], // Rule 24
            $rules[24], // Rule 25
            $rules[25], // Rule 26
            $rules[26] // Rule 27
        );

        $membershipWaspada = max(
            $rules[0], // Rule 1
            $rules[1], // Rule 2
            $rules[3], // Rule 4
            $rules[4], // Rule 5
            $rules[11], // Rule 12
            $rules[13], // Rule 14
            $rules[14], // Rule 15
            $rules[15], // Rule 16
            $rules[16], // Rule 17
            $rules[18], // Rule 19
            $rules[19], // Rule 20
            $rules[21], // Rule 22
            $rules[22], // Rule 23
        );

        $membershipAman = max(
            $rules[9], // Rule 10
            $rules[10], // Rule 11
            $rules[12], // Rule 13
        );
        // Himpunan Gabungan
        // Nilai Himpunan Baru Bahaya untuk perhitungan Momen dan Area
        // x = T29, y = T30

        $himpunanBahayaBaru = $this->HimpunanBahayaBaru($membershipBahaya, $membershipWaspada);
        $himpunanWaspadaLinearNaikBaru = $this->HimpunanWaspadaLinearNaikBaru($membershipBahaya, $membershipWaspada);
        $himpunanWaspadaLinearTurunBaru = $this->HimpunanWaspadaLinearTurunBaru($membershipAman, $membershipWaspada);
        $himpunanAmanBaru = $this->HimpunanAmanBaru($membershipWaspada, $membershipAman);
        $result = null;
        // Menentukan Titik Potong
        if ($membershipBahaya > $membershipWaspada || $membershipBahaya != 0 && $membershipBahaya < $membershipWaspada) {
            Log::info('Masuk kondisi 1');
            $titikPotongBawah = $himpunanBahayaBaru;
            $titikPotongAtas = $himpunanWaspadaLinearNaikBaru;
            $momen1 = $membershipBahaya * (($titikPotongBawah ** 2 / 2) - (1 ** 2 / 2));
            $momen2 = (($titikPotongAtas ** 3 / 3 - 15 * $titikPotongAtas ** 2) - ($titikPotongBawah ** 3 / 3 - 15 * $titikPotongBawah ** 2)) / 20;
            $momen3 = $membershipWaspada * ((70 ** 2 / 2) - ($titikPotongAtas ** 2 / 2));
            $area1 = $membershipBahaya * ($titikPotongBawah - 1);
            $area2 = ((($titikPotongAtas ** 2) / 2 - $titikPotongBawah ** 2 / 2 - 30 * ($titikPotongAtas - $titikPotongBawah)) / 20);
            $area3 = $membershipWaspada * (70 - $titikPotongAtas);

            $result = ($momen1 + $momen2 + $momen3) / ($area1 + $area2 + $area3);

        } else if ($membershipWaspada > $membershipBahaya && $membershipAman < $membershipWaspada) {
            Log::info('Masuk kondisi 2');
            $titikPotongBawah = $himpunanWaspadaLinearNaikBaru;
            $titikPotongAtas = $himpunanWaspadaLinearTurunBaru;
            $momen1 = $membershipWaspada * (($titikPotongAtas ** 2 / 2) - ($titikPotongBawah ** 2 / 2));
            $area1 = $membershipWaspada * ($titikPotongAtas - $titikPotongBawah);

            $result = $momen1 / $area1;

        } else if ($membershipAman > $membershipWaspada || $membershipAman < $membershipWaspada) {
            Log::info('Masuk kondisi 3');
            $titikPotongBawah = $himpunanWaspadaLinearTurunBaru;
            $titikPotongAtas = $himpunanAmanBaru;
            $momen1 = $membershipWaspada * (($titikPotongBawah ** 2 / 2) - (30 ** 2 / 2));
            $momen2 = (($titikPotongAtas ** 3 / 3 - 30 * $titikPotongAtas ** 2) - ($titikPotongBawah ** 3 / 3 - 30 * $titikPotongBawah ** 2)) / 40;
            $momen3 = $membershipAman * ((100 ** 2 / 2) - ($titikPotongAtas ** 2 / 2));
            $area1 = $membershipWaspada * ($titikPotongBawah - 60);
            $area2 = ((($titikPotongAtas ** 2) / 2 - $titikPotongBawah ** 2 / 2 - 60 * ($titikPotongAtas - $titikPotongBawah)) / 40);
            $area3 = $membershipAman * (100 - $titikPotongAtas);

            $result = ($momen1 + $momen2 + $momen3) / ($area1 + $area2 + $area3);
        } else {
            Log::info('Tidak masuk kondisi manapun');
        }



        return [
            'ph' => compact('phBasa', 'phNetral', 'phAsam'),
            'tds' => compact('tdsTinggi', 'tdsSedang', 'tdsRendah'),
            'turbidity' => compact('turbidityKeruh', 'turbiditySedang', 'turbidityJernih'),
            'membership' => compact('membershipBahaya', 'membershipWaspada', 'membershipAman'),
            'himpunan' => compact('himpunanBahayaBaru', 'himpunanWaspadaLinearNaikBaru', 'himpunanWaspadaLinearTurunBaru', 'himpunanAmanBaru'),
            'momen' => compact('momen1', 'momen2', 'momen3'),
            'area' => compact('area1', 'area2', 'area3'),
            'rules' => $rules,
            'result' => $result
        ];

    }
    public function defineWaterCondition($result)
    {
        if ($result <= 40) {
            return 'BAHAYA';
        } else if ($result > 30 && $result < 70) {
            return 'WASPADA';
        } else {
            return 'AMAN';
        }
    }
}

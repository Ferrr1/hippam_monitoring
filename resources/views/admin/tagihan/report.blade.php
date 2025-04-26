<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="icon" href="../../../../../public/assets/images/bx-package.svg" />
    <title>Laporan Permintaan Pembelian</title>
    <style>
        @page {
            margin: 100px 25px;
        }

        header {
            text-align: center;
            border-bottom: 3px solid #888;
            margin-bottom: 5px;
        }


        .page {
            page-break-after: always;
        }

        .page:last-child {
            page-break-after: never;
        }

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: Arial, sans-serif;
            -webkit-box-sizing: border-box;
            -moz-box-sizing: border-box;
            -webkit-print-color-adjust: exact;
        }

        body {
            line-height: 1.6;
            padding: 20px;
        }

        .main-table {
            width: 100%;
            border-collapse: collapse;
            font-size: 12px;
        }

        .main-table th,
        .main-table td {
            border: 1px solid #000000;
            padding: 4px;
            text-align: left;
        }

        .main-table th {
            background-color: #ffffff;
            text-align: center;
        }

        .total {
            font-weight: bold;
            text-align: center;
        }

        .header::after {
            content: "";
            border-bottom: #bababa 5px solid;
            display: block;
            bottom: 2;
            position: relative;
        }

        .title {
            font-size: 24px;
            font-weight: bold;
            text-transform: uppercase;
        }

        .sub-title {
            font-size: 14px;
            font-weight: bold;
            text-transform: uppercase;
        }

        .sub-title-1 {
            font-size: 10px;
            font-weight: normal;
            margin-bottom: 10px;
        }

        .ket-permintaan {
            font-size: 12px;
            width: 97%;
            padding: 10px;
            overflow: hidden;
            border: #000000 1px solid;
            margin-bottom: 20px;
        }

        .ket-permintaan-left {
            float: left;
            width: 35%;
        }

        .ket-permintaan-right {
            float: right;
            width: 35%;
        }

        .clearfix::after {
            content: "";
            clear: both;
            display: table;
        }

        .info-table,
        .signature-table {
            width: 100%;
            border-collapse: collapse;
            font-size: 12px;
            margin-top: 20px;
        }

        .info-table td,
        .signature-table td {
            border: none;
        }

        .signature-table .signature td {
            vertical-align: bottom;
            text-align: center;
        }

        .signature-middle td {
            height: 80px;
            font-size: 13px;
            vertical-align: bottom;
            text-align: center;
        }

        .signature-middle-copy td {
            height: 5px;
            font-size: 13px;
            vertical-align: bottom;
            text-align: center;
        }

        .signature-bottom td {
            font-size: 13px;
            vertical-align: bottom;
            text-align: center;
        }

        .signature-table .border-bottom {
            border-bottom: 1px solid #000;
        }

        .signature-line {
            position: relative;
        }

        .signature-line::after {
            content: '';
            position: absolute;
            top: 20px;
            left: 20%;
            right: 20%;
            bottom: 0;
            border-bottom: 1px solid #525252;
        }

        .keterangan-cell {
            max-width: 200px;
            max-height: 2.4em;
            /* 2 baris dengan line-height 1.2 */
            word-wrap: break-word;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            line-height: 1.2em;
        }
    </style>
</head>

<body>
    @php
        $chunks = $tagihans->chunk(20);
    @endphp

    @foreach ($chunks as $chunk)
        <div class="page">
            <header>
                <h2 class="title">LAPORAN TAGIHAN HIPPAM</h2>
                <p class="sub-title">Dusun Medangan</p>
                <p class="sub-title-1">Desa Metatu, Kecamatan Benjeng, Kabupaten Gresik</p>
            </header>

            <main>
                <div class="ket-permintaan clearfix">
                    <table class="ket-permintaan-left">
                        <tr>
                            <td>Periode</td>
                            <td>:</td>
                            <td>{{ $tagihans->first()['periode'] }}</td>
                        </tr>
                    </table>
                </div>

                <table class="main-table">
                    <thead>
                        <tr>
                            <th>No.</th>
                            <th>Nama</th>
                            <th>Nama Perangkat</th>
                            <th>Meter Awal</th>
                            <th>Meter Akhir</th>
                            <th>Detail Periode</th>
                            <th>Pemakaian</th>
                            <th>Total Bayar</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        @foreach ($chunk as $index => $tagihan)
                            <tr>
                                <td>{{ $loop->parent->index * 20 + $loop->iteration }}</td>
                                <td>{{ $tagihan['name'] }}</td>
                                <td>{{ $tagihan['device_id'] }}</td>
                                <td>{{ $tagihan['meter_awal'] }}</td>
                                <td>{{ $tagihan['meter_akhir'] }}</td>
                                <td>{{ $tagihan['tanggal_mulai'] }} - {{ $tagihan['tanggal_akhir'] }}</td>
                                <td>{{ $tagihan['pemakaian'] }}</td>
                                <td>{{ $tagihan['total_bayar'] }}</td>
                                <td>{{ $tagihan['status'] == 'lunas' ? 'Lunas' : 'Belum Lunas' }}</td>
                            </tr>
                        @endforeach
                    </tbody>

                    @if ($loop->last)
                        <tfoot>
                            <tr>
                                <td colspan="3"
                                    style="text-align: center; font-size: 14px; font-weight: bold; padding: 10px;">
                                    Total
                                </td>
                                <td colspan="6" style="padding: 10px;">
                                    <p>Pemakaian : {{ $tagihans->first()['total_pemakaian'] }} <span>m³</span></p>
                                    <p>Tagihan : {{ $tagihans->first()['total_tagihan'] }} </p>
                                </td>
                            </tr>
                        </tfoot>
                    @endif
                </table>
            </main>

            <footer>
                <table class="signature-table">
                    <tr class="signature">
                        <td style="width: 20%;"></td>
                        <td style="width: 20%;">
                            <p>Kepala Dusun Medangan</p>
                        </td>
                    </tr>
                    <tr class="signature-middle-copy">
                        <td style="width: 10%;"></td>
                        <td style="width: 10%; padding-bottom: 80px;" class="signature-line"></td>
                    </tr>
                </table>
            </footer>
        </div>
    @endforeach
</body>

</html>

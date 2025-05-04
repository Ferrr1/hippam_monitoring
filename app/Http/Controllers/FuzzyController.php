<?php

namespace App\Http\Controllers;

use App\Models\SensorData;
use App\Services\FuzzyWaterQualityService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class FuzzyController extends Controller
{
    public function index(Request $request)
    {
        try {
            $search = $request->input('search');
            $sortBy = $request->input('sortBy', 'sensor_data.created_at');
            $sortDir = $request->input('sortDir', 'asc');
            $perPage = $request->input('perPage', 10);

            $query = SensorData::with('device')
                ->join('devices', 'sensor_data.device_id', '=', 'devices.id')
                ->where('devices.device_id', 'like', '%MTG%')
                ->select('sensor_data.*'); // Make sure we only select from sensor_data to avoid ambiguity

            if ($search) {
                $query->where(function ($q) use ($search) {
                    $q->where('devices.device_id', 'like', "%{$search}%")
                        ->orWhere('sensor_data.value', 'like', "%{$search}%");
                });
            }
            $waterQualityService = new FuzzyWaterQualityService();

            $query->orderBy($sortBy, $sortDir);

            $sensorDatas = $query->paginate($perPage)->withQueryString();

            return Inertia::render('admin/fuzzy/index', [
                'sensorDatas' => $sensorDatas->through(fn($sensor) => [
                    'sensor_data_id' => $sensor->sensor_data_id,
                    'device' => [
                        'device_id' => $sensor->device->device_id,
                    ],
                    'value' => $sensor->value,
                    'value_fuzzy' => $waterQualityService->calculateWaterQuality(
                        $sensor->value['ph'] ?? 0,
                        $sensor->value['tds'] ?? 0,
                        $sensor->value['turbidity'] ?? 0
                    ),
                    'water_condition' => $waterQualityService->defineWaterCondition(
                        $waterQualityService->calculateWaterQuality(
                            $sensor->value['ph'] ?? 0,
                            $sensor->value['tds'] ?? 0,
                            $sensor->value['turbidity'] ?? 0
                        )
                    ),
                    'created_at' => $sensor->created_at->format('d/m/Y H:i:s'),
                    'updated_at' => $sensor->updated_at->format('d/m/Y H:i:s'),
                ]),
                'filters' => [
                    'search' => $search,
                    'sortBy' => $sortBy,
                    'sortDir' => $sortDir,
                    'perPage' => $perPage,
                ],
                'pagination' => [
                    'current_page' => $sensorDatas->currentPage(),
                    'per_page' => $sensorDatas->perPage(),
                    'total' => $sensorDatas->total(),
                ],
            ]);
        } catch (\Exception $e) {
            dd($e->getMessage());
        }
    }

    public function show(Request $request, $id)
    {
        $sensorData = SensorData::where('sensor_data_id', $id)->firstOrFail();
        $waterQualityService = new FuzzyWaterQualityService();
        $fuzzyMamdani = $waterQualityService->calculateWaterQuality(
            $sensorData->value['ph'] ?? 0,
            $sensorData->value['tds'] ?? 0,
            $sensorData->value['turbidity'] ?? 0
        );
        $water_condition = $waterQualityService->defineWaterCondition($fuzzyMamdani['result']);
        return Inertia::render('admin/fuzzy/detail-fuzzy', [
            'sensorData' => [
                'id' => $sensorData->sensor_data_id,
                'device' => [
                    'device_id' => $sensorData->device->device_id,
                ],
                'value' => $sensorData->value,
                'value_fuzzy' => $fuzzyMamdani,
                'water_condition' => $water_condition,
                'created_at' => $sensorData->created_at->format('d/m/Y H:i:s'),
                'updated_at' => $sensorData->updated_at->format('d/m/Y H:i:s'),
            ]
        ]);
    }
}

<?php

namespace App\Http\Controllers\Admin;

use App\Exports\SensorDatasExport;
use App\Http\Controllers\Controller;
use App\Imports\SensorDatasImport;
use App\Models\Device;
use App\Models\SensorData;
use Illuminate\Http\Request;
use Maatwebsite\Excel\Facades\Excel;
use Storage;

class SensorDataController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function importData(Request $request, $deviceId)
    {
        try {
            $request->validate([
                'file' => 'required|mimes:csv,xls,xlsx',
                'device_id' => 'required|exists:devices,device_id'
            ]);
            // Proses import
            $file = $request->file('file');
            $id_device = Device::where('device_id', $deviceId)->first()->id;
            // membuat nama file unik
            $nama_file = $file->hashName();

            //temporary file
            $path = $file->storeAs('public/excel/', $nama_file);

            // import data
            $import = Excel::import(new SensorDatasImport($id_device), $file);

            //remove from server
            Storage::delete($path);

            if ($import) {
                //redirect
                return redirect()->route('devices.show', $deviceId)->with(['success' => 'Data Berhasil Diimport!']);
            } else {
                //redirect
                return redirect()->route('devices.show', $deviceId)->with(['error' => 'Data Gagal Diimport!']);
            }
        } catch (\Throwable $th) {
            return redirect()->route('devices.show', $deviceId)->with(['error' => $th->getMessage()]);
        }
    }

    /**
     * Display the specified resource.
     */
    public function exportData($deviceId)
    {
        try {
            $id_device = Device::where('device_id', $deviceId)->first()->id;
            return Excel::download(new SensorDatasExport($id_device), 'sensor_data.xlsx');
        } catch (\Throwable $th) {
            return redirect()->route('devices.show', $deviceId)->with(['error' => $th->getMessage()]);
        }
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($sensorData)
    {
        try {
            $sensorData = SensorData::where('sensor_data_id', $sensorData)->first();
            $sensorData->delete();
            return back()->with('success', __('Data berhasil dihapus'));
        } catch (\Exception $e) {
            return back()->with(['error' => $e->getMessage()]);
        }
    }
}

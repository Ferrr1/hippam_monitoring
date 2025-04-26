import { useEffect } from 'react'
import echo from '@/lib/echo'

const useRealtimeSensor = (
    devices: string[],
    callback: (deviceId: string, data: any,) => void,
    onStatusChange?: (status: string) => void // <- opsional callback tambahan untuk event status global
) => {
    useEffect(() => {
        const channels = devices.map(deviceId => {
            const channel = echo.channel(`data_monitoring.${deviceId}`)
            // console.log(`📡 Subscribed to channel: data_monitoring.${deviceId}`)

            channel.listen('.SensorUpdated', (data: {
                device_id: string,
                status: string,
                value: {
                    ph: number,
                    tds: number,
                    turbidity: number,
                    volume_liters?: number,
                    volume_m3?: number
                }
            }) => {
                // console.log(`📥 Event from ${deviceId}:`, data)
                callback(deviceId, data.value)
            })

            return { deviceId, channel }
        })

        // Subscribe to global water condition status
        const statusChannel = echo.channel('data_status')
        // console.log('📡 Subscribed to channel: data_status')

        statusChannel.listen('.WaterConditionStatus', (data: {
            status: string
        }) => {
            // console.log('📥 Global water status update:', data.status)
            if (onStatusChange) {
                onStatusChange(data.status)
            }
        })

        return () => {
            channels.forEach(({ deviceId }) => {
                // console.log(`🛑 Unsubscribed from: data_monitoring.${deviceId}`)
                echo.leave(`data_monitoring.${deviceId}`)
            })

            // console.log('🛑 Unsubscribed from: data_status')
            echo.leave('data_status')
        }
    }, [devices])
}

export default useRealtimeSensor

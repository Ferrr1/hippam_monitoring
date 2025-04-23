import { useEffect } from 'react'
import echo from '@/lib/echo'

const useRealtimeSensor = (
    deviceIds: string[],
    callback: (deviceId: string, data: any) => void
) => {
    useEffect(() => {
        const channels = deviceIds.map(deviceId => {
            const channel = echo.channel(`data_monitoring.${deviceId}`)
            console.log(`📡 Subscribed to channel: data_monitoring.${deviceId}`)

            channel.listen('.SensorUpdated', (data: { device_id: string, value: any }) => {
                console.log(`📥 Event from ${deviceId}:`, data)
                callback(deviceId, data.value)
            })

            return { deviceId, channel }
        })

        return () => {
            channels.forEach(({ deviceId }) => {
                console.log(`🛑 Unsubscribed from: data_monitoring.${deviceId}`)
                echo.leave(`data_monitoring.${deviceId}`)
            })
        }
    }, [deviceIds])
}

export default useRealtimeSensor

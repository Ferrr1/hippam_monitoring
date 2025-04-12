import { useAppearance } from '@/context/appearance-context';
import React, { useEffect, useState } from 'react';

type AppLogoIconProps = React.ComponentProps<'svg'>;

export default function AppLogoIcon(props: AppLogoIconProps) {
    const { appearance } = useAppearance();
    const [logoColor, setLogoColor] = useState<string>('#000');
    const [isSystemDark, setIsSystemDark] = useState(false);

    // Fungsi untuk mendeteksi apakah tema sistem adalah gelap
    const checkSystemDark = () =>
        typeof window !== 'undefined' &&
        window.matchMedia('(prefers-color-scheme: dark)').matches;

    useEffect(() => {
        // Inisialisasi status tema sistem
        setIsSystemDark(checkSystemDark());

        // Listener untuk perubahan tema sistem
        const media = window.matchMedia('(prefers-color-scheme: dark)');
        const handler = (e: MediaQueryListEvent) => setIsSystemDark(e.matches);
        media.addEventListener('change', handler);

        return () => media.removeEventListener('change', handler);
    }, [isSystemDark, appearance]);

    // Update warna logo berdasarkan appearance dan tema sistem
    useEffect(() => {
        if (appearance === 'dark' || (appearance === 'system' && isSystemDark)) {
            setLogoColor('#fff');
        } else {
            setLogoColor('#000');
        }
    }, [appearance, isSystemDark]);

    return (
        <svg {...props} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M5 21V41H7L7 21H9V11H7L7 5H5V11V21ZM26 7H19V10H25V23H11V10H17V7H10C9.44771 7 9 6.55228 9 6C9 5.44772 9.44771 5 10 5H26C26.5523 5 27 5.44772 27 6C27 6.55228 26.5523 7 26 7ZM28 32V26H42V32H28ZM27 21V11H30C35.5228 11 40 15.4772 40 21V24H30V23C30 21.8954 29.1046 21 28 21H27ZM35 44C37.2091 44 39 42.2091 39 40C39 36.5 35 33 35 33C35 33 31 36.5 31 40C31 42.2091 32.7909 44 35 44Z"
                fill={logoColor}
            />
        </svg>
    );
}

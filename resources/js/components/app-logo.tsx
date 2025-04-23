import { Droplets } from 'lucide-react';

export default function AppLogo() {

    return (
        <div className='flex items-center gap-2'>
            <div className="text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-md">
                <Droplets className="h-10 w-10 text-blue-500 dark:text-blue-200" />
            </div>
            <div className="ml-1 grid flex-1 text-left text-sm text-blue-500 dark:text-blue-200">
                <span className="truncate leading-none font-semibold text-xl">HIPPAM</span>
                <span className='truncate leading-none text-xs'>Dusun Medangan</span>
            </div>
        </div>
    );
}

import AppLogoIcon from './app-logo-icon';

export default function AppLogo() {

    return (
        <>
            <div className="text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-md">
                <AppLogoIcon width={"800px"} height={"800px"} />
            </div>
            <div className="ml-1 grid flex-1 text-left text-sm">
                <span className="truncate leading-none font-semibold text-xl">HIPPAM</span>
                <span className='truncate leading-none text-xs'>Dusun Medangan</span>
            </div>
        </>
    );
}

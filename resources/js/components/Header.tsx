import { Droplets } from "lucide-react";

export default function Header() {
    return (
        <header className="mb-8">
            <div className="flex items-center space-x-3">
                <Droplets className="h-10 w-10 text-blue-500 dark:text-blue-200" />
                <h1 className="text-3xl font-bold bg-gradient-to-r text-blue-500 dark:text-blue-200">
                    Hippam Monitoring
                </h1>
            </div>
        </header>
    );
};

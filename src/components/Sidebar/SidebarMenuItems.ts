import { File, HelpCircle, HomeIcon, Lightbulb, Settings, Target, Users, type LucideIcon } from "lucide-react";
import { useUser } from "../../../hooks/use-user";
import { useFriends } from "../../../hooks/use-friends";
const { user } = useUser();
const userId = user?.id ?? '';
const { pendingRequests} = useFriends(userId);

export interface SidebarMenuItem {
    label: string;
    icon: LucideIcon;
    href: string;
    badge?: string;
    render?: boolean;
}

export const SidebarMenuItems: SidebarMenuItem[] = [
    {
        label: 'Dashboard',
        icon: HomeIcon,
        href: '/dashboard',
        render: true,
    },
    {
        label: 'Matches',
        icon: Target,
        href: '/match',
        render: true,
    },
    {
        label: 'Friends',
        icon: Users,
        href: '/friends',
        badge: pendingRequests.length.toString(),
        render: true,
    },
    {
        label: 'Clubs',
        icon: Users,
        href: '/clubs',
        render: true,
    },
];

export const SidebarMenuItems2: SidebarMenuItem[] = [
    {
        label: 'Help',
        icon: HelpCircle,
        href: '/help',
        render: true,
    },
    {
        label: 'Ideas',
        icon: Lightbulb,
        href: '/ideas',
        render: true,
    },
    {
        label: 'Settings',
        icon: Settings,
        href: '/settings',
        render: true,
    },
    {
        label: 'Patch Notes',
        icon: File,
        href: '/patch_notes',
        render: true,
    },
];
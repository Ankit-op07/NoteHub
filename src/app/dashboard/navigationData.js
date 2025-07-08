import {
    CameraIcon,
    ClipboardListIcon,
    DatabaseIcon,
    FileCodeIcon,
    FileIcon,
    FileTextIcon,
    HelpCircleIcon,
    LayoutDashboardIcon,
    SearchIcon,
    SettingsIcon,
    UsersIcon,
    BookOpenText,
    BookOpenCheck,
    NotebookPen,
    ListVideo,
    Upload as UploadIcon
} from "lucide-react";
import { useSession } from "next-auth/react";

const data = {
    user: {
        name: "",
        email: "",
        avatar: "",
    },
    navMain: [
        {
            title: "Dashboard",
            url: "/dashboard",
            icon: LayoutDashboardIcon,
            role: ["admin", "manager", "student"],
        },
        {
            title: "Browse Notes",
            url: "/dashboard/notes",
            icon: BookOpenText,
            role: ["admin", "manager", "student"],
        },
        {
            title: "Bookmarks",
            url: "/dashboard/bookmarks",
            icon: BookOpenCheck,
            role: ["admin", "manager", "student"],
        },
        {
            title: "PYQS",
            url: "/dashboard/pyqs",
            icon: NotebookPen,
            role: ["admin", "manager", "student"],
        },
        {
            title: "Video Lecture",
            url: "/dashboard/videos",
            icon: ListVideo,
            role: ["admin", "manager", "student"],
        },
        {
            title: "Upload Notes",
            url: "/dashboard/upload/notes",
            icon: UploadIcon,
            role: ["admin", "manager"],
        },
    ],
    navClouds: [
        {
            title: "Capture",
            icon: CameraIcon,
            isActive: true,
            url: "#",
            items: [
                {
                    title: "Active Proposals",
                    url: "#",
                },
                {
                    title: "Archived",
                    url: "#",
                },
            ],
        },
        {
            title: "Proposal",
            icon: FileTextIcon,
            url: "#",
            items: [
                {
                    title: "Active Proposals",
                    url: "#",
                },
                {
                    title: "Archived",
                    url: "#",
                },
            ],
        },
        {
            title: "Prompts",
            icon: FileCodeIcon,
            url: "#",
            items: [
                {
                    title: "Active Proposals",
                    url: "#",
                },
                {
                    title: "Archived",
                    url: "#",
                },
            ],
        },
    ],
    navSecondary: [
        {
            title: "Settings",
            url: "#",
            icon: SettingsIcon,
        },
        {
            title: "Get Help",
            url: "#",
            icon: HelpCircleIcon,
        },
        {
            title: "Search",
            url: "#",
            icon: SearchIcon,
        },
    ],
    documents: [
        {
            name: "Data Library",
            url: "#",
            icon: DatabaseIcon,
        },
        {
            name: "Reports",
            url: "#",
            icon: ClipboardListIcon,
        },
        {
            name: "Word Assistant",
            url: "#",
            icon: FileIcon,
        },
    ],
};

export const filteredData = () => {
    const { data: session } = useSession();
    const role = session?.user?.role;
    const filteredMainData = data.navMain.filter((item) => item.role.includes(role));
    data.navMain = filteredMainData
    return data
}

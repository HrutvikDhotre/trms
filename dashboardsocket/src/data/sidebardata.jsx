import { GrResources } from "react-icons/gr"
import { RiLockPasswordFill } from "react-icons/ri"
import { FaComputer } from "react-icons/fa6"
import { GoHomeFill } from "react-icons/go"
import { nanoid } from 'nanoid'
import { MdSupervisorAccount } from "react-icons/md"
import { MdOutlineViewList } from "react-icons/md"
import { FaTable } from "react-icons/fa6"
import { TbCertificate } from "react-icons/tb"
import { LuFileSpreadsheet } from "react-icons/lu"
import { TiUserDelete } from "react-icons/ti"
import { HiUserAdd } from "react-icons/hi"
import { GrSchedules } from "react-icons/gr"
import { FaTasks } from "react-icons/fa"
import { LuFiles } from "react-icons/lu"
import { BiSolidSchool } from "react-icons/bi"
export const links =
    [{
        key: nanoid(),
        title: 'Home',
        links: [
            {
                name: 'My Tasks',
                icon: <FaTasks className="me-3 mb-1 fs-5" />
            },
            // {
            //     name: 'Others',
            //     icon: <GoHomeFill className="me-3 mb-1 fs-5" />
            // }
        ]
    },
    {
        key: nanoid(),
        title: 'Resources',
        links: [
            {
                name: 'Labs',
                icon: <FaComputer className="me-3 mb-1 fs-5" />
            },
            {
                name: 'Halls',
                icon: <BiSolidSchool className="me-3 mb-1 fs-5" />
            }
        ]
    },
    {
        key: nanoid(),
        title: 'Attendance',
        links: [
            {
                name: 'Mark Attendance',
                icon: < MdSupervisorAccount className="me-3 mb-1 fs-5" />
            },
            {
                name: 'View Attendance',
                icon: <MdOutlineViewList className="me-3 mb-1 fs-5" />
            }
        ]
    },
    {
        key: nanoid(),
        title: 'Timetable',
        links: [
            {
                name: 'View Timetable',
                icon: <FaTable className="me-3" />
            }
        ]
    },
    {
        key: nanoid(),
        title: 'File Uploads',
        links: [
            {
                name: 'Upload Files',
                icon: <LuFiles className="me-3 mb-1 fs-5" />
            },
            // {
            //     name: 'Test Papers',
            //     icon: <LuFileSpreadsheet className="me-3 mb-1 fs-5" />
            // }
        ]
    },
    // {
    //     key: nanoid(),
    //     title: 'Attendance',
    //     links: [
    //         {
    //             name: 'Mark Attendance',
    //             icon: < MdSupervisorAccount className="me-3 mb-1 fs-5" />
    //         },
    //         {
    //             name: 'View Attendance',
    //             icon: <MdOutlineViewList className="me-3 mb-1 fs-5" />
    //         }
    //     ]
    // },
    {
        key: nanoid(),
        title: 'Group Management',
        links: [
            {
                name: 'List Generator',
                icon: < MdSupervisorAccount className="me-3 mb-1 fs-5" />
            },
          
        ]
    },
    {
        key: nanoid(),
        title: 'Others',
        links: [
            {
                name: 'Change Password',
                icon: <RiLockPasswordFill className="me-3 mb-1 fs-5" />
            }
        ]
    }
    ]




export const adminLinks =
    [
        {
            key: nanoid(),
            title: 'User',
            links: [
                {
                    name: 'Add User',
                    icon: <HiUserAdd className="me-3 mb-1 fs-5" />
                },
                {
                    name: 'Delete User',
                    icon: <TiUserDelete className="me-3 mb-1 fs-5" />
                }
            ]
        },
        {
            key: nanoid(),
            title: 'Timetable',
            links: [
                {
                    name: 'Add Timetable',
                    icon: <GrSchedules className="me-3 mb-1 fs-5" />
                }
            ]
        },
        {
            key: nanoid(),
            title: 'Resources',
            links: [
                {
                    name: 'Labs',
                    icon: <FaComputer className="me-3 mb-1 fs-5" />
                },
                {
                    name: 'Halls',
                    icon: <BiSolidSchool className="me-3 mb-1 fs-5" />
                }
            ]
        }

    ]

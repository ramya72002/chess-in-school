"use client";
import React from 'react';
import './AdminHeader.scss'; // Import SCSS directly

const AdminHeader = () => {

    const handleLogout = () => {
        // Clear local storage
        localStorage.clear();
        // Redirect to login page
        window.location.href = "/adminsignin";
    };

    return (
        <header className="adminHeader">
            <nav>
                <ul className="menu">
                    <li className="menuItem">
                        <a href="/admin">
                            <p>Sessions</p>
                        </a>
                    </li>
                    <li className="menuItem">
                        <a href="/admin/admin_upcoming_activities">
                            <p>Upcoming Activities</p>
                        </a>
                    </li>
                    <li className="menuItem">
                        <a href="/admin/admin_image_demo">
                            <p>Image Puzzle</p>
                        </a>
                    </li>
                    <li className="menuItem">
                        <a href="/admin/admin_tournaments">
                            <p>Tournaments</p>
                        </a>
                    </li>
                    <li className="menuItem">
                        <a href="/admin/StudentDetails">
                            <p>Student Details</p>
                        </a>
                    </li>
                    <li className="menuItem1">
                        <button className="logoutButton" onClick={handleLogout}>
                            <p>Log Out</p>
                        </button>
                    </li>
                </ul>
            </nav>
        </header>
    );
}

export default AdminHeader;

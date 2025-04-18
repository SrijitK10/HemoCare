import React from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from '../../contexts/AuthContext';
import Sidebar from "../sidebar/sidebar";

export default function Admin() {
	const navigate = useNavigate();
	const { logout } = useAuth();

	const handleLogout = async () => {
		await logout();
		navigate('/login');
	};

	return (
		<>
			<Sidebar />
			<div className="relative md:ml-64 bg-off_white">
				{/* Admin Header with Logout */}
				<div className="relative bg-white shadow z-10">
					<div className="px-4 sm:px-6 lg:px-8 py-4">
						<div className="flex justify-between items-center">
							<h1 className="text-2xl font-bold text-gray-900">HemoCare Admin Dashboard</h1>
							<div className="flex items-center space-x-4">
								<button
									onClick={handleLogout}
									className="flex items-center px-4 py-2 border border-transparent rounded-md shadow-lg text-sm font-medium text-gray-900 bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:from-red-500 hover:via-red-600 hover:to-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] relative overflow-hidden group"
								>
									<span className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></span>
									<span className="relative flex items-center">
										<svg className="w-5 h-5 mr-2 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
										</svg>
										Logout
									</span>
								</button>
							</div>
						</div>
					</div>
				</div>

				{/* Main Content */}
				<div className="px-4 md:px-10 mx-auto w-full -m-24">
					<div className="flex flex-wrap">
						<div className="w-full px-4">
							<Outlet />
						</div>
					</div>
				</div>
			</div>
		</>
	);
}

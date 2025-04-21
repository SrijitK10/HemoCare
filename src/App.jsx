import HomePage from "./components/pages/home/home-page";
import { Routes, Route } from "react-router-dom";
import DonateBloodPage from "./components/pages/donate-blood/donate-blood-page";
import HostBloodDrivePage from "./components/pages/host-blood-drive/host-blood-drive";
import NeedBloodPage from "./components/pages/need-blood/need-blood-page";
import ContactPage from "./components/pages/contact/contact-page";
import Admin from "./components/layouts/admin";
import LoginPage from "./components/pages/login/login-page";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import { AuthProvider } from "./contexts/AuthContext";
import { DatabaseProvider } from "./contexts/DatabaseContext";

import Dashboard from "../src/components/views/admin/dashboard";
import AdminDonateBlood from "../src/components/views/admin/admin-donate-blood";
import AdminNeedBlood from "../src/components/views/admin/admin-need-blood";
import AdminHostBloodDrive from "../src/components/views/admin/admin-host-blood-drive";
import AdminNeedHelp from "../src/components/views/admin/admin-need-help";
import AdminBloodStock from './components/views/admin/admin-blood-stock';
import EmailTester from './components/utility-functions/EmailTester';
import DataChecker from './components/utility-functions/DataChecker';

export default function App() {
	return (
		<AuthProvider>
			<DatabaseProvider>
				{/* <HeaderComponent /> */}
				{/* <BrowserRouter> */}
				<Routes>
					<Route exact path="/" element={<HomePage />} />
					<Route
						path="/host-blood-drive"
						element={<HostBloodDrivePage />}
					/>
					<Route path="/donate-blood" element={<DonateBloodPage />} />
					<Route path="/need-blood" element={<NeedBloodPage />} />
					<Route path="/contact" element={<ContactPage />} />
					<Route path="/login" element={<LoginPage />} />
					<Route path="/email-tester" element={<EmailTester />} />
					<Route path="/data-checker" element={<DataChecker />} />
					<Route
						path="/admin"
						element={
							<ProtectedRoute>
								<Admin />
							</ProtectedRoute>
						}
					>
						<Route index element={<Dashboard />} />
						<Route path="donate-blood" element={<AdminDonateBlood />} />
						<Route path="need-blood" element={<AdminNeedBlood />} />
						<Route
							path="host-blood-drive"
							element={<AdminHostBloodDrive />}
						/>
						<Route path="need-help" element={<AdminNeedHelp />} />
						<Route path="blood-stock" element={<AdminBloodStock />} />
						
						{/* <Route path="/redirect" element={<Navigate to="/" />} /> */}
					</Route>
				</Routes>
				{/* </BrowserRouter> */}
				{/* <BeforeFooterCTA />
				<FooterComponent /> */}
			</DatabaseProvider>
		</AuthProvider>
	);
}

import React from 'react';
import RequestTable from '../../admin/RequestTable';
import { useDatabase } from '../../../contexts/DatabaseContext';

const AdminHostBloodDrive = () => {
	const { loading, error, bloodDriveRequests } = useDatabase();
	
	const columns = [
		{ key: 'name', label: 'Name' },
		{ key: 'email', label: 'Email' },
		{ key: 'phone', label: 'Phone' },
		{ key: 'institute', label: 'Institute' },
		{ key: 'designation', label: 'Designation' },
		{ key: 'city', label: 'City' },
		{ key: 'dateTime', label: 'Preferred Date' },  // Change this line
		{ key: 'status', label: 'Status' }
	];

	if (loading) {
		return (
			<div className="flex justify-center items-center h-64">
				<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="bg-red-50 border-l-4 border-red-500 p-4 text-red-700">
				<p>Error: {error}</p>
			</div>
		);
	}

	return (
		<div className="container mx-auto px-4 py-8">
			<h1 className="text-2xl font-bold text-gray-900 mb-6">Blood Drive Hosting Requests</h1>
			<RequestTable
				collectionName="blood_drive_requests"
				title="Hosting Requests"
				columns={columns}
			/>
		</div>
	);
};

export default AdminHostBloodDrive;

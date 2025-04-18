import React from 'react';
import RequestTable from '../../admin/RequestTable';
import { useDatabase } from '../../../contexts/DatabaseContext';

const AdminHostBloodDrive = () => {
	const { loading, error } = useDatabase();
	
	const columns = [
		{ key: 'organization', label: 'Organization' },
		{ key: 'contactPerson', label: 'Contact Person' },
		{ key: 'email', label: 'Email' },
		{ key: 'phone', label: 'Phone' },
		{ key: 'location', label: 'Location' },
		{ key: 'date', label: 'Event Date' },
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
			<h1 className="text-2xl font-bold text-gray-900 mb-6">Host Blood Drive Requests</h1>
			<RequestTable
				collectionName="appointments"
				title="Blood Drive Hosting Requests"
				columns={columns}
			/>
		</div>
	);
};

export default AdminHostBloodDrive;

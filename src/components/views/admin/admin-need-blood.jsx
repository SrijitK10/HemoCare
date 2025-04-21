import React from 'react';
import RequestTable from '../../admin/RequestTable';

const AdminNeedBlood = () => {
	const columns = [
		{ key: 'name', label: 'Name' },
		{ key: 'email', label: 'Email' },
		{ key: 'phone', label: 'Phone' },
		{ key: 'bloodType', label: 'Blood Type' },
		{ key: 'location', label: 'Location' },
		{ key: 'urgency', label: 'Urgency', className: 'font-semibold' },
		{ key: 'status', label: 'Status' }
	];

	return (
		<div className="container mx-auto px-4 py-8">
			<h1 className="text-2xl font-bold text-gray-900 mb-6">Emergency Blood Requests</h1>
			<RequestTable
				collectionName="emergency_blood_requests"
				title="Emergency Requests"
				columns={columns}
			/>
		</div>
	);
};

export default AdminNeedBlood;

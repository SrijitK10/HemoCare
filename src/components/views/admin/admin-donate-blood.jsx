import React from 'react';
import RequestTable from '../../admin/RequestTable';

const AdminDonateBlood = () => {
	const columns = [
		{ key: 'name', label: 'Name' },
		{ key: 'email', label: 'Email' },
		{ key: 'phone', label: 'Phone' },
		{ key: 'bloodType', label: 'Blood Type' },
		{ key: 'date', label: 'Appointment Date', className: 'font-semibold text-gray-900' },
		{ key: 'time', label: 'Appointment Time' },
		{ key: 'status', label: 'Status' }
	];

	return (
		<div className="container mx-auto px-4 py-8">
			<h1 className="text-2xl font-bold text-gray-900 mb-6">Blood Donation Appointments</h1>
			<RequestTable
				collectionName="appointments"
				title="Appointment List"
				columns={columns}
			/>
		</div>
	);
};

export default AdminDonateBlood;

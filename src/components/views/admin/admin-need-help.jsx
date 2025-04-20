import React from 'react';
import RequestTable from '../../admin/RequestTable';
import { useDatabase } from '../../../contexts/DatabaseContext';

const AdminNeedHelp = () => {
	const { loading, error, helpRequests } = useDatabase();
	
	const columns = [
		{ key: 'name', label: 'Name' },
		{ key: 'email', label: 'Email' },
		{ key: 'phone', label: 'Phone' },
		{ key: 'reason', label: 'Reason' },
		{ key: 'message', label: 'Message' },
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
			<h1 className="text-2xl font-bold text-gray-900 mb-6">Help Requests</h1>
			<RequestTable
				collectionName="helpRequests"
				title="Help Requests"
				columns={columns}
			/>
		</div>
	);
};

export default AdminNeedHelp;

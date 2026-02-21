import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

// Simplified internal components (you can move these to separate files later)
const AdminView = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-100 p-6 rounded-lg shadow">Total LDAP Users: 150</div>
        <div className="bg-green-100 p-6 rounded-lg shadow">System Health: Good</div>
        <div className="bg-purple-100 p-6 rounded-lg shadow">Active Roles: 5</div>
    </div>
);

const ManagerView = () => (
    <div className="bg-white p-6 rounded-lg shadow border">
        <h4 className="font-bold">Department Reports</h4>
        <p>You have access to view logs and user activity.</p>
    </div>
);

const DefaultView = () => (
    <div className="p-6 text-gray-900">You're logged in as a Standard User!</div>
);

export default function Dashboard({ auth }) {
    // Check for roles (Spatie usually returns an array)
    const roles = auth.roles || [];
    const isAdmin = roles.includes('admin');
    const isManager = roles.includes('manager');

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    {isAdmin ? 'Admin Dashboard' : isManager ? 'Manager Dashboard' : 'Dashboard'}
                </h2>
            }
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            {/* Role-Based Conditional Rendering */}
                            {isAdmin && <AdminView />}
                            {isManager && <ManagerView />}
                            {!isAdmin && !isManager && <DefaultView />}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
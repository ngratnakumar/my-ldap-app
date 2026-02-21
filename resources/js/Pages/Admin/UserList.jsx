import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';

export default function UserList({ auth, users, availableRoles }) {
    const { post, processing } = useForm();

    const handleRoleChange = (userId, roleName) => {
        post(route('admin.users.updateRole', { user: userId, role: roleName }));
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="User Management" />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                        <h3 className="text-lg font-bold mb-4">LDAP Synced Users</h3>
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead>
                                <tr>
                                    <th className="px-6 py-3 text-left">Name</th>
                                    <th className="px-6 py-3 text-left">Email</th>
                                    <th className="px-6 py-3 text-left">Current Role</th>
                                    <th className="px-6 py-3 text-left">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {users.map((user) => (
                                    <tr key={user.id}>
                                        <td className="px-6 py-4">{user.name}</td>
                                        <td className="px-6 py-4">{user.email}</td>
                                        <td className="px-6 py-4">
                                            {user.roles.length > 0 ? user.roles[0].name : 'No Role'}
                                        </td>
                                        <td className="px-6 py-4">
                                            <select 
                                                className="border-gray-300 rounded-md"
                                                onChange={(e) => handleRoleChange(user.id, e.target.value)}
                                                disabled={processing}
                                            >
                                                <option value="">Assign Role...</option>
                                                {availableRoles.map(role => (
                                                    <option key={role.id} value={role.name}>{role.name}</option>
                                                ))}
                                            </select>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
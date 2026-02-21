import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';
import axios from 'axios';

export default function UserList({ auth, users, availableRoles }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [ldapUser, setLdapUser] = useState(null);
    const [searchError, setSearchError] = useState('');

    // Form for role updates and importing new users
    const { post, setData, processing, reset } = useForm({
        username: '',
        name: '',
        email: '',
        role: '',
    });

    // 1. Search LDAP/FreeIPA
    const handleLdapSearch = async () => {
        setSearchError('');
        setLdapUser(null);
        
        try {
            const response = await axios.post(route('admin.users.search'), { username: searchQuery });
            setLdapUser(response.data);
            // Prepare the form data for importing
            setData({
                username: response.data.username,
                name: response.data.name,
                email: response.data.email,
                role: '', 
            });
        } catch (err) {
            setSearchError(err.response?.data?.message || 'User not found in LDAP');
        }
    };

    // 2. Import the searched user
    const handleImportUser = (e) => {
        e.preventDefault();
        post(route('admin.users.store'), {
            onSuccess: () => {
                setLdapUser(null);
                setSearchQuery('');
                reset();
            },
        });
    };

    // 3. Existing Role Update Logic
    const handleRoleChange = (userId, roleName) => {
        post(route('admin.users.updateRole', { user: userId, role: roleName }));
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="User Management" />
            
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    
                    {/* --- SECTION 1: SEARCH & ADD FROM LDAP --- */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6 border-b border-gray-200">
                        <h3 className="text-lg font-bold mb-4">Add User from LDAP/FreeIPA</h3>
                        <div className="flex gap-4">
                            <input 
                                type="text"
                                placeholder="Enter LDAP Username (uid)..."
                                className="border-gray-300 rounded-md w-full max-w-xs"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <button 
                                onClick={handleLdapSearch}
                                className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
                            >
                                Search
                            </button>
                        </div>

                        {searchError && <p className="mt-2 text-red-600 text-sm">{searchError}</p>}

                        {ldapUser && (
                            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
                                <p className="font-semibold text-blue-800">User Found: {ldapUser.name} ({ldapUser.email})</p>
                                <form onSubmit={handleImportUser} className="mt-3 flex items-center gap-4">
                                    <select 
                                        required
                                        className="border-gray-300 rounded-md"
                                        onChange={(e) => setData('role', e.target.value)}
                                    >
                                        <option value="">Select Initial Role...</option>
                                        {availableRoles.map(role => (
                                            <option key={role.id} value={role.name}>{role.name}</option>
                                        ))}
                                    </select>
                                    <button 
                                        type="submit"
                                        disabled={processing}
                                        className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:opacity-50"
                                    >
                                        Add to Dashboard
                                    </button>
                                </form>
                            </div>
                        )}
                    </div>

                    {/* --- SECTION 2: EXISTING USER LIST --- */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                        <h3 className="text-lg font-bold mb-4">Managed Dashboard Users</h3>
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead>
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Current Role</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Change Role</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {users.map((user) => (
                                    <tr key={user.id}>
                                        <td className="px-6 py-4 whitespace-nowrap">{user.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                                {user.roles.length > 0 ? user.roles[0].name : 'No Role'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <select 
                                                className="border-gray-300 rounded-md text-sm"
                                                value={user.roles[0]?.name || ''}
                                                onChange={(e) => handleRoleChange(user.id, e.target.value)}
                                                disabled={processing}
                                            >
                                                <option value="" disabled>Change to...</option>
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
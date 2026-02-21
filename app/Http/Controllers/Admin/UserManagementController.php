<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Spatie\Permission\Models\Role;
use Inertia\Inertia;
use LdapRecord\Models\ActiveDirectory\User as LdapUser; // Change to FreeIPA model if needed

class UserManagementController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/UserList', [
            'users' => User::with('roles')->get(),
            'availableRoles' => Role::all()->pluck('name'), // Sending just names is easier for React
        ]);
    }

    // NEW: Search for a user in FreeIPA/OpenLDAP
    public function searchLdap(Request $request)
    {
        $request->validate(['username' => 'required|string']);

        // Search LDAP by 'uid' (standard for FreeIPA/OpenLDAP)
        $ldapUser = LdapUser::where('uid', '=', $request->username)->first();

        if (!$ldapUser) {
            return response()->json(['message' => 'User not found in LDAP directory.'], 404);
        }

        return response()->json([
            'username' => $ldapUser->getFirstAttribute('uid'),
            'email' => $ldapUser->getFirstAttribute('mail'),
            'name' => $ldapUser->getFirstAttribute('cn'),
        ]);
    }

    // NEW: Save the LDAP user to local DB and assign role
    public function store(Request $request)
    {
        $request->validate([
            'username' => 'required|unique:users,username',
            'email' => 'required|email|unique:users,email',
            'name' => 'required',
            'role' => 'required|exists:roles,name',
        ]);

        $user = User::create([
            'name' => $request->name,
            'username' => $request->username,
            'email' => $request->email,
            'password' => bcrypt(str()->random(16)), // Placeholder; LDAP handles actual auth
        ]);

        $user->assignRole($request->role);

        return back()->with('message', 'User imported and role assigned successfully');
    }

    public function updateRole(Request $request, User $user)
    {
        $request->validate(['role' => 'required|string']);
        $user->syncRoles([$request->role]);
        return back()->with('message', 'Role updated successfully');
    }
}
<?php
namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use LdapRecord\Models\FreeIPA\User as LdapUser; // Or OpenLDAP model

class UserController extends Controller
{
    // Render the Admin UI
    public function index()
    {
        return Inertia::render('Admin/UserManagement', [
            'users' => User::with('roles')->get(), // Assumes Spatie roles
        ]);
    }

    // Search LDAP and return result to React
    public function search(Request $request)
    {
        $username = $request->username;
        $ldapUser = LdapUser::where('uid', '=', $username)->first();

        if (!$ldapUser) {
            return back()->withErrors(['username' => 'User not found in LDAP/FreeIPA']);
        }

        return response()->json([
            'username' => $ldapUser->uid[0],
            'email' => $ldapUser->mail[0],
            'name' => $ldapUser->cn[0]
        ]);
    }

    // "Add" them to your local DB so you can give them roles
    public function store(Request $request)
    {
        $user = User::firstOrCreate(
            ['email' => $request->email],
            [
                'name' => $request->name,
                'username' => $request->username,
                'password' => bcrypt(str_random(16)), // Dummy password (LDAP handles login)
            ]
        );

        $user->assignRole($request->role);

        return back()->with('success', 'User added to Dashboard');
    }
}
<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Spatie\Permission\Models\Role;
use Inertia\Inertia;

class UserManagementController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/UserList', [
            // Get users with their roles
            'users' => User::with('roles')->get(),
            // Get all available roles to populate a dropdown
            'availableRoles' => Role::all(),
        ]);
    }

    public function updateRole(Request $request, User $user)
    {
        $request->validate(['role' => 'required|string']);
        
        // SyncRoles removes old roles and adds the new one
        $user->syncRoles([$request->role]);

        return back()->with('message', 'Role updated successfully');
    }
}
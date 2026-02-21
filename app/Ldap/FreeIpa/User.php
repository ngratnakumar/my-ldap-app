<?php

namespace App\Ldap\FreeIpa;

use LdapRecord\Models\Model;


class User extends Model
{
    protected ?string $connection = 'freeipa';

    public static array $objectClasses = [
        'top',
        'person',
        'posixaccount',
        'inetorgperson',
    ];

    // This forces Laravel to search within the base DN you defined
    public static ?string $searchBaseDn = 'cn=users,cn=accounts,dc=ncra,dc=tifr,dc=res,dc=in';
}
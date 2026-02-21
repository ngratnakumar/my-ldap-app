<?php

namespace App\Ldap\OpenLdap;

use LdapRecord\Models\Model;

class User extends Model
{
    /**
     * The object classes of the LDAP model.
     */
    public static $objectClasses = [
        'top',
        'person',
        'organizationalperson',
        'inetorgperson',
    ];

    /**
     * The connection name for this model.
     * Matches the key in config/ldap.php
     */
    protected $connection = 'openldap';
}
<?php

namespace App\Ldap;

use LdapRecord\Models\Entry;

class User extends Entry
{
    /**
     * Set the GUID key to 'uid'. 
     * This tells Laravel: "Use the username as the unique primary key."
     */
    protected string $guidKey = 'uid';

    /**
     * Return the uid as the unique ID for database syncing.
     */
    public function getGuid(): ?string
    {
        return $this->getFirstAttribute('uid');
    }
}
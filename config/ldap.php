<?php

return [
    'default' => env('LDAP_CONNECTION', 'openldap'),

    'connections' => [
        'openldap' => [
            'hosts' => [env('OPENLDAP_HOST')],
            'base_dn' => env('OPENLDAP_BASE_DN'),
            'username' => env('OPENLDAP_USER'),
            'password' => env('OPENLDAP_PASS'),
            'port' => 389,
            // Removed identifiers block from here
        ],
        'freeipa' => [
            'hosts'    => [env('FREEIPA_HOST')],
            'username' => env('FREEIPA_USER'),
            'password' => env('FREEIPA_PASS'),
            'port'     => env('FREEIPA_PORT', 389),
            'base_dn'  => env('FREEIPA_BASE_DN'),
            'use_ssl'  => env('FREEIPA_SSL'),
            'use_tls'  => env('FREEIPA_TLS'),
            // Removed identifiers block from here
            'options'  => [
                LDAP_OPT_X_TLS_REQUIRE_CERT => 0, // Removed the 'a' typo
                LDAP_OPT_PROTOCOL_VERSION   => 3,
            ],
        ],
    ],
];
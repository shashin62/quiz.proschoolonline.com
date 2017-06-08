<?php

// autoload_static.php @generated by Composer

namespace Composer\Autoload;

class ComposerStaticInit01b3acdfdd9644cdac507abe94848bf3
{
    public static $prefixLengthsPsr4 = array (
        'M' => 
        array (
            'Medoo\\' => 6,
        ),
    );

    public static $prefixDirsPsr4 = array (
        'Medoo\\' => 
        array (
            0 => __DIR__ . '/..' . '/catfan/medoo/src',
        ),
    );

    public static function getInitializer(ClassLoader $loader)
    {
        return \Closure::bind(function () use ($loader) {
            $loader->prefixLengthsPsr4 = ComposerStaticInit01b3acdfdd9644cdac507abe94848bf3::$prefixLengthsPsr4;
            $loader->prefixDirsPsr4 = ComposerStaticInit01b3acdfdd9644cdac507abe94848bf3::$prefixDirsPsr4;

        }, null, ClassLoader::class);
    }
}
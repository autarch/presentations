use v6;

use JSON::Fast;

my %data = (
    1 => ${
        name => 'John Doe',
        wanted-for => 'stealing clown cars',
        bounty => '100,000 bitcoin',
    },
    7 => ${
        name => 'Huey-Ling Chen',
        wanted-for => 'being too adorable',
        bounty => '5 Panamian balboa',
    },
    42 => ${
        name => 'Arthur Dent',
        wanted-for => 'criminal interference with demolition operations',
        bounty => '2 Pan-Galactic Gargle Blasters',
    },
);

say to-json( %data, :pretty );

use v6;

my $file = @*ARGS[0];

my $words = Bag.new( open($file).words );

say "$_: $words{$_}"
    for $words.keys.sort: {
        $words{$^b} <=> $words{$^a}
        or
        $^a.fc cmp $^b.fc
    };

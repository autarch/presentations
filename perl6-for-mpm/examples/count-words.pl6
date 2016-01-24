use v6;

my $file = @*ARGS[0];
my %words;
for $file.IO.open.words -> $word {
    %words{$word}++;
}

say "$_: %words{$_}"
    for %words.keys.sort: {
        %words{$^b} <=> %words{$^a}
        or
        $^a.lc cmp $^b.lc
    };

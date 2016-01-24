use v5.20;
use strict;
use warnings;
use autodie;

my $file = shift;
open my $fh, '<', $file;
my %words;
while ( defined( my $line = <$fh> ) ) {
    chomp $line;
    $words{$_}++ for split /\s+/, $line;
}

say "$_: $words{$_}"
    for sort {
            $words{$b} <=> $words{$a}
            or lc $a cmp lc $b
        } keys %words;

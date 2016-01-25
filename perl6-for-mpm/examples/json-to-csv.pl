use v5.20;
use strict;
use warnings;
use autodie;

use Getopt::Long;
use Path::Class qw( file );
use JSON::MaybeXS;
use Text::CSV_XS;

my ( $input, $output );
GetOptions(
    'input:s'  => \$input,
    'output:s' => \$output,
);
die 'You must set --input and --output files'
    unless $input && $output;

my $csv = Text::CSV_XS->new( { binary => 1, eol => "\r\n" } );
open my $fh, '>', $output;
$csv->print( $fh, [qw( criminal_id name crime bounty )] );

my $json = JSON::MaybeXS->new( utf8 => 1 );
my $content = $json->decode( scalar file($input)->slurp );

for my $id ( sort { $a <=> $b } keys %{$content} ) {
    $csv->print(
        $fh,
        [
            $id,
            @{ $content->{$id} }{qw( name wanted-for bounty )}
        ]
    );
}

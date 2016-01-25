use v6;

use JSON::Tiny;
use Text::CSV;

sub MAIN (Str:D :$input, Str:D :$output) {
    my $csv = Text::CSV.new( :binary, eol => "\r\n" );
    my $fh = $output.IO.open(:w);

    $csv.say( $fh, < criminal_id name crime bounty > );
    my $content = from-json( $input.IO.open(:r).slurp-rest );
    for $content.keys.sort( { $^a <=> $^b } ) -> $id {
        $csv.say(
            $fh,
            ( $id, $content{$id}< name wanted-for bounty > )
        );
    }
}

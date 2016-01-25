use v6;

class File {
    use File::LibMagic;

    has Str $.filename;
    has Str $.mime-type;
    has Buf $.content;

    method open ($class: Str:D $filename) {
        my %info = File::LibMagic.new.from-filename($filename); 
        return $class.new(
            filename  => $filename,
            mime-type => %info<mime-type>,
            content   => $filename.IO.open(:r).slurp-rest(:bin),
        );
    }
}

my $file = File.open( $*PROGRAM-NAME );
say $file.filename;
say $file.mime-type;
say $file.content.decode('UTF-8').lines[0];

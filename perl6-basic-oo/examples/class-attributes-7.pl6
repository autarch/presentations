# sample(main)
class Log {
    has $.name;
    has $!level;

    submethod BUILD ( :$!name, :$!level ) { }
    method dump {
        say "Name  = $.name";
        say "Level = $!level";
    }
}

Log.new( name => 'Error', level => 42 ).dump;
# end-sample

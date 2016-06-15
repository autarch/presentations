# sample(main)
class Log {
    has $.name;
    has $!level;

    submethod BUILD ( :$!name, :$!level ) { }
}

Log.new( name => 'Error', level => 42 );
# end-sample

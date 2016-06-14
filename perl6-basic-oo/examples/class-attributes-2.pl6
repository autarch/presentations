# sample(main)
class Log {
    has $.level = 42;
}

my $log42 = Log.new;
say $log42.level;

my $log84 = Log.new( level => 84 );
say $log84.level;
# end-sample

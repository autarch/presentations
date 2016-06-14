# sample(main)
class Log1 {
    has $.level;
}

my $log = Log1.new( level => 42 );
say $log.level;

class Log2 {
    has $.level is required;
}

$log = Log2.new( level => 43 );
say $log.level;

$log = Log2.new;
# end-sample

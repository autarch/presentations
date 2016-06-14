# sample(main)
class Log {
    has $!level = 42;
    method say-level { say $!level }
}

Log.new( level => 42 ).say-level;
say Log.new( level => 1 ).level;
# end-sample

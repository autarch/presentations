# sample(main)
class Log {
    has $.level;
    method say-level { say self.level }
}

Log.new( level => 42 ).say-level;
say Log.new( level => 1 ).level;
# end-sample

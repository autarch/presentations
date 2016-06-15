# sample(main)
class Log {
    has $!level = 42;
    method say-level { say $!level }
}

Log.new.say-level;
say Log.new.level;
# end-sample

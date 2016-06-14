# sample(main)
class Log {
    has $.level is required;
    has $.double-level = self.level * 2;
}

say Log.new( level => 1 ).double-level;
say Log.new( level => 42 ).double-level;
# end-sample

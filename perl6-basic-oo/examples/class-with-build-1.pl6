# sample(main)
class Log {
    submethod BUILD {
        say 'Made a log';
    }
}

my $log = Log.new;
say $log;
# end-sample
